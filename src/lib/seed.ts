export type Proof = {
  id: string;
  ts: Date;
  sourceApp: string;
  tone: "neutral" | "formal" | "casual" | "concise" | "academic";
  before: string;
  after: string;
};

const d = (offsetMin: number) => {
  const x = new Date();
  x.setMinutes(x.getMinutes() - offsetMin);
  return x;
};

export const seedProofs: Proof[] = [
  {
    id: "p1",
    ts: d(12),
    sourceApp: "Slack",
    tone: "casual",
    before: "their going to be late, i beleive the meeting got pushed",
    after: "they're going to be late; I believe the meeting got pushed.",
  },
  {
    id: "p2",
    ts: d(74),
    sourceApp: "Mail",
    tone: "formal",
    before:
      "Following up on our call, I wanted to check weather the draft was recieved and if their are any comments from you're side.",
    after:
      "Following up on our call, I wanted to check whether the draft was received and if there are any comments from your side.",
  },
  {
    id: "p3",
    ts: d(188),
    sourceApp: "Notes",
    tone: "concise",
    before: "the product is basically kind of designed to help users to write more better",
    after: "The product helps users write better.",
  },
  {
    id: "p4",
    ts: d(60 * 26),
    sourceApp: "Linear",
    tone: "neutral",
    before: "fixed the bug where the modal wasnt closing on esc key press",
    after: "Fixed the bug where the modal wasn't closing on the Esc key press.",
  },
  {
    id: "p5",
    ts: d(60 * 28),
    sourceApp: "Slack",
    tone: "casual",
    before: "can u send me the link when ur free",
    after: "Can you send me the link when you're free?",
  },
  {
    id: "p6",
    ts: d(60 * 50),
    sourceApp: "Mail",
    tone: "academic",
    before:
      "This paper present a novel method for proofreading which leverage large language models to corrects grammatical errors.",
    after:
      "This paper presents a novel method for proofreading that leverages large language models to correct grammatical errors.",
  },
];
