import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import * as THREE from 'three'

/* =====================================================================
   CONTENT — YEH SAB APNI MARZI SE EDIT KARO
   ===================================================================== */

const LOGIN = {
  username: "kritika",         // apna chosen username
  password: "kritikapraveen",  // fixed password
}

const PARTNER_NAME = "Kritika"
const CHARACTER_SHIRT_NAME = "PRAVEEN"

// Propose page: har slide ek chhoti line hai, last slide pe sawaal
const PROPOSAL_SLIDES = [
  "Kabhi kabhi kuch pal aise aate hain...",
  "Jo baaki sab se alag lagte hain.",
  "Jab se tum aayi ho zindagi mein...",
  "Har chhoti baat khaas lagne lagi hai.",
  "Tumhari hasi, tumhari baatien...",
  "Sab kuch mujhe ghar jaisa lagta hai.",
  "Maine bahut soch ke yeh nahi likha...",
  "Dil ne jo mehsoos kiya, wahi likh raha hu.",
  "Tumhare bina ab kuch adhoora sa lagta hai.",
  "Isiliye aaj ek sawaal poochna hai...",
  "Yeh sawaal thoda dar ke saath poochh raha hu...",
  "Kritika, kya tum meri zindagi ka baaki hissa bhi mere saath jiogi?",
]

const TIMELINE = [
  { date: "Jab pehli baar mile", text: "Yahan apna pehla moment likho..." },
  { date: "Pehli baat cheet", text: "Wo pehli conversation kaisi thi..." },
  { date: "Pehla 'I love you'", text: "Wo pal jab dil ne keh diya..." },
  { date: "Aaj", text: "Aur ab, har din tumhare saath..." },
]

const REASONS = [
  "Kyunki tumhari muskaan se mera din ban jaata hai.",
  "Kyunki tum meri sabse achi dost bhi ho.",
  "Kyunki tumhare saath sab kuch simple lagta hai.",
  "Kyunki tum meri sabse badi taqat ho.",
  "Yahan aur reasons add karo...",
]

const LETTERS = [
  { title: "Letter 1", body: "Yahan apna pehla letter likho, jitna chaho utna lamba..." },
  { title: "Letter 2", body: "Doosra letter yahan..." },
]

const COUNTDOWN = {
  label: "Hamari agli mulaqat tak",
  targetDate: "2026-12-31T00:00:00",
}

const QUIZ = [
  {
    question: "Mera favorite khaana kya hai?",
    options: ["Option A", "Option B", "Option C"],
    correctIndex: 0,
  },
  {
    question: "Mujhe sabse zyada kis cheez se dar lagta hai?",
    options: ["Option A", "Option B", "Option C"],
    correctIndex: 1,
  },
]

const FUTURE_PLANS = [
  { title: "Ek trip jo saath karenge", detail: "Kahan jaana hai likho..." },
  { title: "Ek sapna jo poora karna hai", detail: "Detail likho..." },
]

const GALLERY = [
  // { src: "https://...", caption: "Yeh din yaad hai?" },
]

/* =====================================================================
   3D CHARACTER (Three.js) — walks in, then reaches up to reveal login
   ===================================================================== */

