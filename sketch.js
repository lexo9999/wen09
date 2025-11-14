// 전역 변수 선언
let img;
let desktopImg; // 데스크톱/랩탑용 이미지
let mobileImg;  // 모바일용 이미지
let particles = [];
let ripples = []; // 마우스 클릭 시 생성될 파동을 저장할 배열

const BREAKPOINT = 768; // 모바일/데스크탑 반응형 분기점

// setup() 전에 실행되어 이미지 등 미디어 파일을 미리 로드합니다.
function preload() {
  // 데스크톱 이미지를 로드합니다.
  desktopImg = loadImage('logo7.png');

  // 모바일 이미지를 로드하되, 파일이 없을 경우를 대비합니다.
  const mobileImgPath = 'logo7-mobile.png';
  const loadCallback = (loadedImg) => {
    mobileImg = loadedImg; // 로딩 성공 시 변수에 할당
    console.log(`${mobileImgPath} 로드 성공.`);
  };
  const errorCallback = (err) => {
    console.warn(`${mobileImgPath} 파일을 찾을 수 없습니다. 데스크톱 이미지를 사용합니다.`, err);
    mobileImg = null; // 로딩 실패 시 null로 설정
  };
  loadImage(mobileImgPath, loadCallback, errorCallback);
}

// p5.js 스케치가 처음 시작될 때 한 번 실행됩니다.
function setup() {
  // #canvas-container의 크기에 맞는 캔버스를 생성합니다.
  const canvasContainer = document.getElementById('canvas-container');
  // willReadFrequently 옵션은 get() 함수 성능을 향상시킵니다.
  const canvas = createCanvas(canvasContainer.offsetWidth, canvasContainer.offsetHeight, {
    willReadFrequently: true
  });
  canvas.parent('canvas-container'); // 캔버스를 #canvas-container의 자식으로 만듭니다.

  // 현재 화면 크기에 맞는 이미지를 선택하고 파티클을 생성합니다.
  checkAndSetImage();

  // --- 자동 파동 생성 로직 추가 ---
  // 3개의 자동 파동을 서로 다른 시간 간격으로 생성하여 불규칙한 느낌을 줍니다.
  setInterval(createAutoRipple, 2000);  // 2초마다
  setInterval(createAutoRipple, 2700);  // 2.7초마다
  setInterval(createAutoRipple, 3500);  // 3.5초마다
}

// 이미지의 픽셀을 분석하여 파티클을 생성하는 함수
function initializeParticles() {
  particles = []; // 기존 파티클 배열을 비웁니다.
  
  // 이미지 픽셀 데이터를 사용하기 위해 loadPixels()를 호출합니다.
  img.loadPixels();
  
  // --- 보내주신 코드를 적용한 반응형 로직 ---
  // 이미지를 캔버스 크기의 90%에 맞추기 위한 스케일 값을 계산합니다.
  // 너비와 높이 중 더 제한적인 쪽을 기준으로 비율을 정합니다. (contain 효과)
  const scale = Math.min((width * 0.9) / img.width, (height * 0.9) / img.height);
  const scaledWidth = img.width * scale;
  const scaledHeight = img.height * scale;
  
  // 파티클 밀도 설정 (모바일에서 더 촘촘하게)
  // stepSize 값이 클수록 파티클 밀도가 낮아집니다.
  const stepSize = window.innerWidth < BREAKPOINT ? 15 : 24; // 데스크톱 밀도를 24 -> 30으로 변경하여 파티클 수를 줄임

  // 스케일링된 이미지를 캔버스 중앙에 배치하기 위한 시작점을 계산합니다.
  const startX = (width - scaledWidth) / 2;
  const startY = (height - scaledHeight) / 2;

  // 이미지의 모든 픽셀을 stepSize 간격으로 순회합니다.
  for (let x = 0; x < img.width; x += Math.floor(stepSize)) {
    for (let y = 0; y < img.height; y += Math.floor(stepSize)) {
      // (x, y) 위치의 픽셀 색상을 가져옵니다.
      let c = img.get(x, y);

      // 픽셀의 밝기가 10보다 크면 (거의 검은색이 아니면) 파티클을 생성합니다.
      if (brightness(c) > 10) {
        const particleX = startX + x * scale;
        const particleY = startY + y * scale;
        particles.push(new Particle(particleX, particleY));
      }
    }
  }
}

