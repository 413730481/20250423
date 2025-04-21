let menuItems = ["首頁", "自我介紹", "作品集", "測驗卷", "教學影片"];
let submenuItems = ["第一周作品", "第二周作品", "第三周作品", "筆记"];
let hoverIndex = -1;
let submenuHoverIndex = -1; // 子选单的悬停索引
let showMenu = false; // 是否显示主选单
let showSubmenu = false; // 是否显示子选单
let iframe; // 用于嵌入内容的 iframe
let menuLinks = [
  "", // 首頁（不嵌入 iframe）
  "images/自我介紹.png", // 自我介紹
  "", // 作品集（无直接链接，使用子选单）
  "https://413730481.github.io/20250420/", // 测验卷
  "https://cfchen58.synology.me/%E7%A8%8B%E5%BC%8F%E8%A8%AD%E8%A8%882024/B2/week4/20250310_093748.mp4", // 教学影片
];
let submenuLinks = [
  "https://413730481.github.io/20250217/", // 第一周作品
  "https://413730481.github.io/20250224/", // 第二周作品
  "https://413730481.github.io/20250310/", // 第三周作品
  "https://hackmd.io/@vojhQ4yNSkWfQnRxP_-npA/Sy6vwCGylx", // 筆记
];
let flipping = false; // 是否正在翻页
let flipProgress = 0; // 翻页进度 (0~1)
let iframeSrc = ""; // 用于存储即将显示的 iframe 内容
let stars = []; // 用于存储星星的数组
let introImage; // 用于存储自我介绍的图片
let submenuTimeout; // 用于存储子选单的计时器
let showIntroImage = false; // 控制是否显示自我介绍图片

function preload() {
  introImage = loadImage("images/自我介紹.png", 
    () => console.log("图片加载成功"), 
    () => console.error("图片加载失败，请检查路径")
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);

  if (introImage) {
    image(introImage, 0, 0, width, height); // 將圖片填充整個畫布
  } else {
    console.error("圖片未加載成功");
  }

  // 初始化 iframe
  iframe = createElement("iframe");
  iframe.attribute("src", "");
  iframe.attribute("title", "嵌入內容");
  iframe.attribute("width", width * 0.8); // 調整 iframe 寬度
  iframe.attribute("height", height * 0.6); // 調整 iframe 高度
  iframe.position(width * 0.1, height * 0.2); // 居中顯示
  iframe.style("border", "none");
  iframe.hide(); // 初始隱藏
  iframe.style("z-index", "-1"); // 將 iframe 的圖層設置為較低

  // 初始化星星
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(10, 20), // 五角星的大小
      brightness: random(150, 255),
    });
  }
}

function handleMenuClick(index) {
  if (index === 2) {
    // 点击「作品集」，切换子选单显示状态
    showSubmenu = !showSubmenu; // 切换子选单显示状态
  } else {
    // 点击其他按钮时隐藏子选单
    showSubmenu = false;
  }
  if (index === 1) {
    // 点击「自我介绍」，触发翻书动画
    flipping = true; // 开始翻书动画
    flipProgress = 0; // 重置翻书进度
    iframe.hide(); // 隐藏 iframe
    iframeSrc = ""; // 清空 iframeSrc，确保不加载 iframe
    showIntroImage = false; // 在翻书动画期间不显示图片
  } else if (index === 4) {
    // 点击「教学影片」，触发翻书动画
    iframeSrc = "https://cfchen58.synology.me/%E7%A8%8B%E5%BC%8F%E8%A8%AD%E8%A8%882024/B2/week4/20250310_093748.mp4"; // 设置教学影片链接
    flipping = true; // 开始翻书动画
    flipProgress = 0; // 重置翻书进度
    iframe.hide(); // 隐藏 iframe
    showIntroImage = false; // 隐藏自我介绍图片
  } else if (index === 3) {
    // 点击「测验卷」，触发翻书动画
    iframeSrc = "https://413730481.github.io/20250420/"; // 设置测验卷链接
    flipping = true; // 开始翻书动画
    flipProgress = 0; // 重置翻书进度
    iframe.hide(); // 隐藏 iframe
    showIntroImage = false; // 隐藏自我介绍图片
  } else {
    // 其他选单项
    iframe.hide(); // 隐藏 iframe
    background(255); // 清空画布
    showIntroImage = false; // 隐藏自我介绍图片
  }
}