function Character3D({ shirtName = 'PRAVEEN', onReachTop }) {
  const mountRef = useRef(null)
  const onReachTopRef = useRef(onReachTop)
  onReachTopRef.current = onReachTop

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    const width = mount.clientWidth
    const height = mount.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
    camera.position.set(0, 1.7, 6.5)
    camera.lookAt(0, 1.4, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff, 0.8))
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9)
    dirLight.position.set(3, 6, 4)
    scene.add(dirLight)

    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#D8A7B1'
    ctx.fillRect(0, 0, 256, 256)
    ctx.fillStyle = '#2B1B2E'
    ctx.font = 'bold 32px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(shirtName.toUpperCase(), 128, 128)
    const shirtTexture = new THREE.CanvasTexture(canvas)

    const shirtPlain = new THREE.MeshStandardMaterial({ color: 0xd8a7b1 })
    const shirtFront = new THREE.MeshStandardMaterial({ map: shirtTexture })
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xe8b98f })
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x2b1b2e })

    const character = new THREE.Group()

    const torso = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1.3, 0.5),
      [shirtPlain, shirtPlain, shirtPlain, shirtPlain, shirtFront, shirtPlain]
    )
    torso.position.y = 1.3
    character.add(torso)

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 24, 24), skinMat)
    head.position.y = 2.3
    character.add(head)

    function makeArm(side) {
      const arm = new THREE.Group()
      const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.7, 12), shirtPlain)
      upper.position.y = -0.35
      arm.add(upper)
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), skinMat)
      hand.position.y = -0.72
      arm.add(hand)
      arm.position.set(side * 0.62, 1.85, 0)
      return arm
    }
    const leftArm = makeArm(-1)
    const rightArm = makeArm(1)
    character.add(leftArm, rightArm)

    function makeLeg(side) {
      const leg = new THREE.Group()
      const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.8, 12), pantsMat)
      upper.position.y = -0.4
      leg.add(upper)
      leg.position.set(side * 0.25, 0.65, 0)
      return leg
    }
    const leftLeg = makeLeg(-1)
    const rightLeg = makeLeg(1)
    character.add(leftLeg, rightLeg)

    character.position.x = -4.5
    scene.add(character)

    let frameId
    let t = 0
    let phase = 'walk'
    const clock = new THREE.Clock()

    function animate() {
      frameId = requestAnimationFrame(animate)
      const delta = Math.min(clock.getDelta(), 0.05)
      t += delta

      if (phase === 'walk') {
        character.position.x = THREE.MathUtils.lerp(character.position.x, 0, delta * 1.4)
        const walkCycle = Math.sin(t * 8)
        leftLeg.rotation.x = walkCycle * 0.5
        rightLeg.rotation.x = -walkCycle * 0.5
        leftArm.rotation.x = -walkCycle * 0.35
        rightArm.rotation.x = walkCycle * 0.35
        character.position.y = Math.abs(Math.sin(t * 8)) * 0.05

        if (Math.abs(character.position.x) < 0.06) {
          character.position.x = 0
          character.position.y = 0
          phase = 'reach'
          t = 0
        }
      } else if (phase === 'reach') {
        leftLeg.rotation.x = THREE.MathUtils.lerp(leftLeg.rotation.x, 0, delta * 6)
        rightLeg.rotation.x = THREE.MathUtils.lerp(rightLeg.rotation.x, 0, delta * 6)
        const raise = Math.min(t / 0.8, 1)
        leftArm.rotation.x = THREE.MathUtils.lerp(0, -2.7, raise)
        rightArm.rotation.x = THREE.MathUtils.lerp(0, -2.7, raise)
        if (raise >= 1) {
          phase = 'done'
          onReachTopRef.current && onReachTopRef.current()
        }
      }

      renderer.render(scene, camera)
    }
    animate()

    function handleResize() {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
      mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [shirtName])

  return <div ref={mountRef} className="character-canvas" />
}

/* =====================================================================
   LOGIN
   ===================================================================== */

function Login({ onSuccess }) {
  const [revealed, setRevealed] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (
      username.trim().toLowerCase() === LOGIN.username.toLowerCase() &&
      password === LOGIN.password
    ) {
      localStorage.setItem('fk_authed', 'true')
      setError('')
      onSuccess()
    } else {
      setError('Kuch match nahi hua, dobara try karo')
    }
  }

  return (
    <div className="login-screen">
      <Character3D shirtName={CHARACTER_SHIRT_NAME} onReachTop={() => setRevealed(true)} />

      <div className={`login-card ${revealed ? 'is-revealed' : 'is-hidden'}`}>
        <p className="login-eyebrow">ek chhota sa darwaaza</p>
        <h1>Yeh jagah sirf tumhare liye hai</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus={revealed}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error && <p className="login-error">{error}</p>}
          <button type="submit">Andar aao</button>
        </form>
      </div>

      {!revealed && <p className="login-hint">ek pal ruko...</p>}
    </div>
  )
}

/* =====================================================================
   NAV
   ===================================================================== */

const SECTIONS = [
  { id: 'timeline', label: 'Kahani' },
  { id: 'letters', label: 'Letters' },
  { id: 'reasons', label: 'Reasons' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'countdown', label: 'Countdown' },
  { id: 'plans', label: 'Plans' },
  { id: 'surprise', label: 'Surprise' },
]

function Nav() {
  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <nav className="top-nav">
      <span className="nav-brand">For You</span>
      <div className="nav-links">
        {SECTIONS.map((s) => (
          <button key={s.id} onClick={() => scrollTo(s.id)}>{s.label}</button>
        ))}
      </div>
    </nav>
  )
}

/* =====================================================================
   TIMELINE
   ===================================================================== */