// 1초에 약 60번 반복 실행되는 애니메이션 루프
function draw() {
  // 매 프레임마다 배경을 어둡게 칠해 잔상을 만듭니다. (0~255 사이)
  background(10, 10, 20, 100);

  // 모든 파동을 업데이트합니다.
  for (let i = ripples.length - 1; i >= 0; i--) {
    let r = ripples[i];
    r.radius += r.speed; // 파동의 반지름을 키웁니다.
    // 파동이 화면을 완전히 벗어나면 배열에서 제거합니다.
    if (r.radius > width + height) {
      ripples.splice(i, 1);
    }
  }

  // 모든 파티클을 순회하며 업데이트하고 화면에 그립니다.
  for (let p of particles) {
    p.update(); // 파티클 위치 업데이트
    p.show();
  }
}

// 브라우저 창 크기가 변경될 때마다 실행되는 함수
function windowResized() {
  // 캔버스 크기를 컨테이너에 맞게 다시 조정합니다.
  const canvasContainer = document.getElementById('canvas-container');
  if (canvasContainer) {
    resizeCanvas(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
  }

  // 창 크기가 바뀌었으니, 표시할 이미지를 다시 확인하고 파티클을 재설정합니다.
  checkAndSetImage();
}

// 현재 창 너비를 기준으로 이미지를 선택하고 파티클을 다시 생성하는 함수
function checkAndSetImage() {
  // 모바일 화면이고 mobileImg가 성공적으로 로드되었으면 mobileImg를 사용하고,
  // 그렇지 않은 모든 경우에는 desktopImg를 사용합니다.
  const newImg = (window.innerWidth <= BREAKPOINT && mobileImg) ? mobileImg : desktopImg;

  // 이미지 변수가 유효한지 확인합니다.
  if (newImg) {
    // 현재 사용 중인 이미지와 새로 선택된 이미지가 다를 경우에만 이미지 교체
    if (img !== newImg) {
      img = newImg;
    }
    // 파티클을 (새 이미지 기준으로) 다시 계산하고 배치합니다.
    initializeParticles(); 
  }
}

// 마우스를 클릭할 때마다 실행되는 함수
function mousePressed() {
  // 성능 저하를 막기 위해 최대 파동 개수를 15개로 제한합니다.
  // 파동의 개수가 10개를 넘으면 가장 오래된 파동(배열의 첫 번째 요소)을 제거합니다.
  if (ripples.length > 10) {
    ripples.shift(); // 배열의 첫 번째 요소를 제거
  }

  // 클릭한 위치에 새로운 파동 객체를 생성하여 배열에 추가합니다.
  ripples.push({
    x: mouseX,
    y: mouseY,
    radius: 0,      // 시작 반지름
    speed: random(2, 8), // 2에서 8 사이의 랜덤한 속도
    rippleWidth: 10 // 파동의 두께
  });
}

// 자동 파동을 생성하는 함수
function createAutoRipple() {
  // 성능 저하를 막기 위해 최대 파동 개수를 10개로 제한합니다.
  if (ripples.length > 10) {
    ripples.shift(); // 가장 오래된 파동을 제거합니다.
  }

  // 캔버스 내의 임의의 위치에 새로운 파동 객체를 생성하여 배열에 추가합니다.
  ripples.push({
    x: random(width),      // 캔버스 너비 내의 랜덤 x좌표
    y: random(height),     // 캔버스 높이 내의 랜덤 y좌표
    radius: 0,
    speed: random(2, 5),   // 자동 파동은 약간 느린 속도로 설정
    rippleWidth: 15        // 자동 파동의 두께
  });
}

// 파티클 하나하나를 정의하는 클래스
class Particle {
  // 생성자: 파티클이 생성될 때 초기 위치(home)를 설정합니다.
  constructor(x, y) {
    this.pos = createVector(x, y); // 현재 위치
    this.home = createVector(x, y); // 원래 있어야 할 고정 위치
    this.vel = createVector();      // 속도
    this.acc = createVector();      // 가속도

    // 사용자가 요청한 '0' 또는 '1' 문자를 랜덤하게 선택합니다.
    this.char = random() > 0.5 ? "0" : "1";
    this.maxSpeed = 3; // 최대 속도
    this.maxForce = 0.2; // 최대 힘 (방향 전환)
  }

  // 파티클의 물리적 움직임을 계산합니다.
  applyForce(force) {
    this.acc.add(force);
  }

  // 파티클의 위치를 업데이트합니다.
  update() {
    // --- 1. 상호작용: 마우스 피하기 ---
    let mouse = createVector(mouseX, mouseY);
    let d = this.pos.dist(mouse); // 마우스와의 거리
    
    if (d < 80) { // 마우스가 80px 반경 안에 들어오면
      // [오류 수정] d가 0에 가까워져서 Infinity가 되는 것을 방지합니다.
      if (d < 1) {
        d = 1; // 최소 거리를 1로 설정
      }
      // 마우스 반대 방향으로 밀어내는 힘을 계산합니다.
      let repelForce = p5.Vector.sub(this.pos, mouse);
      repelForce.setMag(5 / d); // 거리가 가까울수록 강하게 밀어냄
      this.applyForce(repelForce);
    }

    // --- 2. 복귀: 원래 위치로 돌아가기 ---
    // 파티클이 원래 위치(home)로 돌아가려는 힘 (스프링처럼)
    let homeForce = p5.Vector.sub(this.home, this.pos);
    homeForce.mult(0.05); // 복귀하는 힘의 세기
    this.applyForce(homeForce);

    // --- 3. 자연스러운 물결 효과 (Perlin Noise) 제거 ---
    // 파티클의 불필요한 움직임을 줄여 안정화시키기 위해 이 부분을 제거합니다.

    // 물리 법칙 적용
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed); // 속도 제한
    this.pos.add(this.vel);
    this.acc.mult(0); // 가속도 초기화

    // 속도를 서서히 줄여 안정화시킵니다. (마찰력/Damping)
    this.vel.mult(0.95);
  }

  // 파티클을 화면에 그립니다.
  show() {
    let size = 14;    // 기본 문자 크기
    let shakeX = 0;   // 기본 흔들림을 0으로 설정하여 안정화
    let shakeY = 0;   // 기본 흔들림을 0으로 설정하여 안정화

    // 모든 파동에 대해 파티클과의 거리를 확인합니다.
    for (let r of ripples) {
      // 최적화: dist() 대신 거리의 제곱을 사용하여 비교합니다.
      let dx = this.pos.x - r.x;
      let dy = this.pos.y - r.y;
      let dSq = dx * dx + dy * dy; // 거리의 제곱

      // 파티클이 파동의 두께 범위 안에 있는지 확인합니다.
      // [오류 수정] 파동의 바깥쪽 경계 계산식을 수정하여 파동이 정상적으로 보이게 합니다.
      if (dSq > r.radius * r.radius && dSq < (r.radius + r.rippleWidth) * (r.radius + r.rippleWidth)) {
        // 파동의 중심에서 멀어질수록 효과를 감소시킵니다.
        let effect = 1 - (sqrt(dSq) - r.radius) / r.rippleWidth;
        
        // 크기와 흔들림 값을 적용합니다.
        size += 10 * effect; // 최대 10만큼 크기 증가
        shakeX = random(-5, 5) * effect;
        shakeY = random(-5, 5) * effect;
      }
    }

    fill(150, 200, 255); // 파티클 색상 (연한 하늘색)
    noStroke();
    textSize(size); // 계산된 크기 적용
    // 계산된 흔들림 값을 더하여 문자를 그립니다.
    text(this.char, this.pos.x + shakeX, this.pos.y + shakeY);
  }
}