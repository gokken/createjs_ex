window.addEventListener('load', init)

function init() {

  const PARTICLE_MAX_VELOCITY = 5 // パーティクルの最大速度

  var stage = new createjs.Stage('canvas') // ステージ
  var particles = [] // パーティクルの一覧

  // キャンバスのサイズを全画面に設定
  stage.canvas.width = window.innerWidth
  stage.canvas.height = window.innerHeight

  // パーティクルを複数生成
  particles = createParticles(10)

  // パーティクルをステージに追加
  for(var i = 0; i < particles.length; i++) {
    stage.addChild(particles[i])
  }

  // アニメーションの関数を登録
  createjs.Ticker.addEventListener('tick', updateStage)

  /**
   * アニメーション関数
   * 毎秒24回呼ばれる
   */
  function updateStage() {
    for(var i = 0; i < particles.length; i++) {
      var particle = particles[i]
      particle.x += particle.vx
      particle.y += particle.vy

      // 壁にぶつかった際に移動方向を逆向きにする
      if(particle.x < 0 || particle.x > stage.canvas.width) particle.vx *= -1
      if(particle.y < 0 || particle.y > stage.canvas.height) particle.vy *= -1
    }

    // ステージを更新
    stage.update()
  }

  /**
   * パーティクルが画面内に存在するか判定
   * @param {createjs.Shape} shape 判定したいシェイプオブジェクト
   * @return {boolean} パーティクルが画面内に存在する場合にtrueを返す
   */
  function isInsideScreen(shape) {
    var isInside = shape.x > 0 || shape.x < stage.canvas.innerWidth
    isInside = isInside || shape.y > 0 || shape.y < stage.canvas.innerHeight

    return isInside
  }
  /**
   * パーティクルを生成する
   * @param {Object} opt 生成するパーティクルの設定
   * @param {any}    opt.color パーティクルの色
   * @param {number} opt.x パーティクルを表示するx座標
   * @param {number} opt.y パーティクルを表示するy座標
   * @param {number} opt.r パーティクルの半径
   * @param {number} opt.vx パーティクルのx軸方向移動速度
   * @param {number} opt.vy パーティクルのy軸方向の移動速度
   * @return {createjs.Shape} 引数で渡されたoptを基に生成されたパーティクル
   */
  function createParticle(opt) {
    var particle = new createjs.Shape()
    var count = 0
    particle.graphics.beginFill(createjs.Graphics.getHSL(count, 50, 50))
    particle.graphics.drawCircle(0, 0, opt.r)
    particle.x = opt.x
    particle.y = opt.y
    particle.vx = opt.vx
    particle.vy = opt.vy
    particle.compositeOperation = "lighter";
    return particle
  }
  /**
   * ランダムに設定されたパーティクルを複数生成
   * @pram {number} num 生成するパーティクルの数
   * @return {createjs.Shape[]} パーティクルの配列
   */
  function createParticles(num) {
    var particles = []
    var r = 20
    var color = 'red'
    for(var i = 0; i < num; i++) {
      var x = Math.random() * window.innerWidth
      var y = Math.random() * window.innerHeight
      var vx = randomVelocity(PARTICLE_MAX_VELOCITY)
      var vy = randomVelocity(PARTICLE_MAX_VELOCITY)
      var opt = {x:x, y:y, r:r,color:color, vx: vx, vy: vy}
      var particle = createParticle(opt)
      particles.push(particle)
    }

    return particles
  }
  /**
   * パーティクルの速さをランダム生成する
   * @param {number} max 生成する速さの最大値
   * @return {number} ランダムに生成された速度
   */
  function randomVelocity(max) {
    return Math.random() * max * 2 - max
  }
}
