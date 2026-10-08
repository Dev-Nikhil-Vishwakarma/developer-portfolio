import { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const API_URL = import.meta.env.VITE_API_URL;

const projects = [
  {
    number: "01",
    title: "Dayflow",
    description:
      "A structured productivity system for planning days, tracking tasks and turning routines into measurable progress.",
    tags: ["React", "TypeScript", "Node.js"],
  },
  {
    number: "02",
    title: "Advance auth system",
    description:
      "A full-stack task application with cookie-based authentication, protected routes and per-user data.",
    tags: ["MERN", "JWT", "MongoDB"],
  },
  {
    number: "03",
    title: "AI voice Assistence",
    description:
      "A futuristic mobile voice assistant interface built around live microphone interaction and responsive motion.",
    tags: ["React Native", "Expo", "TypeScript"],
  },
];

function App() {
  const app = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from(".nav", { y: -24, opacity: 0, duration: 0.7 })
        .from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.5 }, "-=0.3")
        .from(
          ".hero-title-line",
          { yPercent: 110, opacity: 0, stagger: 0.12, duration: 0.9 },
          "-=0.25",
        )
        .from(".hero-copy", { y: 20, opacity: 0, duration: 0.6 }, "-=0.5")
        .from(".hero-actions", { y: 20, opacity: 0, duration: 0.5 }, "-=0.35");

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
        gsap.from(element, {
          y: 45,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 82%", once: true },
        });
      });

      gsap.utils
        .toArray<HTMLElement>(".project-card")
        .forEach((element, index) => {
          gsap.from(element, {
            y: 60,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 85%", once: true },
          });
        });
    }, app);

    return () => ctx.revert();
  }, []);

  const goTo = (id: string) => {
    gsap.to(window, { duration: 0.9, ease: "power3.inOut", scrollTo: id });
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");
    setSending(true);
    try {
      const response = await fetch(`${API_URL}/api/health`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok)
        throw new Error(data.message ?? "Unable to send message.");
      setStatus("Message sent successfully.");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div ref={app} className="site-shell">
      <header className="nav wrap">
        <button
          className="brand"
          onClick={() => goTo("#home")}
          aria-label="Go to home"
        >
          NV<span>.</span>
        </button>
        <nav>
          <button onClick={() => goTo("#work")}>Work</button>
          <button onClick={() => goTo("#about")}>About</button>
          <button onClick={() => goTo("#contact")}>Contact</button>
        </nav>
      </header>

      <main>
        <section id="home" className="hero wrap">
          <div className="hero-eyebrow">
            <span className="dot" /> Developer / Builder / Problem Solver
          </div>
          <div className="hero-title-wrap">
            <div className="hero-title-line">I build digital</div>
            <div className="hero-title-line accent-title">
              products that work.
            </div>
          </div>
          <p className="hero-copy">
            I’m Nikhil Vishwakarma, a full-stack developer focused on clean
            interfaces, reliable systems and practical products.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => goTo("#work")}>
              View selected work <span>↗</span>
            </button>
            <button className="text-button" onClick={() => goTo("#contact")}>
              Start a conversation
            </button>
          </div>
          <div className="hero-meta">
            <span>Based in India</span>
            <span>Available for selected work</span>
          </div>
        </section>

        <section id="work" className="section wrap">
          <div className="section-heading reveal">
            <span>01 / SELECTED WORK</span>
            <h2>Built with intent.</h2>
          </div>
          <div className="project-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.number}>
                <div className="project-top">
                  <span>{project.number}</span>
                  <span>↗</span>
                </div>
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
                <div className="tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="section about wrap">
          <div className="section-heading reveal">
            <span>02 / ABOUT</span>
            <h2>
              Simple systems.
              <br />
              Strong execution.
            </h2>
          </div>
          <div className="about-grid reveal">
            <p>
              I work across the frontend and backend, turning rough ideas into
              usable web and mobile products. My focus is not adding technology
              for its own sake. It is choosing the simplest architecture that
              solves the actual problem.
            </p>
            <div className="skill-list">
              <span>React / TypeScript</span>
              <span>Node / Express</span>
              <span>MongoDB / MySQL</span>
              <span>React Native / Expo</span>
              <span>GSAP / Motion</span>
              <span>REST APIs / Auth</span>
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="wrap contact-grid">
            <div className="reveal">
              <span className="eyebrow">03 / CONTACT</span>
              <h2>Have a problem worth building?</h2>
              <p>
                Tell me what you are trying to build. I’ll get back to you by
                email.
              </p>
              <a className="email-link" href="mailto:lapyslapy04@gmail.com">
                lapyslapy04@gmail.com
              </a>
            </div>
            <form className="contact-form reveal" onSubmit={submit}>
              <label>
                Name
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                />
              </label>
              <label>
                Email
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                />
              </label>
              <label>
                Message
                <textarea
                  required
                  minLength={10}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder="What are you building?"
                  rows={5}
                />
              </label>
              <button className="primary-button submit" disabled={sending}>
                {sending ? "Sending..." : "Send message ↗"}
              </button>
              {status && (
                <p className="form-status" role="status">
                  {status}
                </p>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer className="footer wrap">
        <span>© {new Date().getFullYear()} Nikhil Vishwakarma</span>
        <a href="mailto:lapyslapy04@gmail.com">Email ↗</a>
      </footer>
    </div>
  );
}

export default App;
