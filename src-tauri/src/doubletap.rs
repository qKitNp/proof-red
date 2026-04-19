//! macOS double-tap-Control detector backed by a CGEventTap.
//!
//! Runs in a dedicated thread, listens to FlagsChanged / KeyDown / mouse-down
//! events globally, and emits "doubletap-control" to the frontend when the
//! user taps the Control key twice within DOUBLE_TAP_WINDOW_MS without any
//! intervening keyboard or mouse activity.

use std::sync::Mutex;
use std::time::Instant;

use core_foundation::runloop::{kCFRunLoopCommonModes, CFRunLoop};
use core_graphics::event::{
    CGEventFlags, CGEventTap, CGEventTapLocation, CGEventTapOptions, CGEventTapPlacement,
    CGEventType, EventField, KeyCode,
};
use tauri::{AppHandle, Emitter, Runtime};

const DOUBLE_TAP_WINDOW_MS: u128 = 300;
const PERMISSION_TOAST_EVENT: &str = "doubletap-permission-missing";
const TRIGGER_EVENT: &str = "doubletap-control";

struct State {
    last_ctrl_down: Option<Instant>,
    clean: bool,
}

pub fn start<R: Runtime>(app: AppHandle<R>) {
    std::thread::Builder::new()
        .name("doubletap-control".into())
        .spawn(move || run(app))
        .expect("failed to spawn doubletap thread");
}

fn run<R: Runtime>(app: AppHandle<R>) {
    let state: Mutex<State> = Mutex::new(State {
        last_ctrl_down: None,
        clean: true,
    });

    let app_for_cb = app.clone();
    let tap_result = CGEventTap::new(
        CGEventTapLocation::HID,
        CGEventTapPlacement::HeadInsertEventTap,
        CGEventTapOptions::ListenOnly,
        vec![
            CGEventType::FlagsChanged,
            CGEventType::KeyDown,
            CGEventType::LeftMouseDown,
            CGEventType::RightMouseDown,
        ],
        move |_proxy, etype, event| {
            let Ok(mut s) = state.lock() else { return None };

            match etype {
                CGEventType::FlagsChanged => {
                    let keycode =
                        event.get_integer_value_field(EventField::KEYBOARD_EVENT_KEYCODE) as u64;
                    let is_control = keycode == KeyCode::CONTROL as u64
                        || keycode == KeyCode::RIGHT_CONTROL as u64;
                    if !is_control {
                        s.clean = false;
                        s.last_ctrl_down = None;
                        return None;
                    }
                    let down = event
                        .get_flags()
                        .contains(CGEventFlags::CGEventFlagControl);
                    if down {
                        let now = Instant::now();
                        let fired = matches!(
                            s.last_ctrl_down,
                            Some(prev)
                                if s.clean
                                    && now.duration_since(prev).as_millis()
                                        <= DOUBLE_TAP_WINDOW_MS
                        );
                        if fired {
                            let _ = app_for_cb.emit(TRIGGER_EVENT, ());
                            s.last_ctrl_down = None;
                        } else {
                            s.last_ctrl_down = Some(now);
                        }
                        s.clean = true;
                    }
                }
                CGEventType::KeyDown
                | CGEventType::LeftMouseDown
                | CGEventType::RightMouseDown => {
                    s.clean = false;
                    s.last_ctrl_down = None;
                }
                _ => {}
            }
            None
        },
    );

    let tap = match tap_result {
        Ok(t) => t,
        Err(()) => {
            eprintln!(
                "[doubletap] CGEventTapCreate failed (Accessibility permission missing?)"
            );
            let _ = app.emit(PERMISSION_TOAST_EVENT, ());
            return;
        }
    };

    let loop_source = match tap.mach_port.create_runloop_source(0) {
        Ok(s) => s,
        Err(_) => {
            eprintln!("[doubletap] create_runloop_source failed");
            return;
        }
    };
    let current = CFRunLoop::get_current();
    unsafe {
        current.add_source(&loop_source, kCFRunLoopCommonModes);
    }
    tap.enable();
    println!("[doubletap] event tap installed; waiting for double-tap Control");

    CFRunLoop::run_current();
}
