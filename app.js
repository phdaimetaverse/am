(() => {
  const hudScoreEl = document.getElementById('score');
  const btnToggle = document.getElementById('toggleDayNight');
  let score = 0;
  function setScore(delta) {
    score += delta;
    if (score < 0) score = 0;
    hudScoreEl.textContent = `Score: ${score}`;
  }

  function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  // Day/Night toggle
  const sky = document.getElementById('sky');
  const ambient = document.getElementById('ambientLight');
  const sun = document.getElementById('sunLight');
  let isNight = false;
  btnToggle.addEventListener('click', () => {
    isNight = !isNight;
    if (isNight) {
      sky.setAttribute('color', '#0b1026');
      ambient.setAttribute('light', 'type: ambient; color: #cdd7ff; intensity: 0.25');
      sun.setAttribute('light', 'type: directional; color: #cfe0ff; intensity: 0.25');
      showToast('Night mode');
    } else {
      sky.setAttribute('color', '#BFDFFF');
      ambient.setAttribute('light', 'type: ambient; color: #ffffff; intensity: 0.6');
      sun.setAttribute('light', 'type: directional; color: #ffffff; intensity: 0.9');
      showToast('Day mode');
    }
  });

  // Teleport logic
  const rig = document.getElementById('rig');
  const portal = document.getElementById('portal');
  const portalBack = document.getElementById('portal-back');
  portal.addEventListener('click', () => {
    rig.setAttribute('position', '0 1.6 -40');
    showToast('Teleported to Classroom');
  });
  portalBack.addEventListener('click', () => {
    rig.setAttribute('position', '0 1.6 10');
    showToast('Returned to Hub');
  });

  // Quiz interactions
  function setupQuizHandlers() {
    const quizzes = {};
    document.querySelectorAll('.choice').forEach((choice) => {
      const quizId = choice.getAttribute('data-quiz');
      if (!quizzes[quizId]) quizzes[quizId] = { answered: false };
      choice.addEventListener('mouseenter', () => {
        choice.setAttribute('color', '#ddd');
      });
      choice.addEventListener('mouseleave', () => {
        choice.setAttribute('color', '#eeeeee');
      });
      choice.addEventListener('click', () => {
        const quizState = quizzes[quizId];
        if (quizState.answered) {
          showToast('Already answered');
          return;
        }
        const isCorrect = choice.getAttribute('data-correct') === 'true';
        if (isCorrect) {
          quizState.answered = true;
          setScore(10);
          showToast('Correct! +10');
          choice.classList.add('correct');
        } else {
          setScore(-2);
          showToast('Try again -2');
          choice.classList.add('incorrect');
          setTimeout(() => choice.classList.remove('incorrect'), 600);
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupQuizHandlers);
  } else {
    setupQuizHandlers();
  }
})();