function handleSubmenuClick(index) {
  // 点击子选单，触发翻书动画
  iframeSrc = submenuLinks[index]; // 设置 iframe 的内容
  flipping = true; // 开始翻书动画
  flipProgress = 0; // 重置翻书进度
  iframe.hide(); // 隐藏 iframe
}

function draw() {
  if (flipping) {
    drawFlipAnimation(); // 繪製翻書動畫
  } else {
    drawBackground(); // 繪製背景
    if (showIntroImage) {
      displayIntroImage(); // 顯示自我介紹圖片
    }
    if (iframe && iframe.elt.style.display !== "none") {
      // 如果 iframe 顯示，保持其在背景之上
      iframe.style("z-index", "0"); // 確保 iframe 在較低層
    }
  }

  // 確保選單和子選單在最前面繪製
  if (showMenu) {
    drawMenu();
    if (showSubmenu) {
      drawSubmenu();
    }
  }
}

function drawBackground() {
  // 根據滑鼠位置計算顏色
  let r = map(mouseX, 0, width, 200, 255); // 紅色分量隨 mouseX 變化
  let g = map(mouseY, 0, height, 180, 230); // 綠色分量隨 mouseY 變化
  let b = map(mouseX + mouseY, 0, width + height, 150, 200); // 藍色分量隨 mouseX 和 mouseY 變化

  background(r, g, b); // 動態背景顏色

  // 繪製五角星
  for (let star of stars) {
    let starBrightness = map(mouseX, 0, width, star.brightness - 50, star.brightness);
    let starSize = map(mouseY, 0, height, star.size / 2, star.size * 1.5); // 五角星大小隨 mouseY 變化
    fill(starBrightness);
    noStroke();
    drawStar(star.x, star.y, starSize, starSize / 2, 5); // 繪製五角星
  }

  fill(240, 230, 200); // 書本顏色

  // 調整書本的寬度和高度比例，將書本放大
  let bookWidth = width * 0.9; // 書本寬度增加到畫布的 90%
  let bookHeight = height * 0.8; // 書本高度增加到畫布的 80%
  let bookX = (width - bookWidth) / 2; // 書本水平居中
  let bookY = (height - bookHeight) / 2; // 書本垂直居中

  rect(bookX, bookY, bookWidth, bookHeight, 10); // 書本邊角圓滑
  fill(180, 150, 120);
  rect(bookX + bookWidth / 2 - 5, bookY, 10, bookHeight); // 書本中間裝訂線
}
// 繪製五角星的函數

function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius1;
    let sy = y + sin(a) * radius1;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius2;
    sy = y + sin(a + halfAngle) * radius2;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}


function drawMenu() {
  let x = width * 0.1; // 主选单的起始位置
  let y = height * 0.05; // 将菜单放置在画布顶部，避免被 iframe 遮挡
  let menuWidth = 100; // 主选单项宽度
  let menuHeight = 40; // 主选单项高度
  let spacing = 10; // 主选单间距

  // 绘制主选单
  for (let i = 0; i < menuItems.length; i++) {
    if (hoverIndex === i) {
      fill(200); // 鼠标悬停时的背景颜色
    } else {
      fill(255); // 默认背景颜色
    }
    rect(x + i * (menuWidth + spacing), y, menuWidth, menuHeight, 5); // 绘制按钮
    fill(0); // 文本颜色
    textAlign(CENTER, CENTER);
    textSize(16);
    text(menuItems[i], x + i * (menuWidth + spacing) + menuWidth / 2, y + menuHeight / 2);
  }

  // 如果 showSubmenu 为 true，显示子选单
  if (showSubmenu) {
    drawSubmenu(x + 2 * (menuWidth + spacing), y + menuHeight + 10); // 子选单显示在「作品集」下方
  }
}

