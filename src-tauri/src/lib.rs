use enigo::{Direction, Enigo, Key, Keyboard, Settings};
use tauri::{Manager, PhysicalPosition};
use tauri_plugin_clipboard_manager::ClipboardExt;
use tauri_plugin_sql::{Migration, MigrationKind};

mod doubletap;

#[derive(serde::Serialize)]
pub struct Capture {
    app_name: String,
    text: String,
}

#[cfg(target_os = "macos")]
fn frontmost_app() -> String {
    use std::process::Command;
    let out = Command::new("osascript")
        .arg("-e")
        .arg("tell application \"System Events\" to get name of first application process whose frontmost is true")
        .output();
    match out {
        Ok(o) if o.status.success() => String::from_utf8_lossy(&o.stdout).trim().to_string(),
        _ => "unknown".to_string(),
    }
}

#[cfg(not(target_os = "macos"))]
fn frontmost_app() -> String {
    "unknown".to_string()
}

#[cfg(target_os = "macos")]
const MOD_KEY: Key = Key::Meta;
#[cfg(not(target_os = "macos"))]
const MOD_KEY: Key = Key::Control;

fn send_mod_key(app: &tauri::AppHandle, letter: char) -> Result<(), String> {
    let (tx, rx) = std::sync::mpsc::channel();
    app.run_on_main_thread(move || {
        let res = (|| -> Result<(), String> {
            let mut enigo = Enigo::new(&Settings::default()).map_err(|e| e.to_string())?;
            enigo
                .key(MOD_KEY, Direction::Press)
                .map_err(|e| e.to_string())?;
            enigo
                .key(Key::Unicode(letter), Direction::Click)
                .map_err(|e| e.to_string())?;
            enigo
                .key(MOD_KEY, Direction::Release)
                .map_err(|e| e.to_string())?;
            Ok(())
        })();
        let _ = tx.send(res);
    })
    .map_err(|e| e.to_string())?;
    rx.recv().map_err(|e| e.to_string())?
}

#[tauri::command]
async fn capture_selection(app: tauri::AppHandle) -> Result<Capture, String> {
    let app_name = frontmost_app();
    let clip = app.clipboard();
    let _ = clip.write_text("");
    send_mod_key(&app, 'c')?;
    std::thread::sleep(std::time::Duration::from_millis(150));
    let text = clip.read_text().unwrap_or_default();
    Ok(Capture { app_name, text })
}

#[tauri::command]
async fn select_all_and_capture(app: tauri::AppHandle) -> Result<Capture, String> {
    let app_name = frontmost_app();
    let clip = app.clipboard();
    let _ = clip.write_text("");
    send_mod_key(&app, 'a')?;
    std::thread::sleep(std::time::Duration::from_millis(80));
    send_mod_key(&app, 'c')?;
    std::thread::sleep(std::time::Duration::from_millis(150));
    let text = clip.read_text().unwrap_or_default();
    Ok(Capture { app_name, text })
}

#[cfg(target_os = "macos")]
#[link(name = "ApplicationServices", kind = "framework")]
extern "C" {
    fn AXIsProcessTrusted() -> bool;
}

#[tauri::command]
fn check_accessibility_permission() -> bool {
    #[cfg(target_os = "macos")]
    unsafe {
        AXIsProcessTrusted()
    }
    #[cfg(not(target_os = "macos"))]
    {
        true
    }
}

#[tauri::command]
async fn replace_selection(app: tauri::AppHandle, text: String) -> Result<(), String> {
    let clip = app.clipboard();
    let prev = clip.read_text().ok();
    clip.write_text(text).map_err(|e| e.to_string())?;
    std::thread::sleep(std::time::Duration::from_millis(80));
    send_mod_key(&app, 'v')?;
    std::thread::sleep(std::time::Duration::from_millis(150));
    if let Some(p) = prev {
        let _ = clip.write_text(p);
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        Migration {
            version: 1,
            description: "create_proofs_table",
            sql: "CREATE TABLE proofs (
                    id          TEXT PRIMARY KEY,
                    ts          INTEGER NOT NULL,
                    source_app  TEXT NOT NULL,
                    before_text TEXT NOT NULL,
                    after_text  TEXT,
                    status      TEXT NOT NULL,
                    error       TEXT,
                    screenshot  BLOB
                  );
                  CREATE INDEX idx_proofs_ts ON proofs (ts DESC);",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "add_completed_ts",
            sql: "ALTER TABLE proofs ADD COLUMN completed_ts INTEGER;",
            kind: MigrationKind::Up,
        },
    ];

    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:proofs.db", migrations)
                .build(),
        )
        .invoke_handler(tauri::generate_handler![capture_selection, select_all_and_capture, replace_selection, check_accessibility_permission]);

    builder
        .setup(|app| {
            doubletap::start(app.handle().clone());
            if let Some(overlay) = app.get_webview_window("overlay") {
                if let Ok(Some(monitor)) = overlay.current_monitor() {
                    let size = monitor.size();
                    let scale = monitor.scale_factor();
                    let w = 220.0 * scale;
                    let h = 56.0 * scale;
                    let x = (size.width as f64 - w) / 2.0;
                    let y = size.height as f64 - h - (32.0 * scale);
                    let _ = overlay.set_position(PhysicalPosition::new(x, y));
                }
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
