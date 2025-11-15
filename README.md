# wen09
gnb 백드랍 필터 -> gnb.css
backdrop-filter: blur(8px); /* 배경 블러 효과 */ 이거 수정 


캔버스 CODE 폰트 사이즈 <SKETCH.JS>


    // --- 폰트 크기 설정 ---
    this.baseSize = 12;       // 1. 기본 폰트 크기
    this.rippleEffectSize = 16; // 2. 파동이 닿았을 때 추가되는 최대 크기
    // -----------------------


자동파동 두께

  // 캔버스 내의 임의의 위치에 새로운 파동 객체를 생성하여 배열에 추가합니다.
  ripples.push
    x: random(width),      // 캔버스 너비 내의 랜덤 x좌표
    y: random(height),     // 캔버스 높이 내의 랜덤 y좌표
    radius: 0,
    speed: random(2, 5),   // 자동 파동은 약간 느린 속도로 설정
    rippleWidth: 15        // 자동 파동의 두께


    파동두께

      ripples.push
    x: mouseX,
    y: mouseY,
    radius: 0,      // 시작 반지름
    speed: random(2, 8), // 2에서 8 사이의 랜덤한 속도
    rippleWidth: 10 // 파동의 두께


    어바웃 텍스트 수정 MAIN.HTML
            .about  <-
        .decoding 
        .about-subtitle <-세상을 읽고
        .encoding 
        .about-subtitle-2 <- 시각으로 답하다
        .about-description <- 설명문

        .rectangle-98 <-포스터 사이즈
        

    인포 텍스트 수정

            .info -< 타이틀
            .info-title <- 졸업전시위원, 웹, 소형배너, 대형배너, 영상
        .member-name <- 리스트


        그 외 아래 폰트 수정은 랩탑 아래의 버전 (모바일S, M L) // 완료

        //현재 수정 필요한 사항
        프로젝트 연결 및 GNB 삽입
        아티스트 연결 및 GNB 삽입// 완료


        인트로 애니메이션 텍스트 수정 필요
