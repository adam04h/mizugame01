(() => {
  const $ = id => document.getElementById(id);
  const startScreen=$('startScreen'), lobbyScreen=$('lobbyScreen'), characterScreen=$('characterScreen'), mapScreen=$('mapScreen');
  const entryGateModal=$('entryGateModal'), entryGateForm=$('entryGateForm'), entryGatePassword=$('entryGatePassword'), entryGateError=$('entryGateError');
  const startButton=$('startButton'), confirmButton=$('confirmCharacter'), characterArtwork=$('characterArtwork'), characterStatsOverlay=$('characterStatsOverlay'), battleStartButton=$('battleStartButton'), readyStatus=$('readyStatus');
  const selfLifeHearts=$('selfLifeHearts'), gameOverModal=$('gameOverModal'), gameOverRankings=$('gameOverRankings'), gameOverReason=$('gameOverReason');
  const boardImage=$('boardImage'), boardStage=$('boardStage'), mapViewport=$('mapViewport'), mapBackdrop=$('mapBackdrop');
  const shopModal=$('shopModal'), shopCoins=$('shopCoins'), shopTimerText=$('shopTimerText'), shopTimerBar=$('shopTimerBar'), shopHint=$('shopHint'), shopCloseX=$('shopCloseX'), shopLeaveButton=$('shopLeaveButton'), selfInventory=$('selfInventory');
  const playerTokens=$('playerTokens'), playerCount=$('playerCount');
  const dieStage=$('dieStage'), cube=$('cube'), rollButton=$('rollButton'), pauseButton=$('pauseButton');
  const roundLabel=$('roundLabel'), phaseLabel=$('phaseLabel'), turnLabel=$('turnLabel'), rollResult=$('rollResult'), autoRollCountdown=$('autoRollCountdown');
  const routeChoiceModal=$('routeChoiceModal'), routeChoiceTitle=$('routeChoiceTitle'), chooseMiddleButton=$('chooseMiddle'), chooseOuterButton=$('chooseOuter');
  const coinActionButton=$('coinActionButton'), skillActionButton=$('skillActionButton');
  const actionModal=$('actionModal'), actionModalTitle=$('actionModalTitle'), actionSkillImage=$('actionSkillImage'), actionSkillName=$('actionSkillName'), actionSkillDescription=$('actionSkillDescription'), replacementChoices=$('replacementChoices');
  const acceptActionButton=$('acceptActionButton'), cancelActionButton=$('cancelActionButton'), closeActionModal=$('closeActionModal'), coinEventGrid=$('coinEventGrid'), actionSkillBatch=$('actionSkillBatch');
  const selfCharacterName=$('selfCharacterName'), selfHP=$('selfHP'), selfAttack=$('selfAttack'), selfDefense=$('selfDefense'), selfCoins=$('selfCoins'), selfSkillSlots=$('selfSkillSlots'), selfStatusNote=$('selfStatusNote'), selfStatusPanel=$('selfStatusPanel'), selfStatusToggle=$('selfStatusToggle');
  const duelTargetPicker=$('duelTargetPicker'), duelTargetSelect=$('duelTargetSelect'), duelSkillDescription=$('duelSkillDescription'), duelSkillFlash=$('duelSkillFlash'), duelSkillFlashImage=$('duelSkillFlashImage'), duelSkillFlashName=$('duelSkillFlashName');
  const battleMusic=$('battleMusic'), battleMusicToggle=$('battleMusicToggle');
  const duelModal=$('duelModal'), duelLeftPortrait=$('duelLeftPortrait'), duelRightPortrait=$('duelRightPortrait'), duelLeftName=$('duelLeftName'), duelRightName=$('duelRightName'), duelLeftStats=$('duelLeftStats'), duelRightStats=$('duelRightStats'), duelLeftDie=$('duelLeftDie'), duelRightDie=$('duelRightDie'), duelLeftSkills=$('duelLeftSkills'), duelRightSkills=$('duelRightSkills'), duelStatus=$('duelStatus'), duelRollButton=$('duelRollButton'), duelSkillPicker=$('duelSkillPicker'), duelSkillSelect=$('duelSkillSelect'), duelUseSkill=$('duelUseSkill'), duelContinueButton=$('duelContinueButton'), duelEscapeLeft=$('duelEscapeLeft'), duelEscapeRight=$('duelEscapeRight');
  const playerSelectionBanner=$('playerSelectionBanner'), playerSelectionText=$('playerSelectionText'), playerSelectionHint=$('playerSelectionHint'), cancelPlayerSelection=$('cancelPlayerSelection');
  const pauseOverlay=$('pauseOverlay'), pauseCountdown=$('pauseCountdown');
  const characterButtons=[...document.querySelectorAll('.character-hotspot')];
  const characterFxLayer=document.getElementById('characterFxLayer');
  const characters={
    odyssey:{src:'assets/character-odyssey.png',selectionVideo:'assets/character-select-odyssey.mp4',gif:'assets/character-odyssey.gif',name:'驅魔獵人',alias:'奧德賽',hp:30,attack:11,defense:3,baseSkill:'破魔箭矢',baseImage:'assets/base-skill-odyssey.jpg',dayAttack:2,nightAttack:0,alt:'驅魔獵人（奧德賽）角色選擇畫面'},
    druid:{src:'assets/character-druid.png',selectionVideo:'assets/character-select-druid.mp4',gif:'assets/character-druid.gif',name:'暗夜吸血鬼',alias:'德魯伊',hp:31,attack:9,defense:4,baseSkill:'高速身法',baseImage:'assets/base-skill-druid.jpg',dayAttack:0,nightAttack:2,alt:'暗夜吸血鬼（德魯伊）角色選擇畫面'},
    lucifer:{src:'assets/character-lucifer.png',selectionVideo:'assets/character-select-lucifer.mp4',gif:'assets/character-lucifer.gif',name:'混沌惡魔',alias:'露西法',hp:32,attack:8,defense:6,baseSkill:'恐懼光環',baseImage:'assets/base-skill-lucifer.jpg',dayAttack:0,nightAttack:2,alt:'混沌惡魔（露西法）角色選擇畫面'},
    lycan:{src:'assets/character-lycan.png',selectionVideo:'assets/character-select-lycan.mp4',gif:'assets/character-lycan.gif',name:'狂暴狼人',alias:'萊肯',hp:33,attack:9,defense:5,baseSkill:'野性撕裂',baseImage:'assets/base-skill-lycan.jpg',dayAttack:0,nightAttack:2,alt:'狂暴狼人（萊肯）角色選擇畫面'}
  };
  const characterOrder=['odyssey','druid','lucifer','lycan'];
  // Circular matchup rule: Druid > Odyssey > Lucifer > Lycan > Druid.
  const counters={druid:'odyssey',odyssey:'lucifer',lucifer:'lycan',lycan:'druid'};
  function matchupBonus(attacker,defender,skill){
    if(!attacker||!defender||!skill||counters[attacker.character]!==defender.character)return 0;
    // The +3 applies to attack moves that resolve using attack power; defensive,
    // control, and damage-over-time effects retain their own defined effects.
    const attackPowerEffects=new Set(['shatter','thrust','blood','soul']);
    const isAttackMove=skill.category==='attack'||(!skill.category&&!['sealedGuard','seal','wall','dodge','wish','wind'].includes(skill.effect));
    return isAttackMove && (attackPowerEffects.has(skill.effect)||!skill.effect) ? 3 : 0;
  }

  function renderCharacterStats(){
    if(!characterStatsOverlay)return;
    const c=characters[selectedCharacter];if(!c)return;
    const bonus=c.dayAttack?`☀ 白天攻擊 +${c.dayAttack}`:`☾ 黑夜攻擊 +${c.nightAttack}`;
    characterStatsOverlay.innerHTML=`<div class="selection-stat"><small>HP</small><strong>${c.hp}</strong></div><div class="selection-stat attack"><small>攻擊</small><strong>${c.attack}</strong><em>${bonus}</em></div><div class="selection-stat defense"><small>防禦</small><strong>${c.defense}</strong></div>`;
    characterStatsOverlay.setAttribute('aria-label',`${c.name} HP ${c.hp} 攻擊 ${c.attack} 防禦 ${c.defense}，${bonus}`);
  }

  const skills=[
    {name:'碎甲重擊',desc:'+1 攻擊；無視對手 2 點防禦。',image:'assets/skill-01.jpg',effect:'shatter',category:'attack'},
    {name:'連環突刺',desc:'+3 攻擊；扣除敵方 1 點 HP。',image:'assets/skill-02.jpg',effect:'thrust',category:'attack'},
    {name:'嗜血狂攻',desc:'自身 -3 HP；攻擊 +5。',image:'assets/skill-03.jpg',effect:'blood',category:'attack'},
    {name:'堅定壁壘',desc:'+4 防禦。',image:'assets/skill-04.jpg',effect:'wall',category:'defense'},
    {name:'荊棘逆襲',desc:'+1 防禦；扣除敵方 2 點防禦。',image:'assets/skill-05.jpg',effect:'thorn',category:'defense'},
    {name:'殘影閃避',desc:'50% 機率完全免疫對方的招式攻擊。',image:'assets/skill-06.jpg',effect:'dodge',category:'defense'},
    {name:'靈魂汲取',desc:'扣除敵方 3 點 HP；自身額外 +3 HP。',image:'assets/skill-07.jpg',effect:'soul',category:'attack'},
    {name:'生機祈願',desc:'額外恢復 4 HP。',image:'assets/skill-08.jpg',effect:'wish',category:'defense'},
    {name:'復甦之風',desc:'+2 HP；每回合恢復 1 HP，直到滿血。',image:'assets/skill-09.jpg',effect:'wind',category:'defense'},
    {name:'破甲虛弱',desc:'自身 -1 防禦；對手每回合扣除 2 點防禦。',image:'assets/skill-10.jpg',effect:'weak',category:'attack'},
    {name:'封脈禁咒',desc:'禁止對手一回合；只能使用防禦、閃避及恢復類技能。',image:'assets/skill-11.jpg',effect:'seal',category:'control'},
    {name:'致命毒刃',desc:'對手每回合扣除 2 點 HP，直到歸零。',image:'assets/skill-12.jpg',effect:'poison',category:'attack'}
  ];
  const path=[[.072,.895],[.190,.895],[.285,.895],[.382,.895],[.478,.895],[.575,.895],[.673,.895],[.772,.895],[.910,.895],[.948,.785],[.948,.665],[.948,.550],[.948,.435],[.948,.320],[.948,.205],[.930,.070],[.832,.070],[.725,.070],[.620,.070],[.520,.070],[.415,.070],[.315,.070],[.205,.070],[.070,.070],[.070,.175],[.070,.285],[.070,.395],[.070,.505],[.070,.615],[.070,.735]];
  const middlePath=[[.231,.232],[.306,.315],[.384,.395],[.456,.467],[.536,.540],[.619,.619],[.693,.694],[.768,.768]];
  const poses={1:[0,0],6:[0,180],3:[0,-90],4:[0,90],2:[-90,0],5:[90,0]};
  const coinTiles=new Set([1,3,7,10,13,26,27,30]); // position 2 (outer tile #3) is the shop now.
  let selectedCharacter='odyssey',players=[],currentPlayer=0,round=1,night=false,busy=false,audioContext,pendingTurnAction=false,pendingSkill=null,modalActionType=null,gameStarted=false,gameOver=false;
  let countdownTimer=null,countdownLeft=10,pauseTimer=null,pauseInterval=null,pauseActive=false,duelState=null,duelResolve=null,coinRevealResolve=null,pendingCoinEvents=[],actionTimeout=null,finishingTurn=false,completingPendingAction=false,availableSkills=[...skills],pendingSkills=[],pendingSkillReplacements=[];
  let shopTimer=null,shopTick=null,shopRemaining=15,shopResolve=null,shopBoughtThisVisit=new Set();
  const shopItems={potion:{name:'紅色藥水',price:100,description:'立即恢復 HP +5',max:2},wind:{name:'疾風',price:1000,description:'拒絕對決 1 次',max:2},invisibility:{name:'隱身術',price:2000,description:'地圖上隱形 2 回合',max:2}};
  const gameMusic=$('gameMusic');
  let battleMusicEnabled=true,gameMusicEnabled=true,masterGain=null,masterCompressor=null;
  // Unlock Web Audio from the first real user gesture so UI/game sound effects remain audible in browsers.
  document.addEventListener('pointerdown',()=>{if(audioContext&&audioContext.state==='suspended')audioContext.resume().catch(()=>{});},{passive:true});
  document.addEventListener('keydown',()=>{if(audioContext&&audioContext.state==='suspended')audioContext.resume().catch(()=>{});});
  if(gameMusic){gameMusic.loop=true;gameMusic.volume=0.68;}
  if(battleMusic){battleMusic.loop=true;battleMusic.volume=0.68;}
  function startGameMusic(){if(!gameMusic||!gameMusicEnabled||duelState)return;if(battleMusic){battleMusic.pause();}gameMusic.volume=0.68;const result=gameMusic.play();if(result&&typeof result.catch==='function')result.catch(()=>{if(rollResult)rollResult.textContent='若未聽見遊戲背景音樂，請再點擊一次「開始遊戲」或擲骰按鈕。';});}
  function stopGameMusic(){if(!gameMusic)return;gameMusic.pause();}
  function startBattleMusic(){if(!battleMusic||!battleMusicEnabled)return;stopGameMusic();battleMusic.volume=0.72;const result=battleMusic.play();if(result&&typeof result.catch==='function')result.catch(()=>{if(duelStatus)duelStatus.textContent='對決已開始；若未聽見音樂，請點擊「戰鬥音樂：開」啟用播放。';});}
  function stopBattleMusic(){if(!battleMusic)return;battleMusic.pause();try{battleMusic.currentTime=0;}catch(_){}}
  if(battleMusicToggle)battleMusicToggle.addEventListener('click',()=>{battleMusicEnabled=!battleMusicEnabled;battleMusicToggle.textContent=battleMusicEnabled?'♫ 戰鬥音樂：開':'♫ 戰鬥音樂：關';battleMusicToggle.setAttribute('aria-pressed',String(battleMusicEnabled));if(battleMusicEnabled){if(duelState)startBattleMusic();}else{stopBattleMusic();if(duelState)stopGameMusic();}playTone('click');});
  // Shared delay helper used by dice animation, movement, NPC turns and duel pacing.
  // Missing this helper previously caused every roll to throw before the character could move.
  const wait = ms => new Promise(resolve => window.setTimeout(resolve, Math.max(0, Number(ms) || 0)));
  const MOVE_STEP_DELAY=460;
  document.querySelectorAll('.face').forEach(face=>{for(let i=0;i<9;i++){const pip=document.createElement('i');pip.className='pip';face.appendChild(pip);}});
  function getSoundContext(){const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;audioContext||=new A();if(!masterGain){masterCompressor=audioContext.createDynamicsCompressor();masterCompressor.threshold.value=-12;masterCompressor.knee.value=18;masterCompressor.ratio.value=4;masterCompressor.attack.value=.004;masterCompressor.release.value=.22;masterGain=audioContext.createGain();masterGain.gain.value=1.65;masterGain.connect(masterCompressor);masterCompressor.connect(audioContext.destination);}if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});return audioContext;}
  function scheduleNotes(ctx,notes,type='sine',peak=.22){const run=()=>{const n=ctx.currentTime;notes.forEach(v=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(v.f,n+v.t);g.gain.setValueAtTime(.0001,n+v.t);g.gain.exponentialRampToValueAtTime(Math.min(.72,peak),n+v.t+.012);g.gain.exponentialRampToValueAtTime(.0001,n+v.t+v.d);o.connect(g);g.connect(masterGain||ctx.destination);o.start(n+v.t);o.stop(n+v.t+v.d+.025);});};if(ctx.state==='suspended')ctx.resume().then(run).catch(()=>{});else run();}
  function playTone(kind='click'){try{const ctx=getSoundContext();if(!ctx)return;const notes=kind==='confirm'?[{f:523.25,t:0,d:.16},{f:659.25,t:.10,d:.18},{f:783.99,t:.21,d:.27},{f:1046.5,t:.31,d:.24}]:kind==='roll'?[{f:330,t:0,d:.10},{f:440,t:.07,d:.11},{f:550,t:.14,d:.12},{f:660,t:.21,d:.12},{f:740,t:.28,d:.15}]:[{f:660,t:0,d:.12},{f:880,t:.055,d:.15}];scheduleNotes(ctx,notes,kind==='confirm'?'triangle':'sine',kind==='confirm'?.55:.50);if(kind==='roll')playNoiseEffect('roll');}catch(_){}}
  function playNoiseEffect(kind='roll'){try{const ctx=getSoundContext();if(!ctx)return;const duration=kind==='roll'?.34:.22;const buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*duration),ctx.sampleRate);const data=buffer.getChannelData(0);for(let i=0;i<data.length;i++){const fade=Math.pow(1-i/data.length,kind==='roll'?.55:1.6);data[i]=(Math.random()*2-1)*fade;}const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();source.buffer=buffer;filter.type=kind==='roll'?'bandpass':'lowpass';filter.frequency.value=kind==='roll'?1250:260;filter.Q.value=kind==='roll'?.65:.7;gain.gain.setValueAtTime(.0001,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(kind==='roll'?.32:.46,ctx.currentTime+.018);gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+duration);source.connect(filter);filter.connect(gain);gain.connect(masterGain||ctx.destination);source.start();source.stop(ctx.currentTime+duration);}catch(_){}}
  function playEffectTone(kind='hit'){try{const ctx=getSoundContext();if(!ctx)return;const seq=kind==='skill'?[{f:260,t:0,d:.10},{f:520,t:.07,d:.13},{f:780,t:.14,d:.18}]:kind==='teleport'?[{f:330,t:0,d:.08},{f:660,t:.08,d:.12},{f:990,t:.16,d:.16}]:[{f:115,t:0,d:.11},{f:75,t:.05,d:.18}];scheduleNotes(ctx,seq,kind==='hit'?'sawtooth':'triangle',kind==='hit'?.58:.50);if(kind==='hit'||kind==='teleport'||kind==='skill')playNoiseEffect(kind);}catch(_){}}
  // Short fantasy-board footsteps: one soft heel thud plus a light stone/gravel scuff per tile moved.
  let footstepParity=0;
  function playFootstep(){try{const ctx=getSoundContext();if(!ctx)return;const now=ctx.currentTime;const low=ctx.createOscillator(),lowGain=ctx.createGain();low.type='sine';low.frequency.setValueAtTime(footstepParity++%2?92:108,now);low.frequency.exponentialRampToValueAtTime(58,now+.095);lowGain.gain.setValueAtTime(.0001,now);lowGain.gain.exponentialRampToValueAtTime(.22,now+.008);lowGain.gain.exponentialRampToValueAtTime(.0001,now+.115);low.connect(lowGain);lowGain.connect(masterGain||ctx.destination);low.start(now);low.stop(now+.13);const duration=.105;const buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*duration),ctx.sampleRate);const data=buffer.getChannelData(0);for(let i=0;i<data.length;i++){const fade=Math.pow(1-i/data.length,2.7);data[i]=(Math.random()*2-1)*fade;}const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();source.buffer=buffer;filter.type='bandpass';filter.frequency.value=footstepParity%2?520:680;filter.Q.value=.75;gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.105,now+.009);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);source.connect(filter);filter.connect(gain);gain.connect(masterGain||ctx.destination);source.start(now);source.stop(now+duration);}catch(_){}}
  function showSkillFlash(skill){if(!skill)return;duelSkillFlashImage.src=skill.image||'assets/coin-icon.svg';duelSkillFlashName.textContent=skill.name;duelSkillFlash.classList.remove('is-hidden');duelSkillFlash.classList.remove('play');void duelSkillFlash.offsetWidth;duelSkillFlash.classList.add('play');window.setTimeout(()=>duelSkillFlash.classList.add('is-hidden'),1100);playEffectTone('skill');}
  function syncDuelSkillDescription(){if(!duelState||!duelSkillSelect.options.length){duelSkillDescription.textContent='';return;}const s=(duelState.actionSkills||usableDuelSkills(duelState.attacker))[Number(duelSkillSelect.value)];duelSkillDescription.textContent=s?`${s.name}：${s.desc||'角色基本技能。'}`:'';}
  function show(screen){[startScreen,lobbyScreen,characterScreen,mapScreen].forEach(s=>s.classList.add('is-hidden'));screen.classList.remove('is-hidden');if(screen===mapScreen){resizeBoard();window.setMapTime(night?'night':'day');}}
  function resizeBoard(){if(!mapViewport||mapScreen.classList.contains('is-hidden'))return;const w=mapViewport.clientWidth,h=mapViewport.clientHeight;const leftReserve=108;const rightReserve=150;const maxBySides=w-leftReserve-rightReserve;const width=Math.max(260,Math.min(maxBySides,h*1.5));const left=leftReserve+Math.max(0,(maxBySides-width)/2);boardStage.style.position='absolute';boardStage.style.left=`${left}px`;boardStage.style.top=`${Math.max(0,(h-width/1.5)/2)}px`;boardStage.style.width=`${width}px`;boardStage.style.height=`${width/1.5}px`;mapScreen.style.setProperty('--board-left',`${left}px`);mapScreen.style.setProperty('--board-right',`${left+width}px`);positionAllTokens();}
  function nodeCoordinates(player){return player.position>=30?middlePath[player.position-30]:path[player.position]||path[0];}
  function setTokenPosition(token,player,offset=[0,0]){if(!token)return;const n=nodeCoordinates(player);token.style.left=`${n[0]*100+offset[0]}%`;token.style.top=`${n[1]*100+offset[1]}%`;token.classList.toggle('is-active',players[currentPlayer]===player);token.classList.toggle('is-invisible-faded',(player.invisibilityTurns||0)>0&&player.controlType==='local');}
  function positionAllTokens(){const groups=new Map();players.forEach((player,index)=>{if(!groups.has(player.position))groups.set(player.position,[]);groups.get(player.position).push({player,index});});groups.forEach((group,position)=>{const middle=position>=30;const outer={1:[[0,0]],2:[[-3.1,0],[3.1,0]],3:[[-3.1,-2.2],[3.1,-2.2],[0,2.8]],4:[[-3.1,-2.5],[3.1,-2.5],[-3.1,2.5],[3.1,2.5]]};const diagonal={1:[[0,0]],2:[[-2.6,3.6],[2.6,-3.6]],3:[[-2.6,3.6],[2.6,-3.6],[0,0]],4:[[-2.6,3.6],[2.6,-3.6],[-1.2,1.8],[1.2,-1.8]]};const offsets=(middle?diagonal:outer)[group.length]||(middle?diagonal:outer)[4];group.forEach((e,i)=>{if(e.player.token)setTokenPosition(e.player.token,e.player,offsets[i]||[0,0]);});});}
  function effectiveAttack(p){const c=characters[p.character];return p.attack+(night?c.nightAttack:c.dayAttack)+(p.attackBonusTurns>0?(p.attackBonus||p.attack):0);}
  function renderSelfStatus(){const p=players[0];if(!p)return;renderSelfLives();const c=characters[p.character];selfCharacterName.textContent=`${c.name}（${c.alias}）`;selfHP.textContent=`${p.hp}/${p.maxHP}`;selfAttack.textContent=String(effectiveAttack(p));selfDefense.textContent=String(p.defense);selfCoins.textContent=String(p.coins);const dodgeCount=$('selfDodgeCount');if(dodgeCount)dodgeCount.textContent=String(p.dodgeDuel||0);selfSkillSlots.innerHTML='';for(let i=0;i<4;i++){const slot=document.createElement('div');slot.className='self-skill-slot'+(p.skills[i]?'':' empty');if(p.skills[i]){const skill=p.skills[i];const img=document.createElement('img');img.src=skill.image||c.baseImage;img.alt=skill.name;img.title=skill.desc||'角色基本技能';slot.appendChild(img);const textWrap=document.createElement('div');textWrap.className='self-skill-text';const name=document.createElement('strong');name.textContent=skill.name;textWrap.appendChild(name);const desc=document.createElement('small');desc.className='self-skill-desc';desc.textContent=skill.desc||'角色基本技能；效果依照角色基本攻擊規則。';textWrap.appendChild(desc);slot.appendChild(textWrap);slot.title=`${skill.name}：${desc.textContent}`;}else{const icon=document.createElement('div');icon.className='skill-placeholder';icon.textContent='＋';slot.appendChild(icon);const textWrap=document.createElement('div');textWrap.className='self-skill-text';const name=document.createElement('strong');name.textContent='待獲得技能';textWrap.appendChild(name);const desc=document.createElement('small');desc.className='self-skill-desc';desc.textContent='踩到招式格或觸發招式獎勵後，可獲得新技能。';textWrap.appendChild(desc);slot.appendChild(textWrap);}selfSkillSlots.appendChild(slot);}
    if(selfInventory){selfInventory.innerHTML='';const inventory=p.inventory||{potion:0,wind:0,invisibility:0};const iconData={potion:{icon:'🧪',label:'紅色藥水'},wind:{icon:'🌪️',label:'疾風'},invisibility:{icon:'👻',label:'隱身術'}};Object.entries(shopItems).forEach(([key,item])=>{const count=inventory[key]||0;if(!count)return;const meta=iconData[key];const button=document.createElement('button');button.type='button';button.className=`inventory-icon-button inventory-${key}`;button.setAttribute('aria-label',`${meta.label}，持有 ${count} 個`);button.title=key==='wind'?`${meta.label} ×${count}：遇到對決時可選擇是否使用`:`${meta.label} ×${count}：點擊使用`;button.disabled=!gameStarted||currentPlayer!==0||busy||!!duelState||pauseActive;const icon=document.createElement('span');icon.className='inventory-icon-art';icon.textContent=meta.icon;const badge=document.createElement('span');badge.className='inventory-icon-count';badge.textContent=String(count);button.append(icon,badge);button.addEventListener('click',()=>{if(key==='wind'){rollResult.textContent='疾風會在觸發對決前詢問是否使用，不需要提前消耗。';return;}useInventoryItem(key);});selfInventory.appendChild(button);});}
    selfStatusNote.textContent='僅顯示 1P 自身數值；點選技能可查看完整說明，技能最多 4 招（含基本技能）。';}
  function renderSelfLives(){if(!selfLifeHearts)return;const lives=Math.max(0,Math.min(3,Number(players[0]?.lives??3)));selfLifeHearts.innerHTML='';for(let i=0;i<3;i++){const heart=document.createElement('span');heart.className='life-heart'+(i<lives?' is-alive':' is-lost');heart.textContent='♥';heart.setAttribute('aria-hidden','true');selfLifeHearts.appendChild(heart);}selfLifeHearts.setAttribute('aria-label',`自身玩家剩餘 ${lives} 條生命，共 3 條`);}
  function endGameIfNeeded(){if(gameOver||!players.some(p=>Number(p.lives??3)<=0))return false;gameOver=true;gameStarted=false;busy=false;pendingTurnAction=false;pauseActive=false;clearCountdown();if(pauseTimer)clearTimeout(pauseTimer);if(pauseInterval)clearInterval(pauseInterval);pauseOverlay.classList.add('is-hidden');const ranked=[...players].sort((a,b)=>(Number(b.lives??3)-Number(a.lives??3))||(Number(b.coins||0)-Number(a.coins||0)));gameOverRankings.innerHTML='';ranked.slice(0,3).forEach((p,index)=>{const li=document.createElement('li');li.className=`rank-${index+1}`;const medal=document.createElement('span');medal.className='rank-medal';medal.textContent=['🥇','🥈','🥉'][index];const info=document.createElement('div');info.className='rank-info';const name=document.createElement('strong');name.textContent=`${p===players[0]?'自身玩家／1P':`玩家 ${players.indexOf(p)+1}`}｜${characters[p.character].name}（${characters[p.character].alias}）`;const stats=document.createElement('small');stats.textContent=`生命 ${Math.max(0,Number(p.lives??3))}/3　・　金幣 ${Number(p.coins||0).toLocaleString('zh-TW')}`;info.append(name,stats);li.append(medal,info);gameOverRankings.appendChild(li);});gameOverReason.textContent='有玩家的三條生命已用盡，遊戲結束。排名先比較剩餘生命；生命相同時，再比較金幣數量。';gameOverModal.classList.remove('is-hidden');rollResult.textContent='遊戲結束，請查看前三名統計。';stopGameMusic();stopBattleMusic();updateTurnUI();return true;}
    function renderPlayers(){playerTokens.innerHTML='';players.forEach((p,i)=>{const token=document.createElement('img');token.className='player-token'+(i===currentPlayer?' is-active':'');token.src=characters[p.character].gif;token.alt=`玩家 ${i+1}：${characters[p.character].name}`;token.draggable=false;p.token=token;playerTokens.appendChild(token);});positionAllTokens();renderSelfStatus();updateTurnUI();}
  function createPlayers(count){clearCountdown();availableSkills=[...skills];pendingSkills=[];pendingSkillReplacements=[];const opponents=characterOrder.filter(id=>id!==selectedCharacter);players=[selectedCharacter,...opponents].slice(0,count).map((character,index)=>{const c=characters[character];return{character,position:0,token:null,label:`玩家 ${index+1}`,controlType:index===0?'local':'npc',lives:3,nextRoute:null,middleDirection:0,forcedOuterJunction:false,hp:c.hp,maxHP:c.hp,baseHP:c.hp,attack:c.attack,defense:c.defense,coins:0,inventory:{potion:0,wind:0,invisibility:0},invisibilityTurns:0,skills:[{name:c.baseSkill,base:true,image:c.baseImage,desc:'角色基本技能；效果依照角色基本攻擊規則。'}],lapRewards:0,hasClaimedLap:false,lapsCompleted:0,pauseUses:0,attackBonus:0,attackBonusTurns:0,regenTurns:0,regenActive:false,poisonTurns:0,defenseDrainTurns:0,stunnedTurns:0,sealedTurns:0,immuneNext:false,dodgeDuel:0};});currentPlayer=0;round=1;night=false;busy=false;pendingTurnAction=false;pauseActive=false;completingPendingAction=false;gameStarted=false;gameOver=false;gameOverModal.classList.add('is-hidden');window.setMapTime('day');renderPlayers();rollResult.textContent='請所有玩家準備完成，再按「開戰」';cube.style.transform='rotateX(-22deg) rotateY(-28deg)';battleStartButton.classList.remove('is-hidden');readyStatus.textContent=`${count} 位玩家已準備`;updateTurnUI();}
  function updateBoardActions(){const p=players[currentPlayer];const localTurn=!!p&&p.controlType==='local';const skillReady=!!p&&isSkillTile(p.position)&&availableSkills.length>0;const coinReady=!!p&&(coinTiles.has(p.position)||p.lapRewards>0||(isSkillTile(p.position)&&availableSkills.length===0));skillActionButton.disabled=!localTurn||busy||!skillReady||!pendingTurnAction;coinActionButton.disabled=!localTurn||busy||!coinReady||!pendingTurnAction;skillActionButton.title=availableSkills.length?`抽取招式（剩餘 ${availableSkills.length} 種）`:'招式已抽完，改抽金幣';}
  function updateTurnUI(){roundLabel.textContent=`第 ${round} 回合`;phaseLabel.textContent=night?'☾ 夜晚':'☀ 白天';const p=players[currentPlayer];turnLabel.textContent=p?`${p.label||`玩家 ${currentPlayer+1}`}｜${characters[p.character].name}${p.controlType==='npc'?'（NPC）':''}`:'等待玩家';positionAllTokens();renderSelfStatus();updateBoardActions();const disabled=!gameStarted||busy||pendingTurnAction||!p||p.controlType!=='local'||pauseActive||!!duelState;rollButton.disabled=disabled;dieStage.setAttribute('aria-disabled',String(disabled));playerCount.disabled=gameStarted||busy||pendingTurnAction||pauseActive||!!duelState;pauseButton.disabled=!p||p.controlType!=='local'||pauseActive||p.pauseUses>=3||busy||!!duelState||pendingTurnAction||!gameStarted;pauseButton.textContent=pauseActive?'暫停中…':`暫停（剩餘 ${p?3-p.pauseUses:3} 次）`;}
  function isJunction(pos){return pos===8||pos===23;}
  function routeLabel(pos){return pos===8?'右下角「選擇方向」':'左上角「選擇方向」';}
  async function chooseRoute(p,junction){if(p.controlType==='npc'){await wait(350);const route=Math.random()<.42?'middle':'outer';p.nextRoute=route;rollResult.textContent=`NPC 選擇${route==='middle'?'中路':'外圍'}`;return route;}return new Promise(resolve=>{routeChoiceTitle.textContent=`${routeLabel(junction)}：請選擇路線`;routeChoiceModal.classList.remove('is-hidden');chooseMiddleButton.focus();const cleanup=()=>{routeChoiceModal.classList.add('is-hidden');chooseMiddleButton.removeEventListener('click',onMiddle);chooseOuterButton.removeEventListener('click',onOuter);};const onMiddle=()=>{p.nextRoute='middle';cleanup();resolve('middle');};const onOuter=()=>{p.nextRoute='outer';cleanup();resolve('outer');};chooseMiddleButton.addEventListener('click',onMiddle);chooseOuterButton.addEventListener('click',onOuter);});}
  function advanceOneNode(p){const pos=p.position;if(pos===8||pos===23){const route=p.forcedOuterJunction?'outer':(p.nextRoute||'outer');p.forcedOuterJunction=false;p.nextRoute=null;if(route==='middle'){if(pos===23){p.position=30;p.middleDirection=1;}else{p.position=37;p.middleDirection=-1;}}else{p.position=pos===8?9:24;}return;}if(pos>=30){if(!p.middleDirection)p.middleDirection=pos<=33?1:-1;const next=pos+p.middleDirection;if(next>=30&&next<=37){p.position=next;}else{p.position=p.middleDirection>0?8:23;p.forcedOuterJunction=true;p.nextRoute='outer';p.middleDirection=0;}return;}const prev=p.position;p.position=(pos+1)%path.length;if(prev===29&&p.position===0){p.lapRewards++;p.hasClaimedLap=false;p.lapsCompleted=(p.lapsCompleted||0)+1;}}
  function isSkillTile(pos){return pos===5||pos===35;}
  function canAct(p){return isSkillTile(p.position)||coinTiles.has(p.position)||p.lapRewards>0;}
  async function rollDice(){if(!gameStarted||busy||pendingTurnAction||pauseActive||duelState||!players.length||!routeChoiceModal.classList.contains('is-hidden')||!actionModal.classList.contains('is-hidden'))return;const active=players[currentPlayer];if(!active||active.controlType==='npc')return;clearCountdown();await runRoll(active);}
  function haveBothPassedStart(a,b){return (a?.lapsCompleted||0)>=1&&(b?.lapsCompleted||0)>=1;}
  function hasDuelEscapeResource(player){return !!player&&(((player.dodgeDuel||0)>0)||((player.inventory?.wind||0)>0));}
  function consumeDuelEscapeResource(player){if(!player)return false;if((player.dodgeDuel||0)>0){player.dodgeDuel--;return true;}if((player.inventory?.wind||0)>0){player.inventory.wind--;return true;}return false;}
  async function askDuelEscape(player,opponent){
    if(!hasDuelEscapeResource(player))return false;
    if(player===players[0]){
      const use=window.confirm(`即將與${characters[opponent?.character]?.name||'對手'}對決。你持有疾風／閃避機會，要使用一次並拒絕本次對決嗎？`);
      if(!use)return false;
      consumeDuelEscapeResource(player);renderSelfStatus();rollResult.textContent='已使用疾風，拒絕本次對決。';playTone('confirm');return true;
    }
    // NPCs automatically spend their earned one-time dodge when an encounter starts.
    if(player.controlType==='npc'&&(player.dodgeDuel||0)>0){consumeDuelEscapeResource(player);rollResult.textContent=`${characters[player.character].name} 使用疾風，拒絕本次對決。`;return true;}
    return false;
  }
  async function startDuelWithEscapeCheck(active,opponent,opponents=[opponent]){
    // Permanent duel prerequisite: both participants must have completed one full lap
    // and crossed the 「由此去」 start tile. Keep this guard centralized so every
    // duel entry point, including voluntary duel tiles, obeys the same rule.
    if(!haveBothPassedStart(active,opponent)){
      rollResult.textContent='尚未開放對決：雙方都必須先完整繞行棋盤，經過一次「由此去」起點。';
      return {blocked:true};
    }
    opponents=opponents.filter(candidate=>haveBothPassedStart(active,candidate));
    if(!opponents.includes(opponent)){
      rollResult.textContent='對手尚未經過一次「由此去」，目前不能與該玩家對決。';
      return {blocked:true};
    }
    const participants=[active,opponent].filter((p,i,arr)=>p&&arr.indexOf(p)===i);
    // Always ask the local player before a duel when they own a Wind item or a saved dodge.
    for(const participant of participants){if(participant===players[0]&&hasDuelEscapeResource(participant)){if(await askDuelEscape(participant,participant===active?opponent:active))return {escaped:true,escapee:participant};}}
    // NPC dodge tiles keep their automatic behavior; shop items are player-owned inventory.
    for(const participant of participants){if(participant!==players[0]&&participant.controlType==='npc'&&(participant.dodgeDuel||0)>0){consumeDuelEscapeResource(participant);renderSelfStatus();rollResult.textContent=`${characters[participant.character].name} 使用疾風，拒絕本次對決。`;return {escaped:true,escapee:participant};}}
    return startDuel(active,opponent,opponents);
  }
  async function resolveLandingCollision(active){
    const encountered=players.filter(p=>p!==active&&p.position===active.position&&p.hp>0);
    if(active._skipNextCollisionDuel){active._skipNextCollisionDuel=false;return false;}
    if(!encountered.length)return false;
    // Only players who have each completed a lap and crossed 「由此去」 may duel.
    const opponents=encountered.filter(candidate=>haveBothPassedStart(active,candidate));
    if(!opponents.length){
      rollResult.textContent='角色相遇，但對決尚未開放：雙方都必須先完整繞行棋盤，經過一次「由此去」起點。';
      return false;
    }
    if(active!==players[0]&&active.controlType==='npc'&&(active.dodgeDuel||0)>0){consumeDuelEscapeResource(active);rollResult.textContent=`${characters[active.character].name} 使用疾風，拒絕本次對決。`;return false;}
    if(active===players[0]&&hasDuelEscapeResource(active)){if(await askDuelEscape(active,opponents[0])){active._forceFinishAfterDuel=true;return true;}}
    const localOpponent=opponents.find(q=>q===players[0]&&hasDuelEscapeResource(q));
    if(localOpponent&&active!==players[0]){if(await askDuelEscape(localOpponent,active)){active._forceFinishAfterDuel=true;return true;}}
    const available=[];
    for(const candidate of opponents){if(candidate!==players[0]&&candidate.controlType==='npc'&&(candidate.dodgeDuel||0)>0){consumeDuelEscapeResource(candidate);rollResult.textContent=`${characters[candidate.character].name} 使用疾風，拒絕本次對決。`;continue;}available.push(candidate);}
    if(!available.length)return false;
    const opponent=active.controlType==='npc'?available[Math.floor(Math.random()*available.length)]:available[0];
    // Local-player Wind prompts have already been handled above; do not ask twice after a decline.
    const duelOutcome=await startDuel(active,opponent,available);
    if(duelOutcome&&(duelOutcome.loser===active||duelOutcome.escaped)){active._forceFinishAfterDuel=true;return true;}
    return false;
  }
  async function runRoll(active){
    if(!gameStarted||busy||pendingTurnAction||pauseActive||duelState)return;
    clearCountdown();busy=true;updateTurnUI();playTone('roll');
    try{
      const result=1+Math.floor(Math.random()*6),[x,y]=poses[result];
      const extraX=720+Math.floor(Math.random()*3)*360,extraY=720+Math.floor(Math.random()*3)*360;
      cube.style.transform=`rotateX(${x+extraX}deg) rotateY(${y+extraY}deg)`;
      rollResult.textContent='骰子轉動中…';await wait(1350);
      rollResult.textContent=`擲出 ${result} 點，前進 ${result} 格`;
      let moved=0,moveGuard=0;
      while(moved<result){
        if(++moveGuard>10)throw new Error('移動步數超出安全上限，已中止本次移動');
        const previous=active.position;
        advanceOneNode(active);
        if(active.position===previous){if(previous===8||previous===23){active.position=previous===8?9:24;active.forcedOuterJunction=false;active.nextRoute=null;active.middleDirection=0;}else if(previous>=30){active.position=previous===37?36:previous===30?31:previous-1;}else{active.position=(previous+1)%path.length;}rollResult.textContent='已自動修正移動路徑，繼續前進';}
        positionAllTokens();playFootstep();moved++;await publishOnlineState();await wait(MOVE_STEP_DELAY);
        if(isJunction(active.position)){
          if(active.forcedOuterJunction){rollResult.textContent='經過選擇方向格，接回外圍';}
          else{rollResult.textContent=`玩家 ${currentPlayer+1} 抵達選擇方向`;await chooseRoute(active,active.position);}
          if(moved<result)rollResult.textContent=`繼續移動（剩餘 ${result-moved} 格）`;
        }
      }
      busy=false;updateTurnUI();
      await publishOnlineState();
      await resolveLanding(active);
      await publishOnlineState();
      if(active._duelEscaped||active._forceFinishAfterDuel){active._duelEscaped=false;active._forceFinishAfterDuel=false;finishTurn();return;}
      const deferCollisionUntilAfterAction=canAct(active)&&!active._skipLandingAction;
      if(!deferCollisionUntilAfterAction){const endedByDuel=await resolveLandingCollision(active);if(endedByDuel){finishTurn();return;}}
      if(canAct(active)&&!active._skipLandingAction){
        pendingTurnAction=true;rollResult.textContent=isSkillTile(active.position)&&availableSkills.length>0?'踩到招式格：可抽取未重複技能，滿格時可替換非基本技能。':'可以領取金幣：點擊金幣按鈕。';updateTurnUI();await publishOnlineState();
        if(active.controlType==='npc'){await wait(700);if(isSkillTile(active.position)&&availableSkills.length>0)await drawSkill(active);else await collectCoin(active);{const endedByDuel=await resolveLandingCollision(active);if(endedByDuel){pendingTurnAction=false;finishTurn();return;}}pendingTurnAction=false;finishTurn();}
        else updateBoardActions();
        return;
      }
      active._skipLandingAction=false;
      finishTurn();
    }catch(error){
      console.error('回合執行錯誤，已自動復原：',error);
      busy=false;pendingTurnAction=false;
      routeChoiceModal.classList.add('is-hidden');
      if(modalActionType!=='coinReveal')actionModal.classList.add('is-hidden');
      rollResult.textContent='本回合遇到異常，系統已解除卡住狀態並繼續遊戲。';
      updateTurnUI();
      if(gameStarted&&!pauseActive&&!duelState)startTurnCountdown();
    }
  }
  // Zero-based tile positions: tile 7 blue square pairs with top-row blue square (tile 21), not the adjacent HP +1 tile.
  const teleportPairs=new Map([[6,20],[20,6],[11,32],[32,11],[22,36],[36,22]]);
  function choosePlayerOnMap(p,label,others=players.filter(q=>q!==p&&q.hp>0),allowPass=true){
    const eligible=others.filter(q=>q!==p);if(!eligible.length)return Promise.resolve(null);
    if(p.controlType==='npc')return Promise.resolve(eligible[Math.floor(Math.random()*eligible.length)]);
    return new Promise(resolve=>{
      let settled=false;busy=true;updateTurnUI();playerSelectionText.textContent='選擇任一玩家';playerSelectionHint.textContent=label.replace('選擇任一玩家｜','');playerSelectionBanner.classList.remove('is-hidden');mapViewport.classList.add('is-picking-player');playerTokens.style.pointerEvents='auto';
      const cleanup=()=>{playerSelectionBanner.classList.add('is-hidden');mapViewport.classList.remove('is-picking-player');playerTokens.style.pointerEvents='none';players.forEach(q=>{if(q.token){q.token.onclick=null;q.token.classList.remove('is-selectable-target');}});cancelPlayerSelection.onclick=null;busy=false;updateTurnUI();};
      const finish=target=>{if(settled)return;settled=true;cleanup();resolve(target);};
      players.forEach(q=>{if(!eligible.includes(q)||!q.token)return;q.token.classList.add('is-selectable-target');q.token.onclick=e=>{e.stopPropagation();finish(q);};});
      cancelPlayerSelection.textContent=allowPass?'PASS／取消':'取消';cancelPlayerSelection.onclick=()=>finish(null);
    });
  }
  function queueOnlineCoinEvent(from,to,amount,reason='奪取金幣'){if(!onlineGameChannel||!onlineGameRoomId||amount<=0)return;onlineCoinEventsQueue.push({id:`${lobbyClientId}-${Date.now()}-${++onlineCoinEventSeq}`,fromId:from?.onlineClientId||null,toId:to?.onlineClientId||null,fromName:from?.label||from?.player_name||'玩家',toName:to?.label||to?.player_name||'',amount:Number(amount),reason});}
  function takeCoins(from,to,count=1,reason='奪取金幣'){let taken=0;for(let i=0;i<count;i++){if(from.coins<=0)break;let amount=Math.min(from.coins,weightedCoins());if(amount<=0)amount=from.coins;from.coins-=amount;to.coins+=amount;taken+=amount;const event={from,to,amount,reason};pendingCoinEvents.push(event);queueOnlineCoinEvent(from,to,amount,reason);}return taken;}
  async function resolveLanding(p,allowTeleport=true){
    if(!p||p.hp<=0)return;
    pendingCoinEvents=[];
    const before=p.position;
    const landedOnTeleport=allowTeleport&&teleportPairs.has(before);
    if(landedOnTeleport){const dest=teleportPairs.get(before);p.position=dest;if(dest>=30)p.middleDirection=dest<=33?1:-1;else p.middleDirection=0;positionAllTokens();playEffectTone('teleport');rollResult.textContent=`傳送格啟動：移動至第 ${dest+1} 格`;await publishOnlineState();await wait(520);const ended=await resolveLandingCollision(p);await publishOnlineState();if(ended){p._forceFinishAfterDuel=true;return;}}
    // Teleport destinations also activate their tile effect, but paired portals are not chained indefinitely.
    if(landedOnTeleport){await resolveLanding(p,false);return;}
    const pos=p.position;
    // Only trigger a tile when the dice movement ends on it, not when passing through.
    if(pos===2){await openShop(p);}
    if(pos===4){
      // Animate each forced step separately, then resolve the blue teleport only after landing on it.
      for(let i=0;i<2;i++){advanceOneNode(p);positionAllTokens();playFootstep();rollResult.textContent=`再前進兩格（第 ${i+1}/2 格）`;await wait(MOVE_STEP_DELAY);}
      if(teleportPairs.has(p.position)){const destination=teleportPairs.get(p.position);rollResult.textContent='已踩入藍色傳送格，準備傳送…';await wait(420);p.position=destination;if(destination>=30)p.middleDirection=destination<=33?1:-1;else p.middleDirection=0;positionAllTokens();playEffectTone('teleport');rollResult.textContent='再前進兩格後，觸發藍色傳送！';await publishOnlineState();await wait(500);const ended=await resolveLandingCollision(p);await publishOnlineState();if(ended){p._forceFinishAfterDuel=true;return;}}
      else {
        rollResult.textContent='再前進兩格！';
        await publishOnlineState();const ended=await resolveLandingCollision(p);await publishOnlineState();if(ended){p._forceFinishAfterDuel=true;return;}
      }
    }
    if(pos===9){p.attackBonus= p.attackBonus||0;p.attackBonusTurns=Math.max(p.attackBonusTurns,3);p.attackBonus=p.attack+(night?characters[p.character].nightAttack:characters[p.character].dayAttack);rollResult.textContent='攻擊力提升為兩倍，持續 3 回合。';}
    if(pos===12){p.defense+=1;rollResult.textContent='防禦 +1。';}
    if(pos===14){p.defense=Math.max(0,p.defense-1);rollResult.textContent='防禦 -1。';}
    if(pos===15){p.stunnedTurns=Math.max(p.stunnedTurns,1);rollResult.textContent='暫停一回合：此玩家下次回合跳過。';}
    if(pos===16){let total=0;for(const recipient of players){if(recipient!==p)total+=takeCoins(p,recipient,2,'奪取金幣');}rollResult.textContent=`每位其他玩家各奪取你 2 張金幣；共有 ${players.filter(q=>q!==p).length} 位玩家時，合計抽走 ${Math.max(0,players.filter(q=>q!==p).length)*2} 張（實際金額 ${total}）。`;}
    if(pos===17){p.dodgeDuel= (p.dodgeDuel||0)+1;rollResult.textContent='獲得疾風閃避：可拒絕一次被指定的對決。';}
    if(pos===18){p.hp=Math.min(p.maxHP,p.hp+2);rollResult.textContent='HP +2。';}
    if(pos===19){p.attack=Math.max(0,p.attack-1);rollResult.textContent='攻擊 -1。';}
    if(pos===20){p.hp=Math.min(p.maxHP,p.hp+1);rollResult.textContent='HP +1。';}
    if(pos===24){const total=takeCoins(p,{coins:0,player_name:'NPC'},2,'NPC 奪取金幣');rollResult.textContent=`金幣被 NPC 奪取：本次損失 ${total} 金幣。`;}
    if(pos===25){if(p.controlType==='npc'){const destination=Math.floor(Math.random()*(path.length+middlePath.length));p.position=destination;if(destination>=30)p.middleDirection=destination<=33?1:-1;else p.middleDirection=0;positionAllTokens();playEffectTone('teleport');rollResult.textContent=`NPC 選擇傳送至第 ${destination+1} 格。`;await publishOnlineState();const ended=await resolveLandingCollision(p);await publishOnlineState();if(ended){p._forceFinishAfterDuel=true;return;}if(destination!==25)await resolveLanding(p,false);}else{await chooseMapDestination(p);if(p.position!==25){await publishOnlineState();const ended=await resolveLandingCollision(p);await publishOnlineState();if(ended){p._forceFinishAfterDuel=true;return;}await resolveLanding(p,false);}}}
    if(pos===28){const target=await choosePlayerOnMap(p,'選擇任一玩家｜互換角色樣貌與基本能力（保留各自金幣及抽到的技能）');if(target){const keys=['character','hp','maxHP','baseHP','attack','defense'];const a={},b={};keys.forEach(k=>{a[k]=p[k];b[k]=target[k];});const ownEarned=(player)=>player.skills.filter(skill=>!skill.base);Object.assign(p,b);Object.assign(target,a);const syncBaseSkill=(player)=>{const c=characters[player.character];player.skills=[{name:c.baseSkill,base:true,image:c.baseImage,desc:'角色基本技能；效果依照角色基本攻擊規則。'},...ownEarned(player)].slice(0,4);};syncBaseSkill(p);syncBaseSkill(target);rollResult.textContent='角色樣貌與基本能力已互換；金幣及各自抽到的技能保持不變。';renderPlayers();}}
    if(pos===29){p.attack+=1;rollResult.textContent='攻擊 +1。';}
    if(pos===30){rollResult.textContent='金幣 ×3：可領取三張金幣獎勵。';}
    if(pos===31){const encountered=players.filter(q=>q!==p&&q.hp>0);const opponents=encountered.filter(q=>haveBothPassedStart(p,q));if(!opponents.length){rollResult.textContent=encountered.length?'尚未開放指定對決：雙方都必須先完整繞行棋盤，經過一次「由此去」起點。':'目前沒有可對決的對手。';}else{const target=await choosePlayerOnMap(p,'選擇任一玩家｜開始對決',opponents,true);if(target){const outcome=await startDuelWithEscapeCheck(p,target,opponents);if(outcome&&outcome.escaped){p._duelEscaped=true;}else if(!(outcome&&outcome.blocked)){p._skipNextCollisionDuel=true;rollResult.textContent='對決開始！雙方擲骰決定先攻。';}}else rollResult.textContent='已放棄對決。'}}
    if(pos===33){let total=0;for(const victim of players){if(victim!==p)total+=takeCoins(victim,p,1,'奪取金幣');}rollResult.textContent=`奪取每位對手一份金幣，共 ${total}。`;}
    if(pos===34){p.maxHP+=2;p.hp+=2;p.attack+=2;p.defense+=2;rollResult.textContent='所有屬性 +2（HP、攻擊、防禦）。';}
    if(pos===37){const target=await choosePlayerOnMap(p,'選擇任一玩家｜交換位置');if(target){const old=p.position;p.position=target.position;target.position=old;positionAllTokens();rollResult.textContent='雙方位置已交換。';await publishOnlineState();const ended=await resolveLandingCollision(p);await publishOnlineState();if(ended){p._forceFinishAfterDuel=true;return;}}}
    if(p.stunnedTurns>0&&pos!==15&&p._justStunned){p._justStunned=false;}
    renderPlayers();
    await presentCoinEvents(p);
  }
  function refreshShopUI(p){
    if(!p)return;shopCoins.textContent=String(p.coins);const inv=p.inventory||{};
    const ids={potion:'shopPotionCount',wind:'shopWindCount',invisibility:'shopInvisibilityCount'};
    Object.entries(shopItems).forEach(([key,item])=>{const count=inv[key]||0;const el=$(ids[key]);if(el)el.textContent=`持有 ${count}/${item.max}`;const btn=shopModal.querySelector(`[data-buy-item="${key}"]`);if(btn){const bought=shopBoughtThisVisit.has(key);const full=count>=item.max;const poor=p.coins<item.price;btn.disabled=bought||full||poor;btn.textContent=bought?'本次已購買':full?'已達持有上限':poor?'金幣不足':'購買';const card=shopModal.querySelector(`[data-shop-item="${key}"]`);if(card)card.classList.toggle('is-sold',bought);}});
  }
  function closeShop(reason='leave'){
    if(shopTimer){clearTimeout(shopTimer);shopTimer=null;}if(shopTick){clearInterval(shopTick);shopTick=null;}if(shopModal)shopModal.classList.add('is-hidden');const resolve=shopResolve;shopResolve=null;busy=false;updateTurnUI();if(reason==='timeout')rollResult.textContent='商店時間結束，已自動離開商店。';else if(reason==='leave')rollResult.textContent='已離開商店。';if(resolve)resolve();
  }
  function openShop(p){
    if(!p||p.controlType==='npc'){rollResult.textContent='抵達商店格。NPC 略過購物。';return Promise.resolve();}
    return new Promise(resolve=>{shopResolve=resolve;shopBoughtThisVisit=new Set();shopRemaining=15;busy=true;shopHint.textContent='每種道具本次限購 1 個，單一道具最多持有 2 個。';shopTimerText.textContent='剩餘 15 秒';shopTimerBar.style.width='100%';shopModal.classList.remove('is-hidden');refreshShopUI(p);updateTurnUI();
      if(shopTimer)clearTimeout(shopTimer);if(shopTick)clearInterval(shopTick);shopTick=setInterval(()=>{shopRemaining=Math.max(0,shopRemaining-1);shopTimerText.textContent=`剩餘 ${shopRemaining} 秒`;shopTimerBar.style.width=`${shopRemaining/15*100}%`;if(shopRemaining<=0){closeShop('timeout');}},1000);shopTimer=setTimeout(()=>closeShop('timeout'),15000);
      rollResult.textContent='抵達商店！你有 15 秒購買補給，可提前離開。';
    });
  }
  function buyShopItem(key){
    const p=players[0],item=shopItems[key];if(!p||!item||shopModal.classList.contains('is-hidden'))return;
    p.inventory=p.inventory||{potion:0,wind:0,invisibility:0};const count=p.inventory[key]||0;
    if(shopBoughtThisVisit.has(key)){shopHint.textContent='這次進入商店已購買過此道具；每種每次限購 1 個。';return;}
    if(count>=item.max){shopHint.textContent=`${item.name}最多持有 ${item.max} 個，請先使用後再購買。`;return;}
    if(p.coins<item.price){shopHint.textContent='金幣不足，無法購買這項道具。';playTone('error');return;}
    p.coins-=item.price;p.inventory[key]=count+1;shopBoughtThisVisit.add(key);renderSelfStatus();refreshShopUI(p);playTone('confirm');shopHint.textContent=`已購買${item.name}！道具已放入你的冒險背包。`;rollResult.textContent=`購買${item.name}成功，剩餘 ${p.coins} 金幣。`;
  }
  function useInventoryItem(key){
    const p=players[0];if(!p||!gameStarted||currentPlayer!==0||busy||duelState||pauseActive)return;
    p.inventory=p.inventory||{};if((p.inventory[key]||0)<=0)return;
    if(key==='potion'){
      if(p.hp>=p.maxHP){rollResult.textContent='HP 已滿，現在不需要使用紅色藥水。';return;}
      const before=p.hp;p.hp=Math.min(p.maxHP,p.hp+5);p.inventory.potion--;rollResult.textContent=`使用紅色藥水，HP ${before} → ${p.hp}（+${p.hp-before}）。`;
    }else if(key==='wind'){
      rollResult.textContent='疾風會在觸發對決前詢問是否使用；道具目前仍保留在背包。';
    }else if(key==='invisibility'){
      p.invisibilityTurns=Math.max(p.invisibilityTurns||0,2);p.inventory.invisibility--;rollResult.textContent='使用隱身術：你的 Q 版角色會淡化顯示，持續 2 回合。';
    }
    renderPlayers();updateTurnUI();playTone('confirm');
  }
  shopModal.querySelectorAll('[data-buy-item]').forEach(btn=>btn.addEventListener('click',()=>buyShopItem(btn.dataset.buyItem)));
  shopCloseX.addEventListener('click',()=>closeShop('leave'));shopLeaveButton.addEventListener('click',()=>closeShop('leave'));

  async function chooseMapDestination(p){
    return new Promise(resolve=>{
      busy=true;updateTurnUI();const oldText=rollResult.textContent;rollResult.textContent='請直接點選地圖上的任一格作為傳送目的地';
      mapViewport.classList.add('is-picking-destination');
      const handler=e=>{
        if(e.target.closest('button'))return;
        const rect=boardStage.getBoundingClientRect();
        if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)return;
        const x=(e.clientX-rect.left)/rect.width,y=(e.clientY-rect.top)/rect.height;
        const nodes=[...path,...middlePath];let best=0,bestD=Infinity;
        nodes.forEach((node,i)=>{const dx=(node[0]-x)*rect.width,dy=(node[1]-y)*rect.height,d=dx*dx+dy*dy;if(d<bestD){bestD=d;best=i;}});
        p.position=best;if(best>=30)p.middleDirection=best<=33?1:-1;else p.middleDirection=0;p._skipLandingAction=false;positionAllTokens();playEffectTone('teleport');rollResult.textContent=`已傳送至你選擇的第 ${best+1} 格。`;
        mapViewport.classList.remove('is-picking-destination');mapViewport.removeEventListener('click',handler,true);busy=false;updateTurnUI();resolve();
      };
      mapViewport.addEventListener('click',handler,true);
    });
  }
  function showCoinBatch(title,items,description=''){
    return new Promise(resolve=>{
      modalActionType='coinReveal';coinRevealResolve=resolve;
      actionModalTitle.textContent=title;actionSkillName.textContent='';
      actionSkillDescription.textContent=description;
      actionSkillImage.src='assets/coin-icon.svg';actionSkillImage.alt='金幣';actionSkillImage.hidden=false;actionSkillImage.classList.add('action-coin-image');if(actionSkillBatch){actionSkillBatch.innerHTML='';actionSkillBatch.classList.add('is-hidden');}
      coinEventGrid.innerHTML='';coinEventGrid.className='coin-event-grid '+(items.some(item=>item.kind==='loss')?'has-loss':'has-gain');
      items.forEach((item,index)=>{
        const card=document.createElement('div');card.className='coin-event-card '+(item.kind==='loss'?'coin-loss':'coin-gain');
        const label=document.createElement('strong');label.className='coin-event-label';label.textContent=item.kind==='loss'?'金幣損失':'金幣獲得';
        const img=document.createElement('img');img.src='assets/coin-icon.svg';img.alt='金幣';
        const amount=document.createElement('b');amount.textContent=`${item.kind==='loss'?'−':'+'}${Number(item.amount).toLocaleString('zh-TW')}`;
        const indexLabel=document.createElement('small');indexLabel.textContent=items.length>1?`第 ${index+1} 筆`:item.kind==='loss'?'失去的金幣':'獲得的金幣';
        card.append(label,img,amount,indexLabel);coinEventGrid.appendChild(card);
      });
      acceptActionButton.textContent='確認';cancelActionButton.textContent='關閉';
      coinEventGrid.classList.remove('is-hidden');actionModal.classList.remove('is-hidden');
      actionModal.querySelector('.action-modal-card')?.classList.toggle('coin-batch-loss',items.some(item=>item.kind==='loss')&&!items.some(item=>item.kind==='gain'));
      actionModal.querySelector('.action-modal-card')?.classList.toggle('coin-batch-gain',items.some(item=>item.kind==='gain')&&!items.some(item=>item.kind==='loss'));
    });
  }
  async function presentCoinEvents(active){
    const viewer=players[0];if(!viewer||viewer.controlType==='npc'||!pendingCoinEvents.length)return;
    const relevant=pendingCoinEvents.filter(event=>event.from===viewer||event.to===viewer);
    if(relevant.length){
      const items=relevant.map(event=>({amount:event.amount,kind:event.to===viewer?'gain':'loss'}));
      const gains=items.filter(x=>x.kind==='gain').length,losses=items.length-gains;
      const theft=pendingCoinEvents.some(e=>e.from===viewer&&(!e.to||!e.to.onlineClientId||/奪取/.test(e.reason||'')));
      const title=gains&&losses?'金幣結算':gains?'金幣獲得':theft?'金幣被奪取':'金幣損失';
      await showCoinBatch(title,items,`本次共 ${items.length} 筆金幣變動，已同步更新金幣總額。${theft?'請留意上方顯示的實際損失金額。':''}`);
    }
    pendingCoinEvents=[];closeModal();
  }
  function finishTurn(){
    if(finishingTurn||gameOver)return;
    if(!players.length){pendingTurnAction=false;return;}
    finishingTurn=true;
    clearCountdown();
    if(actionTimeout){clearTimeout(actionTimeout);actionTimeout=null;}
    pendingTurnAction=false;
    applyEndOfTurnEffects(players[currentPlayer]);
    const advance=()=>{
      const onlineIds=(onlineGameRoomId&&onlineGameChannel)
        ? onlineGameRoster.map(m=>m.clientId).filter(Boolean)
        : [];
      if(onlineIds.length>1){
        // Every device stores its own player in array slot 0. Turn order must therefore
        // use the shared host/join order, not increment each device's local array index.
        const activeId=players[currentPlayer]?.onlineClientId||lobbyClientId;
        let sharedIndex=onlineIds.indexOf(activeId);
        if(sharedIndex<0)sharedIndex=onlineIds.indexOf(lobbyClientId);
        const nextSharedIndex=(sharedIndex+1)%onlineIds.length;
        const wrapped=nextSharedIndex===0;
        const nextId=onlineIds[nextSharedIndex];
        const localIndex=players.findIndex(player=>player.onlineClientId===nextId);
        if(localIndex>=0)currentPlayer=localIndex;
        if(wrapped){
          // Each full shared round: living players recover 1 HP, capped at baseHP.
          round++;players.forEach(player=>{const cap=player.maxHP??player.baseHP;if(player.hp>0)player.hp=Math.min(cap,player.hp+1);});night=!night;window.setMapTime(night?'night':'day');
          rollResult.textContent+=night?'｜夜幕降臨':'｜天色轉亮';
        }
        return;
      }
      currentPlayer++;
      if(currentPlayer>=players.length){
        // Offline/solo fallback behaviour.
        currentPlayer=0;round++;players.forEach(player=>{const cap=player.maxHP??player.baseHP;if(player.hp>0)player.hp=Math.min(cap,player.hp+1);});night=!night;window.setMapTime(night?'night':'day');
        rollResult.textContent+=night?'｜夜幕降臨':'｜天色轉亮';
      }
    };
    advance();
    // Skip stunned turns iteratively instead of recursively calling finishTurn (which could double-apply effects).
    let skipGuard=0;
    while(gameStarted&&players[currentPlayer]?.stunnedTurns>0&&skipGuard<players.length){
      players[currentPlayer].stunnedTurns--;
      rollResult.textContent+=`｜玩家 ${currentPlayer+1} 暫停一回合`;
      advance();skipGuard++;
    }
    finishingTurn=false;
    updateTurnUI();
    publishOnlineState();
    if(gameStarted){if(players[currentPlayer]?.controlType==='local')startTurnCountdown();if(players[currentPlayer]?.controlType==='npc'){
      clearCountdown();if(isNpcAuthority())window.setTimeout(()=>{if(!busy&&!pendingTurnAction&&!pauseActive&&!duelState&&players[currentPlayer]?.controlType==='npc')runRoll(players[currentPlayer]);},700);else autoRollCountdown.textContent='等待房主控制 NPC…';
    }}
  }
  function applyEndOfTurnEffects(p){if(!p)return;if(p.invisibilityTurns>0){p.invisibilityTurns--;positionAllTokens();}if(p.attackBonusTurns>0){p.attackBonusTurns--;if(p.attackBonusTurns===0)p.attackBonus=0;}if(p.regenActive&&p.hp<p.maxHP)p.hp=Math.min(p.maxHP,p.hp+1);if(p.hp>=p.maxHP)p.regenActive=false;if(p.poisonTurns>0){p.hp=Math.max(0,p.hp-2);p.poisonTurns--;}if(p.defenseDrainTurns>0){p.defense=Math.max(0,p.defense-2);p.defenseDrainTurns--; }renderSelfStatus();}
  function clearCountdown(){if(countdownTimer){clearInterval(countdownTimer);countdownTimer=null;}}
  function startTurnCountdown(){clearCountdown();countdownLeft=10;const p=players[currentPlayer];if(!gameStarted||!p||p.controlType==='npc'||pauseActive||duelState){autoRollCountdown.textContent=p?.controlType==='npc'?'NPC 自動擲骰中':'自動擲骰倒數暫停';return;}autoRollCountdown.textContent=`自動擲骰倒數：${countdownLeft} 秒`;countdownTimer=setInterval(()=>{if(pauseActive||busy||pendingTurnAction||duelState)return;countdownLeft--;autoRollCountdown.textContent=`自動擲骰倒數：${Math.max(0,countdownLeft)} 秒`;if(countdownLeft<=0){clearCountdown();rollResult.textContent='倒數結束，系統自動擲骰';runRoll(players[currentPlayer]);}},1000);}
  function pauseGame(){const p=players[currentPlayer];if(!gameStarted||!p||p.pauseUses>=3||busy||duelState||pauseActive)return;clearCountdown();p.pauseUses++;pauseActive=true;let left=60;pauseOverlay.classList.remove('is-hidden');pauseCountdown.textContent=`${left} 秒後自動恢復`;pauseButton.disabled=true;pauseButton.textContent=`暫停中（${left} 秒）`;pauseTimer=setTimeout(resumeGame,60000);pauseInterval=setInterval(()=>{left--;pauseCountdown.textContent=`${Math.max(0,left)} 秒後自動恢復`;pauseButton.textContent=`暫停中（${Math.max(0,left)} 秒）`;},1000);updateTurnUI();}
  function resumeGame(){if(!pauseActive)return;if(pauseTimer)clearTimeout(pauseTimer);if(pauseInterval)clearInterval(pauseInterval);pauseTimer=pauseInterval=null;pauseActive=false;pauseOverlay.classList.add('is-hidden');updateTurnUI();startTurnCountdown();}
  pauseOverlay.addEventListener('click',resumeGame);window.addEventListener('keydown',e=>{if(pauseActive){e.preventDefault();resumeGame();}});
  function openActionModal(title,name,desc,image,type){modalActionType=type;actionModalTitle.textContent=title;actionSkillName.textContent=name;actionSkillDescription.textContent=desc||'';acceptActionButton.textContent=type==='skill'?'收下技能':'確認';cancelActionButton.textContent=type==='skill'?'放棄技能':'關閉';if(actionSkillBatch){actionSkillBatch.innerHTML='';actionSkillBatch.classList.add('is-hidden');}if(image){actionSkillImage.src=image;actionSkillImage.hidden=false;actionSkillImage.classList.toggle('action-coin-image',type==='coin');}else{actionSkillImage.hidden=true;actionSkillImage.removeAttribute('src');actionSkillImage.classList.remove('action-coin-image');}replacementChoices.innerHTML='';replacementChoices.classList.add('is-hidden');actionModal.classList.remove('is-hidden');}
  function buildReplacementChoices(p,count){replacementChoices.innerHTML='';pendingSkillReplacements=[];const nonBase=p.skills.map((skill,index)=>({skill,index})).filter(x=>!x.skill.base);for(let i=0;i<count;i++){const label=document.createElement('label');label.className='replacement-choice';label.textContent=`替換第 ${i+1} 招（基本技能不可放棄）`;const select=document.createElement('select');select.dataset.replaceOrder=String(i);select.innerHTML='<option value="">選擇要放棄的技能</option>';nonBase.forEach(({skill,index})=>{const option=document.createElement('option');option.value=String(index);option.textContent=skill.name;select.appendChild(option);});select.addEventListener('change',()=>{const chosen=[...replacementChoices.querySelectorAll('select')].map(el=>el.value).filter(Boolean);[...replacementChoices.querySelectorAll('select')].forEach(el=>[...el.options].forEach(opt=>{if(opt.value)opt.disabled=chosen.includes(opt.value)&&opt.value!==el.value;}));});replacementChoices.appendChild(label);replacementChoices.appendChild(select);pendingSkillReplacements.push(select);}replacementChoices.classList.toggle('is-hidden',count===0);}
  function closeModal(){actionModal.classList.add('is-hidden');modalActionType=null;pendingSkill=null;pendingSkills=[];pendingSkillReplacements=[];replacementChoices.innerHTML='';replacementChoices.classList.add('is-hidden');if(actionSkillBatch){actionSkillBatch.innerHTML='';actionSkillBatch.classList.add('is-hidden');}if(coinEventGrid){coinEventGrid.innerHTML='';coinEventGrid.classList.add('is-hidden');}actionModal.querySelector('.action-modal-card')?.classList.remove('coin-batch-loss','coin-batch-gain');}
  async function drawSkill(p){
    if(!availableSkills.length){rollResult.textContent='12 種招式已全部抽完，只能抽取金幣。';return;}
    const requested=p.position===35?2:1;const gained=[];const pool=[...availableSkills];for(let i=0;i<Math.min(requested,pool.length);i++){const index=Math.floor(Math.random()*pool.length);gained.push({...pool.splice(index,1)[0]});}
    if(p.controlType==='npc'){
      gained.forEach(skill=>{if(p.skills.length<4)p.skills.push(skill);else{const alreadyGained=gained.slice(0,gained.indexOf(skill)).map(x=>x.name);const replaceable=p.skills.map((x,i)=>({x,i})).filter(v=>!v.x.base&&!alreadyGained.includes(v.x.name));if(replaceable.length){const old=replaceable[Math.floor(Math.random()*replaceable.length)];p.skills[old.i]=skill;availableSkills.push(old.x);}}availableSkills=availableSkills.filter(s=>s.name!==skill.name);});
      renderSelfStatus();rollResult.textContent=`NPC 獲得招式：${gained.map(s=>s.name).join('、')}`;return;
    }
    pendingSkills=gained;pendingSkill=gained[gained.length-1]||null;
    const replaceCount=Math.max(0,p.skills.length+gained.length-4);
    openActionModal(gained.length===2?'招式 ×2 獎勵':'隨機抽取招式',gained.length===2?'本次獲得 2 招技能':gained[0].name,gained.length===2?'以下兩招會一起加入技能欄，請確認獲得內容。':gained[0].desc,gained.length===2?null:gained[0]?.image,'skill');
    if(gained.length===2&&actionSkillBatch){actionSkillBatch.innerHTML='';gained.forEach(skill=>{const card=document.createElement('article');card.className='acquired-skill-card';const img=document.createElement('img');img.src=skill.image;img.alt=skill.name;const title=document.createElement('strong');title.textContent=skill.name;const desc=document.createElement('small');desc.textContent=skill.desc;card.append(img,title,desc);actionSkillBatch.appendChild(card);});actionSkillBatch.classList.remove('is-hidden');}
    if(replaceCount){buildReplacementChoices(p,replaceCount);actionSkillDescription.textContent+=`
技能欄已滿，請選擇 ${replaceCount} 招非基本技能替換；被替換的技能會回到招式池。`; }
  }
  function commitPendingSkills(){const p=players[currentPlayer];if(!p||!pendingSkills.length)return false;const selections=pendingSkillReplacements.map(el=>el.value);if(selections.some(v=>!v)||new Set(selections).size!==selections.length){rollResult.textContent='請選擇要替換的技能；基本技能不可放棄。';return false;}let replacementIndex=0;for(const skill of pendingSkills){if(p.skills.length<4)p.skills.push(skill);else{const idx=Number(pendingSkillReplacements[replacementIndex++].value);const old=p.skills[idx];if(!old||old.base){rollResult.textContent='基本技能不可替換，請重新選擇。';return false;}availableSkills.push(old);p.skills[idx]=skill;}}availableSkills=availableSkills.filter(s=>!pendingSkills.some(pending=>pending.name===s.name));renderPlayers();rollResult.textContent=`獲得招式：${pendingSkills.map(s=>s.name).join('、')}`;return true;}
  function weightedCoins(){const r=Math.random();return r<.8?10:r<.9?100:r<.95?500:1000;}
  async function collectCoin(p){
    const tileMultipliers=({3:2,13:2,26:5,27:2,30:3});
    const tileDraws=coinTiles.has(p.position)?(tileMultipliers[p.position]||1):0;
    const lapDraws=Math.max(0,p.lapRewards||0);
    let drawCount=tileDraws+lapDraws;
    if(drawCount<=0)drawCount=1; // Full skill slots can convert the skill action into one coin draw.
    const cards=Array.from({length:drawCount},()=>weightedCoins());let total=0;
    if(p.controlType==='npc'){
      total=cards.reduce((a,b)=>a+b,0);p.coins+=total;
    }else{
      total=cards.reduce((a,b)=>a+b,0);p.coins+=total;renderSelfStatus();playTone('confirm');
      await showCoinBatch('金幣大豐收',cards.map(amount=>({amount,kind:'gain'})),`一次翻開 ${cards.length} 筆獎勵，合計 +${total.toLocaleString('zh-TW')} 金幣！`);
    }
    // Passing the start tile banks one coin draw. Claim all banked draws together with any coin-tile reward.
    p.lapRewards=0;
    renderSelfStatus();rollResult.textContent=`獲得金幣 ×${total}${drawCount>1?`（${drawCount} 張）`:''}`;
  }
  async function completePendingActionWithCollision(p){if(!pendingTurnAction||completingPendingAction)return;completingPendingAction=true;if(actionTimeout){clearTimeout(actionTimeout);actionTimeout=null;}const endedByDuel=p?await resolveLandingCollision(p):false;pendingTurnAction=false;completingPendingAction=false;if(endedByDuel){finishTurn();return;}finishTurn();}
  async function acceptAction(){if(modalActionType==='coinReveal'){if(actionTimeout){clearTimeout(actionTimeout);actionTimeout=null;}closeModal();const resolve=coinRevealResolve;coinRevealResolve=null;if(resolve)resolve(true);return;}const wasSkill=modalActionType==='skill';if(wasSkill&&!commitPendingSkills())return;if(actionTimeout){clearTimeout(actionTimeout);actionTimeout=null;}closeModal();if(pendingTurnAction)await completePendingActionWithCollision(players[currentPlayer]);}
  async function cancelAction(){if(modalActionType==='coinReveal'){if(actionTimeout){clearTimeout(actionTimeout);actionTimeout=null;}closeModal();const resolve=coinRevealResolve;coinRevealResolve=null;if(resolve)resolve(false);return;}if(actionTimeout){clearTimeout(actionTimeout);actionTimeout=null;}if(modalActionType==='skill')rollResult.textContent='已放棄本次招式；招式仍保留在招式池中。';closeModal();if(pendingTurnAction)await completePendingActionWithCollision(players[currentPlayer]);}
  function autoCommitPendingSkills(){
    if(!pendingSkills.length)return true;
    const p=players[currentPlayer];if(!p)return false;
    if(pendingSkillReplacements.length){
      const used=new Set();
      for(const select of pendingSkillReplacements){
        const candidate=[...select.options].find(option=>option.value&&!used.has(option.value)&&!p.skills[Number(option.value)]?.base);
        if(!candidate)return false;select.value=candidate.value;used.add(candidate.value);
      }
    }
    return commitPendingSkills();
  }
  function scheduleActionAutoAdvance(timeoutMs=6000){if(actionTimeout)clearTimeout(actionTimeout);actionTimeout=setTimeout(()=>{
    actionTimeout=null;
    if(modalActionType==='coinReveal'&&coinRevealResolve){closeModal();const resolve=coinRevealResolve;coinRevealResolve=null;resolve(false);if(pendingTurnAction)completePendingActionWithCollision(players[currentPlayer]);return;}
    if(modalActionType==='skill'&&pendingSkills.length){const p=players[currentPlayer];let learnedCount=0;if(p){for(const skill of pendingSkills){if(p.skills.length<4){p.skills.push(skill);learnedCount++;}else break;}if(learnedCount){const learnedNames=pendingSkills.slice(0,learnedCount).map(x=>x.name);availableSkills=availableSkills.filter(x=>!learnedNames.includes(x.name));renderPlayers();rollResult.textContent+=`｜60 秒逾時，自動學習「${learnedNames.join('、')}」，其餘新招式放棄並留在招式池`; }else{rollResult.textContent+='｜60 秒逾時，技能欄已滿，本次抽到的新招式全部放棄並保留在招式池';}}}
    if(!actionModal.classList.contains('is-hidden'))closeModal();
    if(pendingTurnAction){rollResult.textContent+='｜獎勵操作逾時，自動進入下一位玩家';completePendingActionWithCollision(players[currentPlayer]);}
  },timeoutMs);}
  coinActionButton.addEventListener('click',async()=>{if(coinActionButton.disabled)return;const p=players[currentPlayer];if(!p)return;coinActionButton.disabled=true;scheduleActionAutoAdvance();await collectCoin(p);if(pendingTurnAction)await completePendingActionWithCollision(p);});
  skillActionButton.addEventListener('click',async()=>{if(skillActionButton.disabled)return;const p=players[currentPlayer];if(!p)return;skillActionButton.disabled=true;scheduleActionAutoAdvance(availableSkills.length?60000:6000);if(!availableSkills.length){await collectCoin(p);}else await drawSkill(p);if(pendingTurnAction&&actionModal.classList.contains('is-hidden'))await completePendingActionWithCollision(p);});
  acceptActionButton.addEventListener('click',acceptAction);cancelActionButton.addEventListener('click',cancelAction);closeActionModal.addEventListener('click',cancelAction);
  // Supabase-backed online lobby and shared game state.
  const supabaseClient = (window.supabase && window.FANTASY_SUPABASE_URL && window.FANTASY_SUPABASE_KEY)
    ? window.supabase.createClient(window.FANTASY_SUPABASE_URL, window.FANTASY_SUPABASE_KEY) : null;
  function getEntrySessionToken(){
    try{
      const token=sessionStorage.getItem('fantasyEntryToken')||'';
      const expires=Number(sessionStorage.getItem('fantasyEntryExpires')||0);
      if(token&&expires>Date.now()+5000)return token;
      sessionStorage.removeItem('fantasyEntryToken');sessionStorage.removeItem('fantasyEntryExpires');
    }catch(_){}
    return '';
  }
  async function rpcWithSession(name,args={}){
    if(!supabaseClient)throw new Error('Supabase 連線元件未載入，請重新整理。');
    const token=getEntrySessionToken();
    if(!token)throw new Error('遊戲入口驗證已逾期，請回開始頁重新輸入入口密碼。');
    const {data,error}=await supabaseClient.rpc(name,{...args,p_session_token:token});
    if(error)throw error;
    return data;
  }
  let lobbyClientId='';
  try { lobbyClientId=localStorage.getItem('fantasyLobbyClientId')||''; if(!lobbyClientId){lobbyClientId=(crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random().toString(16).slice(2));localStorage.setItem('fantasyLobbyClientId',lobbyClientId);} } catch(_) { lobbyClientId='browser-'+Math.random().toString(16).slice(2); }
  let lobbyRefreshTimer=null, memberHeartbeatTimer=null;
  async function fetchOnlineRooms(){return await rpcWithSession('fantasy_list_rooms');}
  async function refreshOnlineRooms(showError=false){
    if(!supabaseClient)return;
    if(!getEntrySessionToken()){if(showError)openEntryGate();return;}
    try{
      const data=await fetchOnlineRooms();
      for(const room of lobbyRooms){
        const row=(data||[]).find(x=>Number(x.room_no)===room.index);
        if(!row){Object.assign(room,{active:false,host:'',password:'',npcCount:0,slots:Array(4).fill(null),members:[],status:'尚未建立',roomId:null,gameStarted:false});continue;}
        const members=Array.isArray(row.members)?row.members:[];
        members.sort((a,b)=>(a.role==='host'?-1:0)-(b.role==='host'?-1:0)||String(a.joined_at||'').localeCompare(String(b.joined_at||'')));
        const npcCount=Math.max(0,Math.min(3,Number(row.npc_count)||0));
        const npcSlots=Array.from({length:npcCount},(_,n)=>({client_id:`npc-slot-${row.room_id}-${n+1}`,player_name:`NPC ${n+1}`,role:'npc',character_id:null,is_ready:true,is_npc:true}));
        Object.assign(room,{active:true,roomId:row.room_id,host:row.host_name,npcCount,status:row.game_started?'遊戲中':(row.status||'等待中'),gameStarted:!!row.game_started,members,slots:Array(4).fill(null)});
        [...members,...npcSlots].slice(0,4).forEach((m,i)=>room.slots[i]=m);
      }
      renderLobby();
    }catch(error){if(showError)roomCardMessage(error.message||'讀取房間失敗，請重新整理。');}
  }
  function startLobbyRefresh(){
    if(lobbyRefreshTimer)clearInterval(lobbyRefreshTimer);
    refreshOnlineRooms();
    lobbyRefreshTimer=setInterval(()=>{
      if(!lobbyScreen.classList.contains('is-hidden'))refreshOnlineRooms();
      if(!characterScreen.classList.contains('is-hidden'))refreshCharacterAvailability();
    },3000);
  }
  function startMemberHeartbeat(){
    if(memberHeartbeatTimer)clearInterval(memberHeartbeatTimer);
    const beat=async()=>{
      if(activeRoomIndex<0||!getEntrySessionToken()||!supabaseClient)return;
      try{await rpcWithSession('fantasy_heartbeat',{p_room_no:activeRoomIndex,p_client_id:lobbyClientId});}catch(e){console.warn('房間心跳更新失敗',e);}
    };
    beat();memberHeartbeatTimer=setInterval(beat,15000);
  }
  async function leaveActiveRoom(){
    if(activeRoomIndex>=0&&getEntrySessionToken()&&supabaseClient){try{await rpcWithSession('fantasy_leave_room',{p_room_no:activeRoomIndex,p_client_id:lobbyClientId});}catch(e){console.warn('離開房間清理失敗',e);}}
    if(onlineGameChannel){try{await supabaseClient.removeChannel(onlineGameChannel);}catch(_){}onlineGameChannel=null;}
    onlineGameRoomId=null;activeRoomIndex=-1;lobbyIsHost=false;lobbyNpcCount=0;onlineGameRoster=[];onlineCoinEventsQueue=[];
    if(memberHeartbeatTimer){clearInterval(memberHeartbeatTimer);memberHeartbeatTimer=null;}
    await refreshOnlineRooms();
  }
  async function refreshCharacterAvailability(){
    if(activeRoomIndex<0||!supabaseClient||!getEntrySessionToken()||characterScreen.classList.contains('is-hidden'))return;
    try{
      const data=await fetchOnlineRooms();
      const row=(data||[]).find(x=>Number(x.room_no)===activeRoomIndex);
      const reserved=(row&&Array.isArray(row.members)?row.members:[]).filter(m=>m.client_id!==lobbyClientId&&m.character_id).map(m=>m.character_id);
      characterButtons.forEach(button=>{
        const taken=reserved.includes(button.dataset.character);
        button.disabled=taken;
        button.classList.toggle('character-taken',taken);
        button.title=taken?'此角色已被其他玩家選擇，請選擇其他角色。':'';
        button.setAttribute('aria-disabled',String(taken));
      });
      if(reserved.includes(selectedCharacter)){const free=characterButtons.find(button=>!reserved.includes(button.dataset.character));if(free)free.click();}
      confirmButton.disabled=reserved.includes(selectedCharacter);
    }catch(e){console.warn('更新可選角色失敗',e);}
  }

  // Supabase-backed multiplayer lobby room state.
  const lobbyRoomCards=[...document.querySelectorAll('.lobby-room')];
  const lobbyModal=$('lobbyModal'),lobbyForm=$('lobbyForm'),lobbyModalTitle=$('lobbyModalTitle'),lobbyModalHint=$('lobbyModalHint'),lobbyHostName=$('lobbyHostName'),lobbyPassword=$('lobbyPassword'),lobbyNpcCountInput=$('lobbyNpcCount'),lobbyPasswordLabel=$('lobbyPasswordLabel'),lobbyNameLabel=$('lobbyNameLabel'),lobbyNpcLabel=$('lobbyNpcLabel'),lobbyFormError=$('lobbyFormError');
  const lobbyInfoModal=$('lobbyInfoModal');
  const lobbyRooms=Array.from({length:4},(_,i)=>({index:i,active:false,host:'',password:'',npcCount:0,slots:Array(4).fill(null),members:[],status:'尚未建立',roomId:null,gameStarted:false}));
  let lobbyModalMode='create',lobbyModalRoom=0,activeRoomIndex=-1,lobbyIsHost=false,lobbyNpcCount=0;

  // Live online game: Supabase Presence identifies each selected character; Broadcast keeps the board snapshot in sync.
  let onlineGameChannel=null, onlineGameRoomId=null, onlineGameRoster=[], applyingOnlineState=false, onlinePlayerName='冒險者';
  let onlineCoinEventsQueue=[], onlineCoinEventSeq=0, outgoingOnlineStateRevision=0, lastRemoteDuelResultId=null;
  const seenOnlineStateMessageIds=new Set();
  const seenOnlineCoinEvents=new Set();
  const queuedOnlineCoinNotices=[];
  let processingOnlineCoinNotices=false, duelFinishing=false, npcDuelActionKey='', onlineDuelResult=null;
  const ONLINE_PLAYER_FIELDS=['position','middleDirection','forcedOuterJunction','lapsCompleted','lapRewards','hasClaimedLap','hp','maxHP','baseHP','attack','defense','coins','lives','invisibilityTurns','attackBonus','attackBonusTurns','regenTurns','regenActive','poisonTurns','defenseDrainTurns','stunnedTurns','sealedTurns','immuneNext','dodgeDuel','pauseUses','skills','inventory','nextRoute','controlType','duelPoisoned','duelRegenActive','duelDefenseDrain'];
  function sortOnlineMembers(members){
    return [...members].sort((a,b)=>Number(!!b.isHost)-Number(!!a.isHost)
      || Number(a.joinedAt||0)-Number(b.joinedAt||0)
      || String(a.clientId).localeCompare(String(b.clientId)));
  }
  function getOnlineMembers(){
    if(!onlineGameChannel)return [];
    const state=onlineGameChannel.presenceState();const found=new Map();
    Object.values(state).flat().forEach(m=>{if(m&&m.clientId&&m.characterId)found.set(m.clientId,m);});
    return sortOnlineMembers([...found.values()]);
  }
  function isNpcAuthority(){return !onlineGameChannel||lobbyIsHost;}
  function ensureOnlineRoster(){
    if(!onlineGameChannel||!onlineGameRoomId||gameStarted)return;
    // Use the database member list for canonical membership so a player waiting on the character page
    // is not accidentally omitted. Presence is useful for live status, but should not define the roster.
    const room=lobbyRooms[activeRoomIndex];
    const mergedMembers=new Map((room?.members||[]).filter(m=>m.client_id).map(m=>[m.client_id,{
      clientId:m.client_id,playerName:m.player_name||'玩家',characterId:m.character_id||null,
      isHost:m.role==='host',joinedAt:Date.parse(m.joined_at)||0,isNpc:false
    }]));
    // Presence has the just-selected character immediately, while the periodic room-list refresh may lag by a few seconds.
    getOnlineMembers().forEach(m=>{const old=mergedMembers.get(m.clientId)||{};mergedMembers.set(m.clientId,{...old,...m,characterId:m.characterId||old.characterId||null,isHost:old.isHost??m.isHost,joinedAt:old.joinedAt||m.joinedAt||0,isNpc:false});});
    const dbMembers=[...mergedMembers.values()].filter(m=>m.clientId&&m.characterId)
      .sort((a,b)=>Number(!!b.isHost)-Number(!!a.isHost)||a.joinedAt-b.joinedAt||a.clientId.localeCompare(b.clientId));
    if(!dbMembers.length)return;
    const mine=dbMembers.find(m=>m.clientId===lobbyClientId);
    if(!mine)return;
    selectedCharacter=mine.characterId;
    // NPCs are deterministic and only assigned after reserving every real player's selected character.
    const used=new Set(dbMembers.map(m=>m.characterId));
    const npcCount=Math.max(0,Math.min(3,Number(room?.npcCount)||0));
    const npcCharacters=characterOrder.filter(id=>!used.has(id)).slice(0,npcCount);
    const npcs=npcCharacters.map((characterId,index)=>({
      clientId:`npc:${onlineGameRoomId}:${index+1}`,playerName:`NPC ${index+1}`,characterId,
      isHost:false,joinedAt:Number.MAX_SAFE_INTEGER-index,isNpc:true
    }));
    onlineGameRoster=[...dbMembers,...npcs];
    // Keep the device's own player in slot 0 for the existing status UI; turn progression uses onlineGameRoster's canonical order.
    const ordered=[mine,...dbMembers.filter(m=>m.clientId!==lobbyClientId),...npcs];
    const old=new Map(players.filter(p=>p.onlineClientId).map(p=>[p.onlineClientId,p]));
    const count=Math.max(1,Math.min(4,ordered.length));
    createPlayers(count);
    players=ordered.slice(0,4).map((m,i)=>{
      const p=old.get(m.clientId)||players[i];if(!p)return null;
      const characterChanged=p.character!==m.characterId;
      p.character=m.characterId;p.onlineClientId=m.clientId;p.label=m.playerName||`玩家 ${i+1}`;
      p.controlType=m.isNpc?'npc':(m.clientId===lobbyClientId?'local':'remote');
      const c=characters[p.character];
      if(!old.has(m.clientId)||characterChanged){p.position=0;p.middleDirection=0;p.forcedOuterJunction=false;p.nextRoute=null;p.lapsCompleted=0;p.hp=c.hp;p.maxHP=c.hp;p.baseHP=c.hp;p.attack=c.attack;p.defense=c.defense;p.coins=0;p.lives=3;p.inventory={potion:0,wind:0,invisibility:0};p.skills=[{name:c.baseSkill,base:true,image:c.baseImage,desc:'角色基本技能；效果依照角色基本攻擊規則。'}];p.lapRewards=0;p.hasClaimedLap=false;p.pauseUses=0;p.attackBonus=0;p.attackBonusTurns=0;p.regenTurns=0;p.regenActive=false;p.poisonTurns=0;p.defenseDrainTurns=0;p.stunnedTurns=0;p.sealedTurns=0;p.immuneNext=false;p.dodgeDuel=0;}
      return p;
    }).filter(Boolean);
    currentPlayer=0;renderPlayers();
    readyStatus.textContent=`真人 ${dbMembers.length} 位＋NPC ${npcs.length} 位｜共 ${players.length}/4 位角色已同步`;
    rollResult.textContent='角色與 NPC 已同步，等待房主開戰。';
    battleStartButton.classList.toggle('is-hidden',!lobbyIsHost);
  }
  function makeOnlineSnapshotPlayer(snapshotPlayer,index){
    const id=snapshotPlayer.clientId;
    const character=characters[snapshotPlayer.character]?snapshotPlayer.character:'odyssey';
    const c=characters[character];
    const isNpc=!!snapshotPlayer.isNpc||String(id).startsWith('npc:');
    return {
      character,position:0,token:null,label:snapshotPlayer.label||(isNpc?`NPC ${String(id).split(':').pop()}`:(id===lobbyClientId?onlinePlayerName:`玩家 ${index+1}`)),
      controlType:isNpc?'npc':(id===lobbyClientId?'local':'remote'),onlineClientId:id,lives:3,nextRoute:null,middleDirection:0,
      forcedOuterJunction:false,hp:c.hp,maxHP:c.hp,baseHP:c.hp,attack:c.attack,defense:c.defense,coins:0,
      inventory:{potion:0,wind:0,invisibility:0},invisibilityTurns:0,
      skills:[{name:c.baseSkill,base:true,image:c.baseImage,desc:'角色基本技能；效果依照角色基本攻擊規則。'}],
      lapRewards:0,hasClaimedLap:false,lapsCompleted:0,pauseUses:0,attackBonus:0,attackBonusTurns:0,
      regenTurns:0,regenActive:false,poisonTurns:0,defenseDrainTurns:0,stunnedTurns:0,sealedTurns:0,
      immuneNext:false,dodgeDuel:0,duelPoisoned:false,duelRegenActive:false,duelDefenseDrain:false
    };
  }
  function reconcilePlayersFromSnapshot(snapshot){
    const incoming=(snapshot.players||[]).filter(p=>p&&p.clientId&&characters[p.character]);
    if(!incoming.length)return;
    const incomingById=new Map(incoming.map(p=>[p.clientId,p]));
    const oldById=new Map(players.filter(p=>p.onlineClientId).map(p=>[p.onlineClientId,p]));
    // Keep the current device's player at index 0 for the existing private status panel,
    // but reconstruct missing remote/NPC entries from every authoritative snapshot.
    const ids=[];
    if(incomingById.has(lobbyClientId))ids.push(lobbyClientId);
    incoming.forEach(p=>{if(!ids.includes(p.clientId))ids.push(p.clientId);});
    // Preserve any existing participant if a reconnect snapshot was produced by an older client.
    oldById.forEach((_,id)=>{if(!ids.includes(id))ids.push(id);});
    const reconciled=ids.map((id,index)=>{
      const q=incomingById.get(id);const old=oldById.get(id);
      if(!q&&old)return old;
      if(old&&q&&old.character===q.character){
        old.controlType=(q.isNpc||String(id).startsWith('npc:'))?'npc':(id===lobbyClientId?'local':'remote');
        if(q.label)old.label=q.label;
        return old;
      }
      const source=q||{clientId:id,character:old?.character||'odyssey',label:old?.label,isNpc:old?.controlType==='npc'};
      return makeOnlineSnapshotPlayer(source,index);
    });
    if(reconciled.length)players=reconciled.slice(0,4);
  }
  function serialiseOnlineDuel(){
    if(!duelState)return null;
    return {
      leftId:duelState.left?.onlineClientId||null,rightId:duelState.right?.onlineClientId||null,
      activeId:duelState.active?.onlineClientId||null,attackerId:duelState.attacker?.onlineClientId||null,
      defenderId:duelState.defender?.onlineClientId||null,phase:duelState.phase||'roll',
      actionCount:Number(duelState.actionCount)||0,leftDie:duelLeftDie?.textContent||'?',
      rightDie:duelRightDie?.textContent||'?',status:duelStatus?.textContent||'對決進行中',
      opponentIds:(duelState.opponents||[]).map(p=>p?.onlineClientId).filter(Boolean)
    };
  }
  function serialiseOnlineState(){
    return {roomId:onlineGameRoomId,sender:lobbyClientId,stateMessageId:`${lobbyClientId}-${Date.now()}-${++outgoingOnlineStateRevision}`,cubeTransform:cube?.style?.transform||'',pendingTurnAction,
      players:players.map(p=>{const out={clientId:p.onlineClientId,character:p.character,label:p.label,isNpc:p.controlType==='npc'};ONLINE_PLAYER_FIELDS.forEach(k=>{if(k==='controlType')return;if(p[k]!==undefined)out[k]=p[k];});return out;}),
      currentPlayerId:players[currentPlayer]?.onlineClientId||null,round,night,gameStarted,gameOver,
      rollText:rollResult?.textContent||'',duel:serialiseOnlineDuel(),duelResult:onlineDuelResult,
      coinEvents:[...onlineCoinEventsQueue]};
  }
  async function publishOnlineState(){
    if(!onlineGameChannel||!onlineGameRoomId||applyingOnlineState)return;
    const snapshot=serialiseOnlineState();
    try{
      // Broadcast first. Do not make the opponent wait for a database RPC before the duel UI opens.
      await onlineGameChannel.send({type:'broadcast',event:'game-state',payload:snapshot});
      if(snapshot.duel||snapshot.duelResult){
        await onlineGameChannel.send({type:'broadcast',event:'duel-state',payload:snapshot});
      }
      const sentIds=new Set((snapshot.coinEvents||[]).map(e=>e.id));
      if(gameStarted){
        const {error}=await supabaseClient.rpc('fantasy_save_game_state',{p_room_no:activeRoomIndex,p_client_id:lobbyClientId,p_session_token:getEntrySessionToken(),p_state:snapshot});
        if(error)console.warn('保存線上遊戲狀態失敗（即時同步已先送出）',error);
      }
      if(sentIds.size)onlineCoinEventsQueue=onlineCoinEventsQueue.filter(e=>!sentIds.has(e.id));
    }catch(e){console.warn('線上狀態同步失敗',e);}
  }
  function applyOnlineDuelSnapshot(data,result){
    if(!data){
      if(duelState||!duelModal.classList.contains('is-hidden')){
        duelModal.classList.add('is-hidden');duelSkillPicker.classList.add('is-hidden');
        duelEscapeLeft.classList.add('is-hidden');duelEscapeRight.classList.add('is-hidden');
        stopBattleMusic();if(gameStarted)startGameMusic();
        if(duelResolve&&result&&result.id&&result.id!==lastRemoteDuelResultId){
          const winner=players.find(p=>p.onlineClientId===result.winnerId)||null;
          const loser=players.find(p=>p.onlineClientId===result.loserId)||null;
          const resolve=duelResolve;duelResolve=null;resolve({winner,loser,bothDead:!!result.bothDead,remoteResolved:true});
        }
        duelState=null;duelFinishing=false;npcDuelActionKey='';updateTurnUI();
      }
      if(result&&result.id&&result.id!==lastRemoteDuelResultId){lastRemoteDuelResultId=result.id;}
      return;
    }
    const byId=id=>players.find(p=>p.onlineClientId===id)||null;
    const left=byId(data.leftId),right=byId(data.rightId),active=byId(data.activeId),attacker=byId(data.attackerId),defender=byId(data.defenderId);
    if(!left||!right||!active){
      // Keep both clients in the duel layer while any missing roster entry is being reconciled.
      duelModal.classList.remove('is-hidden');duelStatus.textContent='正在同步雙方玩家資料…';
      console.warn('收到對決狀態，但缺少玩家資料', {leftId:data.leftId,rightId:data.rightId,activeId:data.activeId,players:players.map(p=>p.onlineClientId)});
      return;
    }
    const preserveLocalPromise=!!duelResolve&&!!duelState&&!duelState.remoteSync;
    const priorWasHidden=duelModal.classList.contains('is-hidden');
    const next={left,right,active,attacker,defender,opponents:[right,left].filter(Boolean),phase:data.phase||'roll',actionCount:Number(data.actionCount)||0,remoteSync:!preserveLocalPromise};
    if(preserveLocalPromise){Object.assign(duelState,next,{remoteSync:false});}
    else duelState=next;
    duelTargetPicker.classList.add('is-hidden');
    duelLeftDie.textContent=data.leftDie||'?';duelRightDie.textContent=data.rightDie||'?';duelStatus.textContent=data.status||'對決同步中…';
    duelModal.classList.remove('is-hidden');
    if(priorWasHidden)startBattleMusic();
    duelRollButton.classList.toggle('is-hidden',duelState.phase!=='roll');
    duelRollButton.disabled=!(active.controlType==='local'||(active.controlType==='npc'&&isNpcAuthority()));
    duelSkillPicker.classList.toggle('is-hidden',duelState.phase!=='action');
    duelContinueButton.classList.add('is-hidden');
    duelEscapeLeft.classList.add('is-hidden');duelEscapeRight.classList.add('is-hidden');
    if(duelState.actionCount>=6&&duelState.actionCount%2===0&&duelState.phase==='action'){
      if(left===players[0]&&hasDuelEscapeResource(left)){duelEscapeLeft.textContent='自身玩家逃跑';duelEscapeLeft.classList.remove('is-hidden');}
      if(right===players[0]&&hasDuelEscapeResource(right)){duelEscapeRight.textContent='自身玩家逃跑';duelEscapeRight.classList.remove('is-hidden');}
    }
    if(attacker&&duelState.phase==='action'){
      duelSkillSelect.innerHTML='';duelState.actionSkills=usableDuelSkills(attacker);
      duelState.actionSkills.forEach((skill,i)=>{const option=document.createElement('option');option.value=String(i);option.textContent=`${skill.name}｜${skill.desc||'基本攻擊'}`;duelSkillSelect.appendChild(option);});
      syncDuelSkillDescription();duelUseSkill.disabled=!(attacker.controlType==='local'||(attacker.controlType==='npc'&&isNpcAuthority()));
      if(attacker.controlType==='npc'&&isNpcAuthority()){
        const key=`${attacker.onlineClientId}:${duelState.actionCount}:${duelState.phase}`;
        if(npcDuelActionKey!==key){npcDuelActionKey=key;setTimeout(()=>{if(duelState&&duelState.attacker===attacker&&duelState.phase==='action'){const choices=usableDuelSkills(attacker);performDuelSkill(choices[Math.floor(Math.random()*choices.length)]);}},650);}
      }
    }else duelUseSkill.disabled=true;
    renderDuel();updateTurnUI();
  }
  async function drainOnlineCoinNotices(){
    if(processingOnlineCoinNotices)return;processingOnlineCoinNotices=true;
    try{
      while(queuedOnlineCoinNotices.length){
        while(!actionModal.classList.contains('is-hidden'))await wait(200);
        const notification=queuedOnlineCoinNotices.shift();
        const wasBusy=busy;busy=true;updateTurnUI();
        await showCoinBatch(notification.title,notification.items,notification.description);
        closeModal();busy=wasBusy;updateTurnUI();
      }
    }finally{processingOnlineCoinNotices=false;}
  }
  function processOnlineCoinEvents(events){
    if(!Array.isArray(events)||!events.length)return;
    const relevant=[];
    for(const event of events){
      if(!event||!event.id||seenOnlineCoinEvents.has(event.id))continue;
      if(event.fromId!==lobbyClientId&&event.toId!==lobbyClientId)continue;
      seenOnlineCoinEvents.add(event.id);relevant.push(event);
    }
    if(!relevant.length)return;
    const items=relevant.map(event=>({amount:event.amount,kind:event.toId===lobbyClientId?'gain':'loss'}));
    const losses=items.filter(x=>x.kind==='loss').length,gains=items.length-losses;
    const title=losses&&!gains?(relevant.some(e=>/NPC|奪取|對決/.test(e.reason||''))?'金幣被奪取':'金幣損失'):gains&&!losses?'金幣獲得':'金幣結算';
    const detail=relevant.map(event=>{
      const amount=Number(event.amount).toLocaleString('zh-TW');
      if(event.toId===lobbyClientId)return `獲得 ${amount} 金幣${event.fromName?`（來源：${event.fromName}）`:''}`;
      if(/NPC/.test(event.reason||''))return `你被 NPC 奪取 ${amount} 金幣`;
      if(/對決/.test(event.reason||''))return `你在對決中被對手奪取 ${amount} 金幣`;
      return `你被其他玩家奪取 ${amount} 金幣`;
    }).join('；');
    queuedOnlineCoinNotices.push({title,items,description:detail});void drainOnlineCoinNotices();
  }
  function applyOnlineState(payload,force=false){
    if(!payload||payload.roomId!==onlineGameRoomId||(!force&&payload.sender===lobbyClientId)||!Array.isArray(payload.players))return;
    const messageId=String(payload.stateMessageId||'');
    if(!force&&messageId&&seenOnlineStateMessageIds.has(messageId))return;
    if(messageId){seenOnlineStateMessageIds.add(messageId);if(seenOnlineStateMessageIds.size>1000){const first=seenOnlineStateMessageIds.values().next().value;seenOnlineStateMessageIds.delete(first);}}
    reconcilePlayersFromSnapshot(payload);
    applyingOnlineState=true;
    try{
      const incoming=new Map(payload.players.filter(p=>p.clientId).map(p=>[p.clientId,p]));
      players.forEach(p=>{const q=incoming.get(p.onlineClientId);if(!q)return;Object.keys(q).forEach(k=>{if(k==='clientId'||k==='character'||k==='label'||k==='isNpc')return;if(ONLINE_PLAYER_FIELDS.includes(k))p[k]=q[k];});p.character=q.character;p.label=q.label||p.label;p.controlType=(q.isNpc||String(q.clientId).startsWith('npc:'))?'npc':(q.clientId===lobbyClientId?'local':'remote');});
      const active=players.findIndex(p=>p.onlineClientId===payload.currentPlayerId);if(active>=0)currentPlayer=active;
      round=Number(payload.round)||1;night=!!payload.night;gameStarted=!!payload.gameStarted;gameOver=!!payload.gameOver;pendingTurnAction=!!payload.pendingTurnAction;if(payload.cubeTransform&&cube)cube.style.transform=payload.cubeTransform;
      window.setMapTime(night?'night':'day');if(payload.rollText&&rollResult)rollResult.textContent=payload.rollText;
      onlineDuelResult=payload.duelResult||onlineDuelResult;
      applyOnlineDuelSnapshot(payload.duel||null,payload.duelResult||null);
      processOnlineCoinEvents(payload.coinEvents);
      if(gameStarted){battleStartButton.classList.add('is-hidden');readyStatus.textContent='戰鬥進行中｜已同步線上狀態';}
      renderPlayers();updateTurnUI();
      if(gameStarted&&players[currentPlayer]?.controlType==='local'&&!duelState)startTurnCountdown();else clearCountdown();
    }finally{applyingOnlineState=false;}
    if(payload.duel&&lobbyIsHost){const d=payload.duel;const l=players.find(p=>p.onlineClientId===d.leftId),r=players.find(p=>p.onlineClientId===d.rightId);if((l&&l.hp<=0)||(r&&r.hp<=0)){setTimeout(()=>{if(duelState&&!duelFinishing)finishDuel();},0);}}
  }
  async function connectOnlineGame(){
    if(!supabaseClient||!lobbyRooms[activeRoomIndex]?.roomId){roomCardMessage('找不到線上房間資訊，請回大廳重新進入房間。');return false;}
    if(onlineGameChannel){try{await supabaseClient.removeChannel(onlineGameChannel);}catch(_){}onlineGameChannel=null;}
    onlineGameRoomId=lobbyRooms[activeRoomIndex].roomId;onlinePlayerName=lobbyIsHost?lobbyRooms[activeRoomIndex].host:onlinePlayerName;
    onlineGameChannel=supabaseClient.channel(`fantasy-game-${onlineGameRoomId}`,{config:{presence:{key:lobbyClientId},broadcast:{self:false}}});
    onlineGameChannel.on('presence',{event:'sync'},()=>ensureOnlineRoster());
    onlineGameChannel.on('broadcast',{event:'game-state'},({payload})=>applyOnlineState(payload));
    // A dedicated priority lane prevents duel snapshots from being hidden behind slower state persistence.
    onlineGameChannel.on('broadcast',{event:'duel-state'},({payload})=>{if(payload?.roomId===onlineGameRoomId)applyOnlineState(payload);});
    onlineGameChannel.on('broadcast',{event:'game-start'},({payload})=>{if(payload?.roomId===onlineGameRoomId){applyOnlineState(payload.state);}});
    await new Promise((resolve,reject)=>{let settled=false;const timer=setTimeout(()=>{if(!settled){settled=true;reject(new Error('即時房間連線逾時，請重新整理再試。'));}},12000);onlineGameChannel.subscribe(async status=>{
      if(status==='SUBSCRIBED'&&!settled){settled=true;clearTimeout(timer);try{await onlineGameChannel.track({clientId:lobbyClientId,playerName:onlinePlayerName,characterId:selectedCharacter,isHost:lobbyIsHost,joinedAt:Date.now()});resolve();}catch(e){reject(e);}}
      else if((status==='CHANNEL_ERROR'||status==='TIMED_OUT'||status==='CLOSED')&&!settled){settled=true;clearTimeout(timer);reject(new Error('Supabase 即時頻道連線失敗。'));}
    });});
    ensureOnlineRoster();
    try{const saved=await rpcWithSession('fantasy_load_game_state',{p_room_no:activeRoomIndex,p_client_id:lobbyClientId});if(saved?.game_state?.gameStarted)applyOnlineState(saved.game_state,true);}catch(e){console.warn('載入既有遊戲狀態失敗',e);}
    return true;
  }
  function roomCardMessage(message){$('lobbyInfoTitle').textContent='房間提示';$('lobbyInfoText').textContent=message;lobbyInfoModal.classList.remove('is-hidden');}
  function renderLobby(){
    lobbyRoomCards.forEach((card,i)=>{
      const room=lobbyRooms[i],status=card.querySelector('.room-status'),host=card.querySelector('.room-host'),count=card.querySelector('.room-count'),slotsEl=card.querySelector('.room-slots');
      status.textContent=room.active?(room.status||'等待中'):'尚未建立';status.classList.toggle('active',room.active);host.textContent=`房主：${room.active?room.host:'尚未設定'}`;
      count.textContent=`${room.active?room.slots.filter(Boolean).length:0} / 4`;slotsEl.innerHTML='';
      for(let j=0;j<4;j++){
        const member=room.active?room.slots[j]:null;const slot=document.createElement('button');slot.type='button';slot.className='room-slot'+(!member?' empty':'');slot.setAttribute('aria-label',`房間 ${i+1} 位置 ${j+1}`);
        if(member){
          if(member.character_id&&characters[member.character_id]){const img=document.createElement('img');img.src=characters[member.character_id].gif;img.alt='';slot.appendChild(img);}
          else{const waiting=document.createElement('span');waiting.className='slot-symbol';waiting.textContent=member.is_npc?'🤖':'…';slot.appendChild(waiting);}
          const label=document.createElement('strong');label.textContent=member.is_npc?'NPC':(member.player_name||'玩家');slot.appendChild(label);
          const small=document.createElement('small');small.textContent=member.is_npc?'電腦玩家':(member.role==='host'?'房主':(member.is_ready?'已選角色':'尚未選角'));slot.appendChild(small);
        }
        else{const symbol=document.createElement('span');symbol.className='slot-symbol';symbol.textContent='＋';slot.appendChild(symbol);const label=document.createElement('strong');label.textContent=room.gameStarted?'遊戲進行中':'等待加入';slot.appendChild(label);const small=document.createElement('small');small.textContent=room.active?'點擊輸入密碼':'空位';slot.appendChild(small);if(room.gameStarted)slot.disabled=true;}
        slot.addEventListener('click',()=>{
          if(!room.active){roomCardMessage('此房間尚未建立，請點擊「建立房間」先建立房間並設定密碼。');return;}
          if(member){
            if(member.is_npc&&activeRoomIndex===i&&lobbyIsHost&&!room.gameStarted){void changeOnlineNpcCount(i,Math.max(0,room.npcCount-1));return;}
            roomCardMessage(member.is_npc?`位置 ${j+1} 是 NPC 電腦玩家。房主可點擊此位置將 NPC 改回真人等待加入。`:`${member.player_name||'玩家'}${member.character_id?'｜已選擇角色':'｜尚未選擇角色'}。如要加入，請選擇空位或點擊「輸入密碼加入」。`);return;
          }
          if(room.gameStarted){roomCardMessage('遊戲已開戰，不能中途加入。');return;}
          if(activeRoomIndex===i&&lobbyIsHost){if(room.slots.filter(Boolean).length>=4){roomCardMessage('房間已滿，請先將一個 NPC 位置改回真人等待加入。');return;}void changeOnlineNpcCount(i,Math.min(3,room.npcCount+1));return;}
          openLobbyForm('join',i);
        });
        slotsEl.appendChild(slot);
      }
      card.querySelector('.room-create').classList.toggle('is-hidden',room.active);
      card.querySelector('.room-enter').disabled=!room.active||room.gameStarted||room.slots.filter(Boolean).length>=4;
      card.querySelector('.room-enter').textContent='輸入密碼加入';
      card.querySelector('.room-settings').classList.add('is-hidden');
      const canHost=room.active&&activeRoomIndex===i&&lobbyIsHost&&!room.gameStarted;
      card.querySelector('.room-start').classList.toggle('is-hidden',!canHost);card.querySelector('.room-start').textContent='選擇角色';card.querySelector('.room-start').disabled=!canHost;
    });
  }
  async function changeOnlineNpcCount(index,nextCount){
    if(!lobbyIsHost||activeRoomIndex!==index){roomCardMessage('只有這間房間的房主可以調整 NPC。');return;}
    const room=lobbyRooms[index];
    if(!room?.active||room.gameStarted){roomCardMessage('房間已開戰或尚未建立，不能調整 NPC。');return;}
    try{
      const result=await rpcWithSession('fantasy_set_npc_count',{p_room_no:index,p_client_id:lobbyClientId,p_npc_count:nextCount});
      room.npcCount=Number(result?.npc_count??nextCount);
      await refreshOnlineRooms();
    }catch(error){roomCardMessage(error?.message||'調整 NPC 失敗，請確認房間尚未開戰。');}
  }
  function openLobbyForm(mode,index){
    lobbyModalMode=mode;lobbyModalRoom=index;lobbyFormError.textContent='';lobbyPassword.value='';const room=lobbyRooms[index];lobbyModal.classList.remove('is-hidden');
    if(mode==='create'){
      lobbyModalTitle.textContent=`建立房間 ${index+1}`;lobbyModalHint.textContent='你是房主，可設定房間密碼與 NPC 數量。空位會保留給真人玩家或 NPC。';
      lobbyNameLabel.classList.remove('is-hidden');lobbyNameLabel.childNodes[0].textContent='房主名稱';lobbyHostName.value='冒險者';
      lobbyPasswordLabel.classList.remove('is-hidden');lobbyPassword.type='password';lobbyPassword.placeholder='請設定房間密碼';
      lobbyNpcLabel.classList.remove('is-hidden');lobbyNpcCountInput.value='0';$('lobbySubmit').textContent='建立房間';
    }else if(mode==='settings'){
      roomCardMessage('房間建立後目前不能更改密碼；如要重設，請離開房間後重新建立。');lobbyModal.classList.add('is-hidden');return;
    }else{
      lobbyModalTitle.textContent=`加入房間 ${index+1}`;lobbyModalHint.textContent='輸入房間密碼及你的玩家名稱。每位玩家必須選擇不同角色。';
      lobbyNameLabel.classList.remove('is-hidden');lobbyNameLabel.childNodes[0].textContent='玩家名稱';lobbyHostName.value='冒險者';
      lobbyPasswordLabel.classList.remove('is-hidden');lobbyPassword.type='password';lobbyPassword.placeholder='輸入房間密碼';
      lobbyNpcLabel.classList.add('is-hidden');$('lobbySubmit').textContent='驗證並加入';
    }
    lobbyPassword.focus();
  }
  function closeLobbyForm(){lobbyModal.classList.add('is-hidden');lobbyFormError.textContent='';}
  lobbyRoomCards.forEach((card,index)=>{
    card.querySelector('.room-create').addEventListener('click',()=>openLobbyForm('create',index));
    card.querySelector('.room-enter').addEventListener('click',()=>{if(!lobbyRooms[index].active){roomCardMessage('這間房間尚未建立。請先由房主建立房間並設定密碼。');return;}if(lobbyRooms[index].gameStarted){roomCardMessage('遊戲已開戰，不能中途加入。');return;}openLobbyForm('join',index);});
    card.querySelector('.room-settings').addEventListener('click',()=>openLobbyForm('settings',index));
    card.querySelector('.room-start').addEventListener('click',()=>{if(activeRoomIndex!==index||!lobbyIsHost)return;playTone('confirm');lobbyNpcCount=Number(lobbyRooms[index].npcCount)||0;show(characterScreen);refreshCharacterAvailability();});
  });
  lobbyForm.addEventListener('submit',async event=>{
    event.preventDefault();const room=lobbyRooms[lobbyModalRoom],submit=$('lobbySubmit');submit.disabled=true;lobbyFormError.textContent='';
    try{
      if(!supabaseClient)throw new Error('連線元件未載入，請重新整理網頁。');
      if(!getEntrySessionToken())throw new Error('遊戲入口驗證已逾期，請返回開始頁重新輸入密碼。');
      if(lobbyModalMode==='create'){
        const pass=lobbyPassword.value.trim();if(!pass)throw new Error('請設定房間密碼。');
        const host=lobbyHostName.value.trim()||'冒險者';
        const npcCount=Math.max(0,Math.min(3,Number(lobbyNpcCountInput.value)||0));
        const data=await rpcWithSession('fantasy_create_room',{p_room_no:lobbyModalRoom,p_host_name:host,p_password:pass,p_npc_count:npcCount,p_client_id:lobbyClientId});
        Object.assign(room,{active:true,host,npcCount,status:'等待中',roomId:data?.room_id,members:[],slots:Array(4).fill(null),gameStarted:false});
        activeRoomIndex=lobbyModalRoom;lobbyIsHost=true;lobbyNpcCount=npcCount;onlinePlayerName=host;closeLobbyForm();startMemberHeartbeat();await refreshOnlineRooms();
      }else if(lobbyModalMode==='join'){
        const name=lobbyHostName.value.trim();if(!name)throw new Error('請輸入玩家名稱。');
        const data=await rpcWithSession('fantasy_join_room',{p_room_no:lobbyModalRoom,p_password:lobbyPassword.value,p_player_name:name,p_client_id:lobbyClientId});
        Object.assign(room,{active:true,host:data.host_name,npcCount:0,status:data.status||'等待中',roomId:data.room_id,gameStarted:!!data.game_started});
        activeRoomIndex=lobbyModalRoom;lobbyIsHost=false;lobbyNpcCount=0;onlinePlayerName=name;closeLobbyForm();startMemberHeartbeat();await refreshOnlineRooms();playTone('confirm');show(characterScreen);await refreshCharacterAvailability();
      }
    }catch(err){lobbyFormError.textContent=err?.message||'連線失敗，請稍後再試。';}
    finally{submit.disabled=false;}
  });
  $('lobbyModalClose').addEventListener('click',closeLobbyForm);$('lobbyCancel').addEventListener('click',closeLobbyForm);
  $('lobbyBackButton').addEventListener('click',async()=>{playTone('click');await leaveActiveRoom();show(startScreen);});
  $('lobbyHelpButton').addEventListener('click',()=>{$('lobbyInfoTitle').textContent='遊戲說明';$('lobbyInfoText').textContent='每間房間最多 4 位真人玩家。房主建立房間並設定密碼，其他玩家輸入密碼加入。每位玩家須選擇不同角色，所有人選好角色並進入棋盤後，由房主按「開戰」。';lobbyInfoModal.classList.remove('is-hidden');});
  $('lobbyInfoClose').addEventListener('click',()=>lobbyInfoModal.classList.add('is-hidden'));$('lobbyInfoOk').addEventListener('click',()=>lobbyInfoModal.classList.add('is-hidden'));
  lobbyInfoModal.addEventListener('click',e=>{if(e.target===lobbyInfoModal)lobbyInfoModal.classList.add('is-hidden');});lobbyModal.addEventListener('click',e=>{if(e.target===lobbyModal)closeLobbyForm();});
  function openEntryGate(){entryGateError.textContent='';entryGatePassword.value='';entryGateModal.classList.remove('is-hidden');entryGatePassword.focus();}
  function closeEntryGate(){entryGateModal.classList.add('is-hidden');entryGateError.textContent='';}
  function enterLobbyAfterLogin(){closeEntryGate();playTone('click');startGameMusic();show(lobbyScreen);renderLobby();startLobbyRefresh();refreshOnlineRooms(true);}
  startButton.addEventListener('click',()=>{playTone('click');if(getEntrySessionToken()){enterLobbyAfterLogin();return;}openEntryGate();});
  entryGateForm.addEventListener('submit',async event=>{
    event.preventDefault();entryGateError.textContent='';const submit=entryGateForm.querySelector('button[type="submit"]');submit.disabled=true;
    try{
      if(!supabaseClient)throw new Error('Supabase 連線元件未載入，請重新整理頁面。');
      const {data,error}=await supabaseClient.functions.invoke('game-login',{body:{password:entryGatePassword.value}});
      if(error||!data?.token||!data?.expiresAt)throw new Error('入口密碼錯誤，或登入函式尚未完成部署。');
      sessionStorage.setItem('fantasyEntryToken',data.token);sessionStorage.setItem('fantasyEntryExpires',String(Date.parse(data.expiresAt)));
      enterLobbyAfterLogin();
    }catch(error){entryGateError.textContent=error?.message||'登入失敗，請稍後再試。';}
    finally{submit.disabled=false;}
  });
  $('entryGateClose').addEventListener('click',closeEntryGate);$('entryGateCancel').addEventListener('click',closeEntryGate);entryGateModal.addEventListener('click',e=>{if(e.target===entryGateModal)closeEntryGate();});
  characterButtons.forEach(b=>b.addEventListener('click',()=>{selectedCharacter=b.dataset.character;const c=characters[selectedCharacter];if(characterArtwork){const nextSrc=new URL(c.selectionVideo,document.baseURI).href;if(characterArtwork.src!==nextSrc){characterArtwork.pause();characterArtwork.src=c.selectionVideo;characterArtwork.load();}characterArtwork.setAttribute('aria-label',c.alt);const playPromise=characterArtwork.play();if(playPromise&&typeof playPromise.catch==='function')playPromise.catch(()=>{});}if(characterFxLayer)characterFxLayer.className=`character-fx-layer fx-${selectedCharacter}`;characterButtons.forEach(button=>button.setAttribute('aria-pressed',String(button===b)));renderCharacterStats();playTone('click');}));
  renderCharacterStats();
  confirmButton.addEventListener('click',async()=>{
    playTone('confirm');
    if(activeRoomIndex<0||!getEntrySessionToken()){roomCardMessage('請先登入並加入或建立一間線上房間。');return;}
    confirmButton.disabled=true;
    try{
      const chosen=await rpcWithSession('fantasy_choose_character',{p_room_no:activeRoomIndex,p_client_id:lobbyClientId,p_character_id:selectedCharacter});
      if(chosen?.character_id)selectedCharacter=chosen.character_id;
      try{sessionStorage.setItem('fantasySelectedCharacter',selectedCharacter);}catch(_){}
      show(mapScreen);playerCount.value='1';createPlayers(1);battleStartButton.classList.toggle('is-hidden',!lobbyIsHost);
      const ok=await connectOnlineGame();
      if(ok){await publishOnlineState();rollResult.textContent='角色已登記。等待房主確認所有玩家後按「開戰」。';}
    }catch(err){
      console.error(err);show(characterScreen);alert(err?.message||'選擇角色失敗。若此角色已被其他玩家選取，請選擇其他角色。');await refreshCharacterAvailability();
    }finally{confirmButton.disabled=false;}
  });
  battleStartButton.addEventListener('click',async()=>{
    if(gameStarted||gameOver)return;
    if(!lobbyIsHost||activeRoomIndex<0){rollResult.textContent='只有房主可以開戰。';return;}
    battleStartButton.disabled=true;
    try{
      const started=await rpcWithSession('fantasy_start_game',{p_room_no:activeRoomIndex,p_client_id:lobbyClientId});
      if(!started?.game_started)throw new Error('伺服器尚未確認開戰，請確認至少兩位玩家都已選好不同角色。');
      gameStarted=true;gameOver=false;startGameMusic();battleStartButton.classList.add('is-hidden');readyStatus.textContent='戰鬥開始！';playTone('confirm');rollResult.textContent='10 秒內未擲骰將自動擲出';updateTurnUI();await publishOnlineState();
      if(onlineGameChannel)await onlineGameChannel.send({type:'broadcast',event:'game-start',payload:{roomId:onlineGameRoomId,state:serialiseOnlineState()}});
      if(players[currentPlayer]?.controlType==='local')startTurnCountdown();
    }catch(err){rollResult.textContent=err?.message||'無法開戰，請確認所有真人玩家已選好不同角色並進入地圖。';}
    finally{battleStartButton.disabled=false;}
  });
  $('gameOverReturnButton').addEventListener('click',async()=>{gameOverModal.classList.add('is-hidden');await leaveActiveRoom();show(startScreen);});
  playerCount.addEventListener('change',()=>{if(!gameStarted&&!busy&&!pendingTurnAction&&!pauseActive)createPlayers(Number(playerCount.value)||2);});rollButton.addEventListener('click',rollDice);dieStage.addEventListener('click',rollDice);dieStage.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();rollDice();}});pauseButton.addEventListener('click',pauseGame);
  window.setMapTime=function(time){night=time==='night';const boardSrc=night?'assets/map-night.png':'assets/map-day.jpg';if(boardImage.getAttribute('src')!==boardSrc)boardImage.setAttribute('src',boardSrc);mapBackdrop.style.backgroundImage='none';mapBackdrop.dataset.time=night?'night':'day';if(phaseLabel)phaseLabel.textContent=night?'☾ 夜晚':'☀ 白天';renderSelfStatus();};
  function duelStats(p){const cap=Math.max(1,p.maxHP||p.baseHP||1),ratio=Math.max(0,Math.min(100,p.hp/cap*100));return `<div class="duel-stat-row"><span class="duel-hp-stat">HP ${p.hp}/${cap}</span><span>⚔ 攻擊 ${effectiveAttack(p)}</span><span>🛡 防禦 ${p.defense}</span><span>🪙 金幣 ${p.coins}</span></div><div class="duel-hp-track"><i style="width:${ratio}%"></i></div>`;}
  function renderDuel(){if(!duelState)return;const {left,right}=duelState;duelLeftPortrait.src=characters[left.character].gif;duelRightPortrait.src=characters[right.character].gif;duelLeftName.textContent=`${left===players[0]?'自身玩家／1P':`玩家 ${players.indexOf(left)+1}`}：${characters[left.character].name}`;duelRightName.textContent=`${right===players[0]?'自身玩家／1P':`玩家 ${players.indexOf(right)+1}`}：${characters[right.character].name}`;duelLeftStats.innerHTML=duelStats(left);duelRightStats.innerHTML=duelStats(right);renderDuelSkills(duelLeftSkills,left,'left');renderDuelSkills(duelRightSkills,right,'right');}
  function usableDuelSkills(player){
    if((player.sealedTurns||0)>0){
      const defensive=player.skills.filter(skill=>skill.category==='defense'||['wall','thorn','dodge','wish','wind'].includes(skill.effect));
      return defensive.length?defensive:[{name:'防禦姿態',desc:'封脈期間的保命防禦：本次防禦 +2。',effect:'sealedGuard',category:'defense',temporary:true,image:'assets/skill-04.jpg'}];
    }
    return player.skills;
  }
  function renderDuelSkills(container,player,side){container.innerHTML='';usableDuelSkills(player).forEach(skill=>{const button=document.createElement('button');button.type='button';button.className='duel-skill-card'+(skill.temporary?' temporary-defense-skill':'');const image=document.createElement('img');image.src=skill.image||characters[player.character].baseImage;image.alt='';const name=document.createElement('strong');name.textContent=skill.name;const desc=document.createElement('small');desc.textContent=skill.desc||'角色基本技能';button.append(image,name,desc);const canUse=duelState.phase==='action'&&duelState.attacker===player&&(player.controlType==='local'||(player.controlType==='npc'&&isNpcAuthority()));button.disabled=!canUse;button.title=skill.desc||skill.name;button.addEventListener('click',()=>{if(duelState&&duelState.attacker===player&&duelState.phase==='action'&&(player.controlType==='local'||(player.controlType==='npc'&&isNpcAuthority())))performDuelSkill(skill);});container.appendChild(button);});}
  async function startDuel(active,opponent,opponents=[opponent]){
    // Final safety gate: no call site may open a duel before both players have passed start once.
    if(!haveBothPassedStart(active,opponent)){
      rollResult.textContent='尚未開放對決：雙方都必須先完整繞行棋盤，經過一次「由此去」起點。';
      return {blocked:true};
    }
    opponents=opponents.filter(candidate=>haveBothPassedStart(active,candidate));
    if(!opponents.includes(opponent))return {blocked:true};
    return new Promise(resolve=>{duelResolve=resolve;const left=(active===players[0]||opponent===players[0])?players[0]:active;const right=left===active?opponent:active;duelState={left,right,active,opponents,attacker:null,phase:'roll',actionCount:0,remoteSync:false};onlineDuelResult=null;duelFinishing=false;duelTargetPicker.classList.toggle('is-hidden',!(active===players[0]&&opponents.length>1));duelTargetSelect.innerHTML='';opponents.forEach((candidate,i)=>{const option=document.createElement('option');option.value=String(i);option.textContent=`玩家 ${players.indexOf(candidate)+1}：${characters[candidate.character].name}`;duelTargetSelect.appendChild(option);});if(active===players[0]&&opponents.length>1){duelTargetSelect.value=String(Math.max(0,opponents.indexOf(opponent)));duelTargetSelect.onchange=()=>{if(!duelState)return;const picked=duelState.opponents[Number(duelTargetSelect.value)];duelState.left=players[0];duelState.right=picked;renderDuel();void publishOnlineState();};}else duelTargetSelect.onchange=null;renderDuel();duelModal.classList.remove('is-hidden');startBattleMusic();duelSkillPicker.classList.add('is-hidden');duelContinueButton.classList.add('is-hidden');duelEscapeLeft.classList.add('is-hidden');duelEscapeRight.classList.add('is-hidden');duelRollButton.classList.remove('is-hidden');duelRollButton.disabled=!(active.controlType==='local'||(active.controlType==='npc'&&isNpcAuthority()));duelStatus.textContent='雙方擲骰比大小，點數較高者先攻。';duelLeftDie.textContent='?';duelRightDie.textContent='?';updateTurnUI();void publishOnlineState();if(active.controlType==='npc'&&isNpcAuthority()&&opponent.controlType==='npc')setTimeout(()=>rollDuelDice(),500);});}
  async function rollDuelDice(){if(!duelState||duelState.phase!=='roll')return;if(!(duelState.active.controlType==='local'||(duelState.active.controlType==='npc'&&isNpcAuthority())))return;duelRollButton.disabled=true;playTone('roll');let a=1+Math.floor(Math.random()*6),b=1+Math.floor(Math.random()*6);duelLeftDie.textContent=a;duelRightDie.textContent=b;while(a===b){await wait(450);a=1+Math.floor(Math.random()*6);b=1+Math.floor(Math.random()*6);duelLeftDie.textContent=a;duelRightDie.textContent=b;}duelState.leftDie=a;duelState.rightDie=b;duelState.attacker=a>b?duelState.left:duelState.right;duelState.defender=duelState.attacker===duelState.left?duelState.right:duelState.left;duelState.phase='action';duelStatus.textContent=`${a>b?duelLeftName.textContent:duelRightName.textContent} 擲出較大點數，取得先攻！`;duelRollButton.classList.add('is-hidden');await publishOnlineState();await wait(500);showDuelAction();}
  function showDuelAction(){if(!duelState)return;const attacker=duelState.attacker,defender=duelState.defender;renderDuel();if(attacker.hp<=0||defender.hp<=0){void finishDuel();return;}duelState.phase='action';duelSkillPicker.classList.remove('is-hidden');duelSkillSelect.innerHTML='';duelState.actionSkills=usableDuelSkills(attacker);duelState.actionSkills.forEach((skill,i)=>{const op=document.createElement('option');op.value=String(i);op.textContent=`${skill.name}｜${skill.desc||'基本攻擊'}`;duelSkillSelect.appendChild(op);});syncDuelSkillDescription();duelSkillSelect.onchange=syncDuelSkillDescription;renderDuel();duelStatus.textContent=`輪到 ${characters[attacker.character].name} 施放技能。${attacker.sealedTurns>0?'（封脈期間禁止攻擊，只能使用防禦技能）':''}`;duelUseSkill.disabled=!(attacker.controlType==='local'||(attacker.controlType==='npc'&&isNpcAuthority()));if(attacker.controlType==='npc'&&isNpcAuthority()){const key=`${attacker.onlineClientId||players.indexOf(attacker)}:${duelState.actionCount}:${duelState.phase}`;if(npcDuelActionKey!==key){npcDuelActionKey=key;setTimeout(()=>{if(duelState&&duelState.attacker===attacker&&duelState.phase==='action'){const choices=usableDuelSkills(attacker);performDuelSkill(choices[Math.floor(Math.random()*choices.length)]);}},650);}}void publishOnlineState();}
  function normalAttack(attacker,defender,amount,ignoreDefense=0){const attack=Math.max(0,amount);const effectiveDef=Math.max(0,defender.defense-ignoreDefense);const absorbed=Math.min(effectiveDef,attack);defender.defense=Math.max(0,defender.defense-absorbed);const hpDamage=Math.max(0,attack-absorbed);defender.hp=Math.max(0,defender.hp-hpDamage);return {absorbed,hpDamage};}
  async function performDuelSkill(skill){
    if(!duelState||duelState.phase!=='action')return;
    const attacker=duelState.attacker,defender=duelState.defender;
    if(!skill||!(attacker?.controlType==='local'||(attacker?.controlType==='npc'&&isNpcAuthority())))return;
    duelState.phase='resolving';duelUseSkill.disabled=true;duelEscapeLeft.classList.add('is-hidden');duelEscapeRight.classList.add('is-hidden');
    const defenderBefore={hp:defender.hp,defense:defender.defense};
    let msg=`${characters[attacker.character].name} 使用「${skill.name}」。`;
    showSkillFlash(skill);
    const attackSkill=skill.category==='attack'||(!skill.category&&!['sealedGuard','seal','wall','dodge','wish','wind'].includes(skill.effect));
    const counterBonus=matchupBonus(attacker,defender,skill);
    const base=effectiveAttack(attacker)+counterBonus;
    if(counterBonus)msg+=` 角色相剋生效！本次招式攻擊額外 +${counterBonus}。`;
    let result={absorbed:0,hpDamage:0};
    let fullyImmune=false;
    if(defender.immuneNext&&attackSkill){
      fullyImmune=Math.random()<0.5;
      defender.immuneNext=false;
      if(fullyImmune)msg+=' 對手觸發殘影閃避，完全免疫本次招式攻擊。';
    }
    if(!fullyImmune){
      switch(skill.effect){
        case'shatter': result=normalAttack(attacker,defender,base+1,2);msg+=' 攻擊 +1，無視對手 2 點防禦。';break;
        case'thrust': result=normalAttack(attacker,defender,base+3);defender.hp=Math.max(0,defender.hp-1);msg+=' 攻擊 +3，額外扣除對手 1 HP。';break;
        case'blood': attacker.hp=Math.max(0,attacker.hp-3);result=normalAttack(attacker,defender,base+5);msg+=' 自身扣除 3 HP，攻擊 +5。';break;
        case'wall': attacker.defense+=4;msg+=' 防禦 +4。';break;
        case'thorn': attacker.defense+=1;defender.defense=Math.max(0,defender.defense-2);msg+=' 自身防禦 +1，對手防禦 -2。';break;
        case'dodge': attacker.immuneNext=true;msg+=' 啟動殘影閃避：下次受到對手招式攻擊時，有 50% 機率完全免疫。';break;
        case'soul': {const soulDamage=3+counterBonus;defender.hp=Math.max(0,defender.hp-soulDamage);attacker.hp=Math.min(attacker.maxHP,attacker.hp+3);msg+=` 對手扣除 ${soulDamage} HP，自身額外恢復 3 HP。`;break;}
        case'wish': attacker.hp=Math.min(attacker.maxHP,attacker.hp+4);msg+=' 恢復 4 HP。';break;
        case'wind': attacker.hp=Math.min(attacker.maxHP,attacker.hp+2);attacker.duelRegenActive=true;msg+=' 恢復 2 HP；之後每個攻防回合自動恢復 1 HP，直到滿血。';break;
        case'weak': attacker.defense=Math.max(0,attacker.defense-1);defender.duelDefenseDrain=true;msg+=' 自身防禦 -1；對手每個攻防回合防禦 -2。';break;
        case'seal': defender.sealedTurns=Math.max(defender.sealedTurns||0,1);msg+=' 封脈禁咒生效：對手下一個行動回合只能使用防禦、閃避或恢復類技能。';break;
        case'sealedGuard': attacker.defense+=2;msg+=' 防禦姿態：防禦 +2。';break;
        case'poison': defender.duelPoisoned=true;msg+=' 致命毒刃生效：對手每個完整攻防回合扣除 2 HP，直到死亡或對決結束。';break;
        default: result=normalAttack(attacker,defender,base);msg+=skill.base?' 基本技能依一般攻擊規則處理。':' 依一般攻擊規則處理。';
      }
    }
    if(attacker.sealedTurns>0&&skill.effect!=='seal')attacker.sealedTurns--;
    duelState.actionCount=(duelState.actionCount||0)+1;
    const roundComplete=duelState.actionCount%2===0;
    const defenderSide=defender===duelState.left?document.querySelector('.duel-left'):document.querySelector('.duel-right');
    if(defender.hp<defenderBefore.hp||defender.defense<defenderBefore.defense){defenderSide.classList.remove('is-hit');void defenderSide.offsetWidth;defenderSide.classList.add('is-hit');playEffectTone('hit');window.setTimeout(()=>defenderSide.classList.remove('is-hit'),520);}
    if(roundComplete){
      const combatants=[duelState.left,duelState.right];
      combatants.forEach(player=>{
        if(player.duelPoisoned){player.hp=Math.max(0,player.hp-2);msg+=`｜${characters[player.character].name} 受到毒刃傷害 -2 HP。`;}
        if(player.duelRegenActive&&player.hp>0&&player.hp<player.maxHP){player.hp=Math.min(player.maxHP,player.hp+1);msg+=`｜${characters[player.character].name} 復甦之風恢復 1 HP。`;}
        if(player.hp>=player.maxHP)player.duelRegenActive=false;
        if(player.duelDefenseDrain){player.defense=Math.max(0,player.defense-2);msg+=`｜${characters[player.character].name} 受到破甲虛弱，防禦 -2。`;}
      });
    }
    renderDuel();renderSelfStatus();duelStatus.textContent=msg;
    await publishOnlineState();
    await wait(roundComplete?3000:900);
    if(defender.hp<=0||attacker.hp<=0||duelState.left.hp<=0||duelState.right.hp<=0){await finishDuel();return;}
    duelState.attacker=defender;duelState.defender=attacker;duelState.phase='action';
    duelEscapeLeft.classList.add('is-hidden');duelEscapeRight.classList.add('is-hidden');
    if(duelState.actionCount>=6&&duelState.actionCount%2===0&&players[0]&&(duelState.left===players[0]||duelState.right===players[0])){
      if(duelState.left===players[0]){duelEscapeLeft.textContent='自身玩家逃跑';duelEscapeLeft.classList.remove('is-hidden');}
      else{duelEscapeRight.textContent='自身玩家逃跑';duelEscapeRight.classList.remove('is-hidden');}
    }
    showDuelAction();
  }
  async function finishDuel(){
    if(!duelState||duelFinishing)return;
    if(onlineGameChannel&&!lobbyIsHost){duelState.phase='finished-pending';duelStatus.textContent='決鬥結果同步中，等待房主確認…';await publishOnlineState();return;}
    duelFinishing=true;
    const state=duelState,{left,right}=state;
    const bothDead=left.hp<=0&&right.hp<=0;
    const loser=bothDead?null:left.hp<=0?left:right.hp<=0?right:null;
    const winner=loser?(loser===left?right:left):null;
    let selfCoinsLost=0;
    const resetAfterDeath=player=>{
      const c=characters[player.character];player.lives=Math.max(0,Number(player.lives??3)-1);
      const learned=(player.skills||[]).filter(skill=>!skill.base);
      learned.forEach(skill=>{const poolSkill=skills.find(item=>item.name===skill.name);if(poolSkill&&!availableSkills.some(item=>item.name===poolSkill.name))availableSkills.push(poolSkill);});
      selfCoinsLost=player===players[0]?Math.max(0,Number(player.coins)||0):selfCoinsLost;
      player.position=0;player.hp=c.hp;player.maxHP=c.hp;player.baseHP=c.hp;player.attack=c.attack;player.defense=c.defense;player.coins=0;
      player.skills=[{name:c.baseSkill,base:true,image:c.baseImage,desc:'角色基本技能；效果依照角色基本攻擊規則。'}];
      player.attackBonus=0;player.attackBonusTurns=0;player.regenTurns=0;player.regenActive=false;player.poisonTurns=0;player.defenseDrainTurns=0;player.stunnedTurns=0;player.sealedTurns=0;player.immuneNext=false;
      player.duelPoisoned=false;player.duelRegenActive=false;player.duelDefenseDrain=false;player.lapRewards=0;player.middleDirection=0;player.forcedOuterJunction=false;
    };
    let stolenCoins=0,loserCoinsLeft=0;
    if(bothDead){resetAfterDeath(left);resetAfterDeath(right);rollResult.textContent='雙方在對決中同時倒下，均返回起始點，恢復角色基本能力，並失去金幣與抽到的技能。';}
    else if(loser){const loserCoins=Math.max(0,Number(loser.coins)||0);stolenCoins=Math.floor(loserCoins*0.8);loserCoinsLeft=loserCoins-stolenCoins;if(winner)winner.coins+=stolenCoins;if(winner&&stolenCoins>0){pendingCoinEvents.push({from:loser,to:winner,amount:stolenCoins,reason:'對決奪取金幣'});queueOnlineCoinEvent(loser,winner,stolenCoins,'對決奪取金幣');}resetAfterDeath(loser);loser.coins=loserCoinsLeft;if(loser===players[0])selfCoinsLost=stolenCoins;rollResult.textContent=`${characters[winner.character].name} 打敗對手，奪取對方金幣的 80%（${stolenCoins}）；敗者保留 ${loserCoinsLeft} 金幣並返回起始點。`;}
    else rollResult.textContent='對決結束。';
    [left,right].forEach(player=>{player.duelPoisoned=false;player.duelRegenActive=false;player.duelDefenseDrain=false;player.sealedTurns=0;player.immuneNext=false;});
    onlineDuelResult={id:`duel-${onlineGameRoomId||'offline'}-${Date.now()}`,winnerId:winner?.onlineClientId||null,loserId:loser?.onlineClientId||null,bothDead};
    duelModal.classList.add('is-hidden');stopBattleMusic();duelState=null;duelFinishing=false;npcDuelActionKey='';if(gameStarted)startGameMusic();duelEscapeLeft.classList.add('is-hidden');duelEscapeRight.classList.add('is-hidden');renderPlayers();updateTurnUI();await publishOnlineState();
    if(stolenCoins>0&&winner===players[0]){await showCoinBatch('對決勝利｜奪取 80% 金幣',[{amount:stolenCoins,kind:'gain'}],`打敗對手，成功奪取 ${stolenCoins.toLocaleString('zh-TW')} 枚金幣（對方原有金幣的 80%）。`);closeModal();}
    if(selfCoinsLost>0){
      await showCoinBatch('對決失敗｜金幣損失',[{amount:selfCoinsLost,kind:'loss'}],`你在對決中失去 ${selfCoinsLost.toLocaleString('zh-TW')} 枚金幣；如非雙方同時倒下，敗者仍保留剩餘金幣並返回起始點。`);
      closeModal();
    }
    if(duelResolve){const resolve=duelResolve;duelResolve=null;resolve({winner,loser,bothDead});}
    endGameIfNeeded();
  }
  async function escapeDuel(side){if(!duelState||duelState.phase!=='action'||duelState.actionCount<6||duelState.actionCount%2!==0)return;const escapee=side==='left'?duelState.left:duelState.right;if(escapee!==players[0])return;playTone('click');const coinLoss=Math.min(escapee.coins,Math.floor(Math.max(0,escapee.coins)*0.2));escapee.coins=Math.max(0,escapee.coins-coinLoss);const removable=escapee.skills.map((skill,index)=>({skill,index})).filter(item=>!item.skill.base);let lostSkill=null;if(removable.length){const chosen=removable[Math.floor(Math.random()*removable.length)];lostSkill=chosen.skill;escapee.skills.splice(chosen.index,1);const poolSkill=skills.find(item=>item.name===lostSkill.name);if(poolSkill&&!availableSkills.some(item=>item.name===poolSkill.name))availableSkills.push(poolSkill);}duelStatus.textContent='自身玩家選擇逃跑，已扣除 20% 金幣並隨機失去一項非基本技能。';[duelState.left,duelState.right].forEach(player=>{player.duelPoisoned=false;player.duelRegenActive=false;player.duelDefenseDrain=false;player.sealedTurns=0;player.immuneNext=false;});onlineDuelResult={id:`duel-escape-${onlineGameRoomId||'offline'}-${Date.now()}`,winnerId:null,loserId:escapee.onlineClientId||null,bothDead:false};duelModal.classList.add('is-hidden');stopBattleMusic();duelState=null;duelFinishing=false;npcDuelActionKey='';if(gameStarted)startGameMusic();duelEscapeLeft.classList.add('is-hidden');duelEscapeRight.classList.add('is-hidden');renderPlayers();updateTurnUI();rollResult.textContent=`你選擇逃跑：損失 ${coinLoss} 枚金幣${lostSkill?`，並失去招式「${lostSkill.name}」`:'；目前沒有可失去的非基本技能'}。`;await publishOnlineState();await showCoinBatch('逃跑代價｜損失金幣與招式',[{amount:coinLoss,kind:'loss'}],lostSkill?`逃跑扣除 20% 金幣，並隨機失去招式「${lostSkill.name}」。`:'逃跑扣除 20% 金幣；目前沒有可失去的非基本技能。');closeModal();if(duelResolve){const resolve=duelResolve;duelResolve=null;resolve({escaped:true,escapee});}}
  duelEscapeLeft.addEventListener('click',()=>escapeDuel('left'));duelEscapeRight.addEventListener('click',()=>escapeDuel('right'));
  duelRollButton.addEventListener('click',rollDuelDice);duelUseSkill.addEventListener('click',()=>{if(duelState)performDuelSkill((duelState.actionSkills||usableDuelSkills(duelState.attacker))[Number(duelSkillSelect.value)]);});
  window.setMapTime('day');window.getSelectedCharacter=()=>selectedCharacter;window.getTeleportPairs=()=>Array.from(teleportPairs.entries());window.getUsableDuelSkills=player=>usableDuelSkills(player).map(s=>({name:s.name,category:s.category,effect:s.effect,temporary:!!s.temporary}));window.getGameState=()=>({selectedCharacter,players:players.map(p=>({character:p.character,position:p.position,lapsCompleted:p.lapsCompleted||0,controlType:p.controlType,hp:p.hp,baseHP:p.baseHP,lives:p.lives??3,attack:effectiveAttack(p),defense:p.defense,coins:p.coins,skills:p.skills.map(s=>s.name),pauseUses:p.pauseUses})),currentPlayer,round,time:night?'night':'day',busy,pendingTurnAction,pauseActive,gameStarted,availableSkills:availableSkills.map(s=>s.name),duel:!!duelState});
  if(selfStatusToggle&&selfStatusPanel){selfStatusToggle.addEventListener('click',()=>{const collapsed=selfStatusPanel.classList.toggle('is-collapsed');selfStatusToggle.setAttribute('aria-expanded',String(!collapsed));selfStatusToggle.setAttribute('aria-label',collapsed?'展開完整狀態':'收合完整狀態');selfStatusToggle.querySelector('.status-toggle-icon').textContent=collapsed?'▶':'◀';resizeBoard();playTone('click');});}
  window.addEventListener('resize',resizeBoard);if(window.visualViewport)window.visualViewport.addEventListener('resize',resizeBoard);
})();
