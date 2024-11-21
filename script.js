document.addEventListener("DOMContentLoaded", () => {
  // Load Lottie Animation
  const lottieContainer = document.getElementById("lottie-animation");
  const lottieInstance = lottie.loadAnimation({
    container: lottieContainer,
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "plumpy_yellow_ball.json", // Path to your Lottie JSON file
  });

  // GSAP Curtain Animation
  const pills = document.querySelectorAll(".pill");
  const curtainTimeline = gsap.timeline();

  curtainTimeline.to(pills, {
    y: "-100%", // Lift the pills
    duration: 2.5,
    stagger: 0.1, // Stagger the animation for each pill
    ease: "power2.inOut",
  })
  .to("#logo-container", {
    opacity: 1, // Fade to 100% opacity
    scale: 1.2, // Start with a slightly larger scale
    duration: 3.2, // Duration of the animation
    ease: "back.out(1.7)", // "Pop" effect easing
  });

  // Set up Lottie animation and make the logo fade in as curtain goes up
  curtainTimeline.add(() => {
    lottieInstance.play(); // Start the Lottie animation
  });

  // Canvas setup for cursor trail
  const canvas = document.getElementById("cursor-trail-canvas");
  const ctx = canvas.getContext("2d");

  // Resize canvas to fill screen
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  const balls = [];
  const colors = ["#ffd700", "#ffffff"]; // Yellow and White

  // Create ball on cursor movement
  function createBall(x, y) {
    balls.push({
      x,
      y,
      radius: Math.random() * 50 + 20, // Random radius between 20 and 100
      color: colors[Math.floor(Math.random() * colors.length)], // Random color
      opacity: 1,
      shrinkRate: 0.5, // Shrink speed
    });
  }

  // Draw balls and update animation
  function drawBalls() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    balls.forEach((ball, index) => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${ball.color === "#ffd700" ? "255, 215, 0" : "255, 255, 255"}, ${ball.opacity})`;
      ctx.fill();

      // Update the ball size and opacity
      ball.radius -= ball.shrinkRate;
      ball.opacity -= ball.shrinkRate / 50; // Shrink opacity as well

      if (ball.radius <= 0 || ball.opacity <= 0) {
        balls.splice(index, 1); // Remove ball if it's too small or invisible
      }
    });

    requestAnimationFrame(drawBalls); // Keep animating
  }

  // Start drawing balls
  drawBalls();

  // Trigger ball creation on cursor move
  let animationStarted = false;
  window.addEventListener("mousemove", (e) => {
    if (animationStarted) {
      createBall(e.clientX, e.clientY);
    }
  });

  // Enable cursor ball effect after curtain animation ends
  curtainTimeline.add(() => {
    animationStarted = true;
  });
});