function Timeline() {
  return (
    <section className="section section-dark" id="timeline">
      <p className="section-eyebrow">Hamari Kahani</p>
      <h2>Ab tak ka safar</h2>
      <div className="timeline">
        {TIMELINE.map((item, i) => (
          <div className="timeline-item" key={i}>
            <div className="timeline-marker" />
            <div className="timeline-content">
              <p className="timeline-date">{item.date}</p>
              <p className="timeline-text">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* =====================================================================
   LETTERS
   ===================================================================== */

function Letters() {
  const [openIndex, setOpenIndex] = useState(null)
  return (
    <section className="section section-dark" id="letters">
      <p className="section-eyebrow">Letters</p>
      <h2>Kuch likha hai tumhare liye</h2>
      <div className="letters-grid">
        {LETTERS.map((letter, i) => (
          <button
            key={i}
            className={`letter-envelope ${openIndex === i ? 'is-open' : ''}`}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <span className="letter-title">{letter.title}</span>
            {openIndex === i && <p className="letter-body">{letter.body}</p>}
          </button>
        ))}
      </div>
    </section>
  )
}

/* =====================================================================
   REASONS JAR
   ===================================================================== */

function ReasonsJar() {
  const [reason, setReason] = useState(null)
  function pickReason() {
    setReason(REASONS[Math.floor(Math.random() * REASONS.length)])
  }
  return (
    <section className="section section-blush" id="reasons">
      <p className="section-eyebrow">Reasons Jar</p>
      <h2>Ek reason nikalo</h2>
      <button className="jar-button" onClick={pickReason}>Jar se ek reason nikalo</button>
      {reason && <p className="reason-reveal">{reason}</p>}
    </section>
  )
}

/* =====================================================================
   GALLERY
   ===================================================================== */

function Gallery() {
  return (
    <section className="section section-dark" id="gallery">
      <p className="section-eyebrow">Gallery</p>
      <h2>Kuch pal, kuch tasveerein</h2>
      {GALLERY.length === 0 ? (
        <p className="gallery-empty">
          Apni photos GALLERY array mein add karo, yahan dikhengi.
        </p>
      ) : (
        <div className="gallery-grid">
          {GALLERY.map((item, i) => (
            <figure key={i} className="gallery-item">
              <img src={item.src} alt={item.caption} />
              <figcaption>{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  )
}

/* =====================================================================
   QUIZ
   ===================================================================== */

function Quiz() {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function selectAnswer(qIndex, oIndex) {
    setAnswers({ ...answers, [qIndex]: oIndex })
  }

  const score = QUIZ.reduce(
    (acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0),
    0
  )

  return (
    <section className="section section-dark" id="quiz">
      <p className="section-eyebrow">Quiz</p>
      <h2>Kitna jaanti ho mujhe?</h2>
      {QUIZ.map((q, qi) => (
        <div className="quiz-question" key={qi}>
          <p>{q.question}</p>
          <div className="quiz-options">
            {q.options.map((opt, oi) => (
              <button
                key={oi}
                className={`quiz-option ${answers[qi] === oi ? 'is-selected' : ''}`}
                onClick={() => selectAnswer(qi, oi)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button className="quiz-submit" onClick={() => setSubmitted(true)}>Result dikhao</button>
      {submitted && (
        <p className="quiz-result">Tumne {score} / {QUIZ.length} sahi kiye 💖</p>
      )}
    </section>
  )
}

/* =====================================================================
   COUNTDOWN
   ===================================================================== */

function getTimeLeft() {
  const diff = new Date(COUNTDOWN.targetDate).getTime() - Date.now()
  if (diff <= 0) return null
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { days, hours, minutes, seconds }
}

function Countdown() {
  const [time, setTime] = useState(getTimeLeft())
  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <section className="section section-blush" id="countdown">
      <p className="section-eyebrow">Countdown</p>
      <h2>{COUNTDOWN.label}</h2>
      {time ? (
        <div className="countdown-grid">
          <div><span>{time.days}</span><small>din</small></div>
          <div><span>{time.hours}</span><small>ghante</small></div>
          <div><span>{time.minutes}</span><small>minute</small></div>
          <div><span>{time.seconds}</span><small>second</small></div>
        </div>
      ) : (
        <p>Waqt aa gaya hai 💫</p>
      )}
    </section>
  )
}

/* =====================================================================
   FUTURE PLANS
   ===================================================================== */

function FuturePlans() {
  return (
    <section className="section section-blush" id="plans">
      <p className="section-eyebrow">Aage kya</p>
      <h2>Kuch sapne jo saath dekhne hain</h2>
      <div className="plans-grid">
        {FUTURE_PLANS.map((plan, i) => (
          <div className="plan-card" key={i}>
            <h3>{plan.title}</h3>
            <p>{plan.detail}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* =====================================================================
   SURPRISE (random cute message + floating hearts)
   ===================================================================== */

const SURPRISE_MESSAGES = [
  "Tum meri sabse pyari surprise ho.",
  "Aaj bhi utna hi pyaar karta hu jitna pehle din.",
  "Tumhari hasi mera favorite sound hai.",
  "Thoda ruko... aur bas smile karo, bas itna hi karna tha.",
]

function Surprise() {
  const [message, setMessage] = useState(null)
  const [hearts, setHearts] = useState([])

  function trigger() {
    setMessage(SURPRISE_MESSAGES[Math.floor(Math.random() * SURPRISE_MESSAGES.length)])
    const newHearts = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
    }))
    setHearts(newHearts)
    setTimeout(() => setHearts([]), 2500)
  }

  return (
    <section className="section section-blush surprise-section" id="surprise">
      <p className="section-eyebrow">Bas Ek Click</p>
      <h2>Yahan click karo</h2>
      <button className="surprise-button" onClick={trigger}>Click karo</button>
      {message && <p className="surprise-message">{message}</p>}
      <div className="hearts-layer">
        {hearts.map((h) => (
          <span key={h.id} className="floating-heart" style={{ left: `${h.left}%`, animationDelay: `${h.delay}s` }}>♥</span>
        ))}
      </div>
    </section>
  )
}

/* =====================================================================
   PROPOSE PAGE
   ===================================================================== */

function ProposePage({ onClose }) {
  const [index, setIndex] = useState(0)
  const [answered, setAnswered] = useState(false)
  const isLast = index === PROPOSAL_SLIDES.length - 1

  function next() { if (!isLast) setIndex(index + 1) }
  function prev() { if (index > 0) setIndex(index - 1) }

  return (
    <div className="propose-overlay">
      <button className="propose-close" onClick={onClose} aria-label="Close">✕</button>

      {!answered ? (
        <div className="propose-slide" key={index}>
          <p className="propose-text">{PROPOSAL_SLIDES[index]}</p>
          <div className="propose-actions">
            {index > 0 && <button className="propose-prev" onClick={prev}>← Peeche</button>}
            {!isLast ? (
              <button className="propose-next" onClick={next}>Aage →</button>
            ) : (
              <button className="propose-yes" onClick={() => setAnswered(true)}>Haan 💍</button>
            )}
          </div>
          <div className="propose-dots">
            {PROPOSAL_SLIDES.map((_, i) => (
              <span key={i} className={`dot ${i === index ? 'active' : ''}`} />
            ))}
          </div>
        </div>
      ) : (
        <div className="propose-celebration">
          <div className="hearts-layer">
            {Array.from({ length: 20 }, (_, i) => (
              <span
                key={i}
                className="floating-heart"
                style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 1.2}s` }}
              >♥</span>
            ))}
          </div>
          <h1>Yay! 🎉</h1>
          <p>Ab hum officially forever ke liye ek dusre ke hain, {PARTNER_NAME}.</p>
        </div>
      )}
    </div>
  )
}

/* =====================================================================
   APP
   ===================================================================== */

function App() {
  const [authed, setAuthed] = useState(false)
  const [showPropose, setShowPropose] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('fk_authed') === 'true') setAuthed(true)
  }, [])

  if (!authed) {
    return <Login onSuccess={() => setAuthed(true)} />
  }

  return (
    <div className="app-shell">
      <Nav />
      <header className="hero">
        <p className="hero-eyebrow">Ek chhoti si duniya, sirf {PARTNER_NAME} ke liye</p>
        <h1>Har scroll ke saath, thoda aur pyaar</h1>
        <button className="propose-trigger" onClick={() => setShowPropose(true)}>
          ek aur surprise hai...
        </button>
      </header>
      <Timeline />
      <Letters />
      <ReasonsJar />
      <Gallery />
      <Quiz />
      <Countdown />
      <FuturePlans />
      <Surprise />
      <footer className="app-footer"><p>Banaya gaya, dil se. 💌</p></footer>

      {showPropose && <ProposePage onClose={() => setShowPropose(false)} />}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