function drawSubmenu(startX, startY) {
  let menuWidth = 100; // 子选单项宽度
  let menuHeight = 40; // 子选单项高度
  let spacing = 10; // 子选单间距

  for (let i = 0; i < submenuItems.length; i++) {
    let x = startX; // 子选单的水平位置
    let y = startY + i * (menuHeight + spacing); // 子选单的垂直位置

    if (submenuHoverIndex === i) {
      fill(200); // 鼠标悬停时的背景颜色
    } else {
      fill(255); // 默认背景颜色
    }
    rect(x, y, menuWidth, menuHeight, 5); // 绘制子选单按钮
    fill(0); // 文本颜色
    textAlign(CENTER, CENTER);
    textSize(14);
    text(submenuItems[i], x + menuWidth / 2, y + menuHeight / 2);
  }
}

function drawFlipAnimation() {
  drawBackground();

  let bookWidth = width * 0.8; // 书本宽度调整为画布宽度的 80%
  let bookHeight = height * 0.7; // 书本高度调整为画布高度的 70%
  let bookX = (width - bookWidth) / 2; // 书本水平居中
  let bookY = (height - bookHeight) / 2; // 书本垂直居中

  let flipX = map(flipProgress, 0, 1, bookX + bookWidth, bookX + bookWidth / 2);
  let curveOffset = sin(flipProgress * PI) * 50; // 翻页曲线效果

  fill(255);
  beginShape();
  vertex(flipX, bookY);
  bezierVertex(flipX - curveOffset, bookY + bookHeight / 4, flipX - curveOffset, bookY + (3 * bookHeight) / 4, flipX, bookY + bookHeight);
  vertex(bookX + bookWidth, bookY + bookHeight);
  vertex(bookX + bookWidth, bookY);
  endShape(CLOSE);

  flipProgress += 0.05; // 翻书进度增加
  if (flipProgress >= 1) {
    flipping = false; // 翻书结束
    if (iframeSrc === "") {
      // 如果 iframeSrc 为空，显示自我介绍图片
      showIntroImage = true; // 设置显示图片的状态
    } else if (iframeSrc) {
      // 如果有 iframeSrc，显示 iframe
      iframe.attribute("src", iframeSrc); // 设置 iframe 的内容
      iframe.attribute("width", bookWidth); // 设置 iframe 宽度为书本宽度
      iframe.attribute("height", bookHeight); // 设置 iframe 高度为书本高度
      iframe.style("overflow", "hidden"); // 移除滾動條
      iframe.position(bookX, bookY); // 将 iframe 放置在书本的左上角
      iframe.show(); // 显示 iframe
      iframeSrc = ""; // 清空暂存的 iframe 内容
    }
  }
}

function mouseMoved() {
  let x = width * 0.1; // 主選單的起始位置
  let y = height * 0.05; // 主選單的垂直位置
  let menuWidth = 100; // 主選單項寬度
  let menuHeight = 40; // 主選單項高度
  let spacing = 10; // 主選單間距

  // 如果滑鼠位於選單上下左右的範圍，顯示主選單
  if (
    mouseX > x - 100 && // 左邊 100px
    mouseX < x + menuItems.length * (menuWidth + spacing) + 100 && // 右邊 100px
    mouseY > y - 100 && // 上方 100px
    mouseY < y + menuHeight + 200 // 下方 200px
  ) {
    showMenu = true; // 顯示主選單
  } else {
    showMenu = false; // 隱藏主選單
  }

  // 檢查是否懸停在主選單範圍
  hoverIndex = -1; // 重置懸停索引
  submenuHoverIndex = -1; // 重置子選單懸停索引

  if (showMenu) {
    for (let i = 0; i < menuItems.length; i++) {
      if (
        mouseX > x + i * (menuWidth + spacing) &&
        mouseX < x + i * (menuWidth + spacing) + menuWidth &&
        mouseY > y &&
        mouseY < y + menuHeight
      ) {
        hoverIndex = i; // 設置懸停的主選單索引
        break;
      }
    }

    // 如果滑鼠懸停在「作品集」按鈕或子選單上，保持子選單顯示
    let submenuX = x + 2 * (menuWidth + spacing); // 子選單的起始位置
    let submenuY = y + menuHeight + 10; // 子選單的垂直位置
    if (hoverIndex === 2 || isMouseOverSubmenu(submenuX, submenuY)) {
      showSubmenu = true; // 保持子選單顯示
    } else {
      showSubmenu = false; // 隱藏子選單
    }
  }
}

