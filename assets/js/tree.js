window.addEventListener("load", init)
function init() {
  // ステージを作成
  var stage = new createjs.Stage("canvas")
  // 描画用のシェイプを作成
  var shape = new createjs.Shape()
  stage.addChild(shape)
  // キャンバスのサイズを全画面に設定
  stage.canvas.width = window.innerWidth
  stage.canvas.height = window.innerHeight
  // 配置場所を調整
  shape.rotation = -90
  shape.x = stage.canvas.width / 2
  shape.y = stage.canvas.height * 6 / 7
  var kouyous = [] // 紅葉の一覧
  // パーティクルを複数生成
  kouyous = createKouyous(100)
  // パーティクルをステージに追加
  for(var i = 0; i < kouyous.length; i++) {
    stage.addChild(kouyous[i])
  }

  // フラクタルの木を描く
  drawTree(0, 0, 180, 0, 8)
  // 枝を描く
  function drawTree(x1, // 始点のX座標
                    y1, // 始点のY座標
                    leng, // 枝の長さ
                    angle, // 枝の伸びる方向(角度)
                    level) // 再帰レベル
  {
    // 次の枝の座標を算出
    var x2 = leng * Math.cos(angle * Math.PI / 180) + x1
    var y2 = leng * Math.sin(angle * Math.PI / 180) + y1
    // 線の種類を設定
    shape.graphics.setStrokeStyle(1).beginStroke(createjs.Graphics.getHSL(level *10,65,65))
    // 枝を結ぶ
    shape.graphics.moveTo(x1, y1)
    shape.graphics.lineTo(x2, y2)
    // 細分化
    if (level > 0) {
      // 細分化レベルを更新
      level = level - 1
      // 三角関数で変動する値を得る (-1.0〜+1.0の周期になる)
      var timeValue = Math.sin(time * Math.PI  / 180)
      var rot = 40 * ( timeValue + 1.0 ) + 20 // +20〜+100の値を得る
      // 次の枝を描く
      drawTree(x2, y2, leng * 0.65, angle + rot, level)
      drawTree(x2, y2, leng * 0.65, angle, level)
      drawTree(x2, y2, leng * 0.65, angle - rot, level)
    }
  }
  // 時間経過を変数でカウント
  var time = 0
  createjs.Ticker.addEventListener("tick", handleTick)
  function handleTick() {
    // シェイプをクリアする
    shape.graphics.clear()
    updatekouyou()
    // フラクタルの木を描く
    drawTree(0, 0, 180, 0, 8)
    // 画面を更新
    stage.update()
    // 時間を更新
    time += 1
  }
  // 紅葉を描く
  function createkouyou(opt) {
    var kouyou = new createjs.Shape()
    kouyou.graphics.beginFill(createjs.Graphics.getHSL(10,65,65)) // 赤色で描画するように設定
    // 紅葉を描画
    kouyou.graphics.moveTo(0, 10)
    kouyou.graphics.lineTo(10, 15)
    kouyou.graphics.lineTo(0, 20)
    kouyou.graphics.lineTo(10, 20)
    kouyou.graphics.lineTo(15, 35)
    kouyou.graphics.lineTo(20, 20)
    kouyou.graphics.lineTo(30, 20)
    kouyou.graphics.lineTo(20, 15)
    kouyou.graphics.lineTo(30, 10)
    kouyou.graphics.lineTo(18, 10)
    kouyou.graphics.lineTo(18, 0)
    kouyou.graphics.lineTo(13, 0)
    kouyou.graphics.lineTo(13, 10)
    kouyou.graphics.lineTo(0, 10)
    kouyou.rotation = -180
    // 紅葉の座標指定
    kouyou.x = opt.x
    kouyou.y = opt.y
    // 紅葉の速さ指定
    kouyou.vx = opt.vx
    kouyou.vy = opt.vy
    // 重なった色を明るくする
    kouyou.compositeOperation = "lighter"
    return kouyou
  }
  function createKouyous(num) {
    var kouyous = []
    for(var i = 0; i < num; i++) {
      var x = 0.5 * window.innerWidth
      var y = (1 / 7) * window.innerHeight
      var vx = 30 * (Math.random() - 0.5)
      var vy = 30 * (Math.random() - 0.5)
      var opt = {x:x, y:y, vx: vx, vy: vy}
      var kouyou = createkouyou(opt)
      kouyous.push(kouyou)
    }
    return kouyous
  }
  function randomVelocity(max) {
    return Math.random() * max * 2 - max
  }
  function updatekouyou(){
    if(time == 100){
      timeflag = true
    }
    for(var i = 0; i < kouyous.length; i++) {
      var kouyou = kouyous[i]
      // 重力
      kouyou.vy += 1
      // 摩擦
      kouyou.vx *= 0.96
      kouyou.vy *= 0.96
      // 速度を位置に適用
      kouyou.x += kouyou.vx
      kouyou.y += kouyou.vy

      // 壁にぶつかった際に移動方向を逆向きにする
      if(kouyou.x < 0 || kouyou.x > stage.canvas.width) kouyou.vx *= -1
      if(kouyou.y < 0 || kouyou.y > stage.canvas.height) kouyou.vy *= -1
    }
    // 画面を更新
    stage.update()
  }
}