function isMouseOverSubmenu(startX, startY) {
  let menuWidth = 100; // 子选单项宽度
  let menuHeight = 40; // 子选单项高度
  let spacing = 10; // 子选单间距

  for (let i = 0; i < submenuItems.length; i++) {
    let x = startX; // 子选单的水平位置
    let y = startY + i * (menuHeight + spacing); // 子选单的垂直位置

    if (
      mouseX > x - 100 && // 左邊 100px
      mouseX < x + menuWidth + 100 && // 右邊 100px
      mouseY > y - 100 && // 上方 100px
      mouseY < y + menuHeight + 200 // 下方 200px
    ) {
      submenuHoverIndex = i; // 设置悬停的子选单索引
      return true;
    }
  }
  return false;
}

function mousePressed() {
  let x = width * 0.1; // 主选单的起始位置
  let y = height * 0.05; // 主选单的垂直位置
  let menuWidth = 100; // 主选单项宽度
  let menuHeight = 40; // 主选单项高度
  let spacing = 10; // 主选单间距

  // 检查是否点击了主选单按钮
  for (let i = 0; i < menuItems.length; i++) {
    if (
      mouseX > x + i * (menuWidth + spacing) &&
      mouseX < x + i * (menuWidth + spacing) + menuWidth &&
      mouseY > y &&
      mouseY < y + menuHeight
    ) {
      hoverIndex = i; // 设置当前悬停的按钮索引
      handleMenuClick(i); // 处理按钮点击事件
      return; // 退出函数，避免重复检查
    }
  }

  // 检查是否点击了子选单按钮
  if (showSubmenu) {
    let submenuX = x + 2 * (menuWidth + spacing); // 子选单的起始位置
    let submenuY = y + menuHeight + 10; // 子选单的垂直位置
    let submenuWidth = 100; // 子选单项宽度
    let submenuHeight = 40; // 子选单项高度
    let submenuSpacing = 10; // 子选单间距

    for (let i = 0; i < submenuItems.length; i++) {
      if (
        mouseX > submenuX &&
        mouseX < submenuX + submenuWidth &&
        mouseY > submenuY + i * (submenuHeight + submenuSpacing) &&
        mouseY < submenuY + i * (submenuHeight + submenuSpacing) + submenuHeight
      ) {
        submenuHoverIndex = i; // 设置当前悬停的子选单索引
        handleSubmenuClick(i); // 处理子选单点击事件
        return; // 退出函数，避免重复检查
      }
    }
  }
}

function displayIntroImage() {
  // 定义书本的宽度和高度
  let bookWidth = width * 0.8; // 书本宽度调整为画布宽度的 80%
  let bookHeight = height * 0.7; // 书本高度调整为画布高度的 70%
  let bookX = (width - bookWidth) / 2; // 书本水平居中
  let bookY = (height - bookHeight) / 2; // 书本垂直居中

  // 计算图片的缩放比例，使其适配书本
  let imgWidth = introImage.width;
  let imgHeight = introImage.height;
  let scale = min(bookWidth / imgWidth, bookHeight / imgHeight); // 选择适配书本的缩放比例

  let displayWidth = imgWidth * scale; // 缩放后的宽度
  let displayHeight = imgHeight * scale; // 缩放后的高度

  // 在书本区域中央显示图片
  image(introImage, bookX + (bookWidth - displayWidth) / 2, bookY + (bookHeight - displayHeight) / 2, displayWidth, displayHeight);
}