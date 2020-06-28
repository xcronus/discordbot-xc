// discord.js モジュールのインポート
const Discord = require('discord.js');
//const ConfigFile = require('config');
const XIVAPI = require('xivapi-js')
//const xiv = new XIVAPI()
const xiv = new XIVAPI({
  private_key: 'e139e1a20bc5447b90226cc3f4f76648fb8884ca0fec4f61aa4fd8d0f286f22f',
  language: 'ja',
  snake_case: true
})
require('date-utils');

sample();
//oneDrive(1558527273090);


// Discord Clientのインスタンス作成
const client = new Discord.Client();

// トークンの用意
//3Arxy14hk8an_FnzSYdl8u_OVXTIh6Lo
const token = 'NTczMzM5OTM4Njc0NzA0NDAx.XuSTQA.aVlwaL5T55a-nrh7HHg-t-5OEW4';
console.log('アルテマさん起動');

var ActiveGame;
var ActiveGameType;

// 準備完了イベントのconsole.logで通知黒い画面に出る。
client.on('ready', () => {
	//console.log(getLogsAll());
	//console.log(client.user);
	//console.log(client.user.id);
	//var cs = client.user.settings;
	//client.user.settings = true;
	//console.log(cs);
    //console.log(client.user.localPresence);

    ShowGameTitle(client);
	var dt = new Date();
	var formatted = dt.toFormat("YYYY/MM/DD HH24:MI:SS");
    console.log(formatted+' ready...');

    //テスト
    //getHtml('https://www.fflogs.com/reports/vApYfzLhx1wryVX3/#fight=5&type=damage-done&phase=1');
    //console.log(getLogsRepotDamegeDone('tvxy74WLnZDwfzq1',1,1556815666272,73941740,74008053,1));

    //console.log(getDamegeDoneAll());


});
var yondaflag = false;
client.on('message', message => {

  //if (message.isMemberMentioned(client.user) && message.member.voiceChannel)
    //  {
        //566923821727088654 テスト用ボイスちゃんねる　client.channels.get("566923821727088654")

        //message.member.voiceChannel.join().then( connection => {
        //client.channels.get("566923821727088654").join().then( connection => {
        console.log(message.member);
        //message.member.voiceChannel.join().then( connection => {
        client.channels.get("566923821727088654").join().then( connection => {
              const dispatcher = connection.playFile('test.wav');
              dispatcher.on('end', reason => {
                  connection.disconnect();
              });
          })
          .catch(console.log);
        //  return;
    //  }





    // メッセージの文字列による条件分岐
	//特別再起動処理（テストユーザから再起動要求があった場合、アルテマさんを再起動する
    if (message.author.username == 'テスト'){
    	if (/(アルテマ|あるてま)さん.*(再起動|リロード|ログアウト)/.test(message.content)) {
    		client.destroy();
    		return;
    	}
    }

	//自身およびBOTの発言は除外
    if(message.author.bot){
    	//活動しているときはFFする
		ActiveGame = 'FINAL FANTASY XIV';
		ActiveGameType = 'PLAYING';
    	client.user.setActivity(ActiveGame, { type: ActiveGameType })
		.catch(console.error);
        return;
    }


    if (/状態変更/.test(message.content)) {
      	ShowGameTitle(client);
      	return;
      }

	//その他ユーザからの再起動要求
	if (/(アルテマ|あるてま)さん.*(再起動|リロード|ログアウト)/.test(message.content)) {
    	client.destroy();
    	return;
    }

    //LogsのアドレスがLogs置き場以外に貼られたら、Logs置き場に貼りなおす
    if ( ( /https:\/\/www.fflogs.com\/reports/.test(message.content) || /https:\/\/ja.fflogs.com\/reports/.test(message.content) )　) {
      //if (message.channel.id != '573786857574498307' && ( /https:\/\/www.fflogs.com\/reports/.test(message.content) || /https:\/\/ja.fflogs.com\/reports/.test(message.content) )　) {

      var codeStartI;
      var codeNumI;
      var urlWWW;
      if (/https:\/\/www.fflogs.com\/reports/.test(message.content)) {
        codeStartI = 31;
        codeNumI = 16;
        urlWWW = "www"
      }
      if (/https:\/\/ja.fflogs.com\/reports/.test(message.content)) {
        codeStartI = 30;
        codeNumI = 16;
        urlWWW = "ja"
      }


      //console.log('wwww');
		//client.channels.get("573786857574498307").sendMessage(message.content);
		var postUrl = message.content;
		var request = require('request');
		var options = {
		    url: 'https://www.fflogs.com/v1/report/fights/' + postUrl.substr(codeStartI,codeNumI) +'?api_key=0307d08a790e241745f7bba2b81f1f8b',
		    method: 'GET',
		    json: true
		}

		request(options, function (error, response, body) {
		    //console.log(body);
		    var reportStart = body.start;
		    var reportEnd = body.end;
		    var longId = 0;
		    var longTime = 0;
		    var maxFightDateTime = '';
		    var longMsg = '';
		    var bossPercentage = 0;
		    var fightPercentage = 0;
		    var maxFightPercentage = 0;
		    var lastPhaseForPercentageDisplay = 'ボス';
		    var battleStart = 0;
		    var maxBattleStart = 0;
		    var battleEnd = 0;
		    var battleTime;
		    var battleTimeSum = 0;
		    var battleCount = 0;
		    var battleTimeAve = 0;
		    var phase0Count = 0;
		    var phase1Count = 0;
		    var phase2Count = 0;
		    var phase3Count = 0;
		    var phase4Count = 0;
		    var phase5Count = 0;

        console.log('アルテマさん起動1');
		    //メンバーチェック
		    var postFlag = false;
		    for(var f=0;f<body.friendlies.length;f++){
		    	if(body.friendlies[f].name == "Cro Milk"){
		    		postFlag = true;
		    	}
		    }

        console.log('アルテマさん起動2');

		    for(var i=0;i<body.fights.length;i++){

          console.log('アルテマさん起動3');
		    	if (body.fights[i].zoneName == "the Weapon's Refrain (Ultimate)") {
            console.log('アルテマさん起動4');
		    		//最初の戦闘開始時間
		    		if (battleStart == 0){
		    			battleStart = body.fights[i].start_time;
		    		}
		    		//最後の戦闘開始時間
		    		battleEnd = body.fights[i].end_time;
		    		//総戦闘数カウント
		    		battleCount = battleCount +1;
		    		//戦闘時間
		    		battleTime = body.fights[i].end_time - body.fights[i].start_time;
		    		//総戦闘時間カウント
		    		battleTimeSum = battleTimeSum + battleTime;

		    		//戦闘％
		    		fightPercentage = (10000 - body.fights[i].fightPercentage) / 100;

		    		//到達フェーズカウント
		    		if(body.fights[i].lastPhaseForPercentageDisplay == 1){
		    			phase1Count = phase1Count + 1;
		    		}else if(body.fights[i].lastPhaseForPercentageDisplay == 2){
		    			phase2Count = phase2Count + 1;
		    		}else if(body.fights[i].lastPhaseForPercentageDisplay == 3){
		    			phase3Count = phase3Count + 1;
		    		}else if(body.fights[i].lastPhaseForPercentageDisplay == 4){
		    			phase4Count = phase4Count + 1;
		    		}else if(body.fights[i].lastPhaseForPercentageDisplay == 5){
		    			phase5Count = phase5Count + 1;
		    		}else{
		    			phase0Count = phase0Count + 1;
		    		}

			    	//時間を計算
			    	//if (longTime < battleTime){
			    	if (maxFightPercentage < fightPercentage){
			    		longTime = battleTime;
			    		maxBattleStart = reportStart + body.fights[i].start_time;
			    		maxFightPercentage = fightPercentage;
			    		longId = body.fights[i].id;
			    		bossPercentage = body.fights[i].bossPercentage / 100;
			    		maxFightDateTime = unixtimeToDate(Math.round((reportStart + body.fights[i].start_time) / 1000));
			    		//fightPercentage = (10000 - body.fights[i].fightPercentage) / 100;
			    		if(body.fights[i].lastPhaseForPercentageDisplay == 1){
			    			lastPhaseForPercentageDisplay = 'ガルーダ';
			    		}else if(body.fights[i].lastPhaseForPercentageDisplay == 2){
			    			lastPhaseForPercentageDisplay = 'イフリート';
			    		}else if(body.fights[i].lastPhaseForPercentageDisplay == 3){
			    			lastPhaseForPercentageDisplay = 'タイタン';
			    		}else if(body.fights[i].lastPhaseForPercentageDisplay == 4){
			    			lastPhaseForPercentageDisplay = '変態サンクレッド';
			    		}else if(body.fights[i].lastPhaseForPercentageDisplay == 5){
			    			lastPhaseForPercentageDisplay = 'アルテマウェポン';
			    		}
			    	}
            console.log('アルテマさん起動5');
			    }
		    }
		    if(longId != 0 && postFlag){
		    	battleTimeAve = Math.round((battleTimeSum / battleCount) / 1000);
		    	toHms(battleTimeAve);
			    longMsg = '一番頑張った回はこれであってる？ https://' + urlWWW + '.fflogs.com/reports/' + postUrl.substr(codeStartI,codeNumI) +'#fight=' + longId + ' ' + lastPhaseForPercentageDisplay +  'のHPは残り' + bossPercentage + '%位だったよ。 通しの進捗率は' + maxFightPercentage + '%位だね。頑張って！';
			   	message.channel.send(longMsg);
			   	//client.channels.get("573786857574498307").sendMessage(longMsg);

			   //	var startTime = Date.parse(maxFightDateTime);
			   	//var downloadUrl = oneDrive(startTime);
			   	//console.log(startTime);

			   	longMsg =				'サマリー\n' +
			   							'戦闘開始日時　　　　　　　　　：' + unixtimeToDate(Math.round((reportStart + battleStart) / 1000)) + '\n' +
			   							'戦闘終了日時　　　　　　　　　：' + unixtimeToDate(Math.round((reportStart + battleEnd) / 1000)) + '\n' +
			   							'戦闘回数　　　　　　　　　　　：' + battleCount + '回\n' +
			   							'総戦闘時間　　　　　　　　　　：' + toHmsSpan(Math.round(battleTimeSum / 1000)) + '\n' +
			   							'総戦闘時間_フロー待ち等1分含む：' + toHmsSpan(Math.round(battleTimeSum / 1000) + (60 * battleCount) ) + '\n' +
			   							'戦闘平均時間　　　　　　　　　：' + toHmsSpan(battleTimeAve) + '\n' +
			   							'最高進捗戦闘時間　　　　　　　：' + toHmsSpan(Math.round(longTime / 1000)) + '\n' +
			   							'最高進捗戦闘URL　　　　　　　 ：https://' + urlWWW + '.fflogs.com/reports/' + postUrl.substr(codeStartI,codeNumI) +'#fight=' + longId + '\n' +
			   							'最高進捗戦闘日時　　　　　　　：' + maxFightDateTime + '\n' +
			   							'最高進捗進捗ボス　　　　　　　：' + lastPhaseForPercentageDisplay + '\n' +
			   							'最高進捗進捗ボス%　　　　　　 ：' + bossPercentage + '%\n' +
			   							'全体進捗率　　　　　　　　　　：' + maxFightPercentage + '%\n' +
			   							'ガルーダまで到達　　　　　　　：' + phase1Count + '回\n' +
			   							'イフリートまで到達　　　　　　：' + phase2Count + '回\n' +
			   							'タイタンまで到達　　　　　　　：' + phase3Count + '回\n' +
			   							'荒ぶるナッツイーターまで到達　：' + phase4Count + '回\n' +
			   							'アルテマウェポンまで到達　　　：' + phase5Count + '回\n' +
			   							'ゴミの戦い　　　　　　　　　　：' + phase0Count + '回\n';// +
//			   							'動画（たぶん）　　　　　　　　：' + downloadUrl;

			   	//より細かい詳細
			   	message.channel.send(longMsg);
			   	//client.channels.get("573786857574498307").sendMessage(longMsg);

			}
		})
		return;
    }

	//Logsのアドレス以外だったら、なんでもかんでも参考リンクに貼りなおす
    if (message.channel.id != '566315857009967104' && /http[s]{0,1}:\/\//.test(message.content) && /https:\/\/www.fflogs.com\/reports/.test(message.content) == false ) {
	    //gyazoは除外
	    if(/https:\/\/gyazo\.com\//.test(message.content) == false){
		    //client.channels.get("566315857009967104").sendMessage(message.content);
		    return;
		}
    }















    //以下ねた系=======================================================

    //message.channel.send(message.author.username);
    if (/(竹林|ちくりん|チクリン)/.test(message.content)) {
    	var x = rnum(0,3);
    	//message.channel.send('あっきゅん・・・また竹林に送られてしまったのですね・・・');
        if (x == 1) {
        	//message.channel.send('しゃのんさんもついでに竹林ですね');
        }
    	yondaflag = false;
        return;
    }

    if (/(あっきゅん|ぽよぽよ)/.test(message.content)) {
    	var x = rnum(0,4);
    	if ( x == 1 ) {
        	//message.channel.send('あっきゅんならさっき竹林に送られてましたよ');
    	}
    	yondaflag = false;
        return;
    }

    if (/(かわいい)/.test(message.content)) {
    	var x = rnum(0,2);
    	if (x == 1) {
    		//message.channel.send('てれるかしら！？');
	    	yondaflag = false;
	       return;
	   	}
    }
    if (/(アルテマ|あるてま)さん.*(かわいい)/.test(message.content)) {
       message.channel.send('てれる');
    	yondaflag = false;
        return;
    }

    if (/たらし/.test(message.content)) {
    	//message.channel.send('クオさんまたたらしたのですか？');
    	yondaflag = false;
    	return;
    }

    if (/愛人/.test(message.content)) {
    	//message.channel.send('クオさん・・・ねあんさんがおこですよ？');
    	yondaflag = false;
    	return;
    }

    if (message.author.username != 'かぼ太郎' && /(あるてまさん|アルテマさん)/.test(message.content)) {
    	var x = rnum(0,1);
    	if (x == 0) {
    		message.channel.send('呼んだ？');
    		yondaflag = true;
    	}else if (x == 1) {
    		message.channel.send('なーに？');
    		yondaflag = true;
    	}else{
    		yondaflag = true;
    	}
    }else if (message.author.username == 'かぼ太郎' && /(あるてまさん|アルテマさん)/.test(message.content)) {
    	var x = rnum(0,2);
    	if (x == 0) {
    		message.channel.send('フー!!!!');
    		yondaflag = true;
    	}else if (x == 1) {
    		message.channel.send('シャー!!!!');
    		yondaflag = true;
    	}else{
    		message.channel.send('じーーーー・・・・');
    		yondaflag = true;
    	}
    }

    if (yondaflag && /(呼んでません|よんでません|呼んでない|よんでない|何でもない|なんでもない|なんでもありません|何でもありません)/.test(message.content)) {
    	message.channel.send('いったいなんなの・・・');
    	yondaflag = false;
    	return;
    }else{
	    if (/(部屋|テキストチャンネル|チャット).*(ID).*(教えて|おしえて)/.test(message.content)) {
			message.channel.send('このテキストチャンネルのIDは「' + message.channel.id + '」です');
    		yondaflag = false;
	        return;
	    }
	    if (/(設定ファイルテスト)/.test(message.content)) {
			message.channel.send('設定ファイルの「foo.bar」は「' + ConfigFile.foo.bar + '」です');
			message.channel.send('設定ファイルの「env」は「' + ConfigFile.env + '」です');
			//message.channel.send('設定ファイルの「runtime」は「' + ConfigFile.runtime + '」です');
			// ConfigFile.config.fname =  ConfigFile.config.fname + '1';
			//config.set('ConfigFile.foo.bar') = ConfigFile.foo.bar + '1';
    		yondaflag = false;
	        return;
	    }
	    if (/(ログアウト)/.test(message.content)) {
			message.channel.send('おやすみなさいー');
			client.destroy();
    		yondaflag = false;
	        return;
	    }
      if (/(ああああ)/.test(message.content)) {
			console.log('ああああ');
			message.channel.send('ああああ');
				yondaflag = false;
	        return;
	    }
	    if (/全記録ください/.test(message.content)) {

	    	var logStr = getLogsAll();
	    	var fs=require("fs");
	    	var iconv = require('iconv-lite');
	    	fs.writeFileSync( "./AllLogs.csv" , "" );              // 空のファイルを書き出す

        //var fd       = fs.openSync( "/home/xcronus/ff14arutemasan/AllLogs.csv", "w");     // ファイルを「書き込み専用モード」で開く
        var fd       = fs.openSync( "./AllLogs.csv", "w");     // ファイルを「書き込み専用モード」で開く
     	var buf      = iconv.encode( logStr , "Shift_JIS" );  // 書き出すデータをShift_JISに変換して、バッファとして書き出す
			fs.write( fd , buf , 0 , buf.length , function(err, written, buffer){  //  バッファをファイルに書き込む
			  if(err) throw err;
			  console.log("ファイルが正常に書き出しされました");
			});

	    	//fs.writeFileSync("/home/xcronus/ff14arutemasan/AllLogs.csv",logStr);
      message.channel.send("これでいい？",{ file: { attachment: "./AllLogs.csv"} });
      message.channel.send(new Discord.MessageAttachment("./AllLogs.csv"));
    //message.channel.send("これでいい？",{ file: { attachment: "./AllLogs.csv"} });

	   		yondaflag = false;
	        return;
	    }


	    if (/一番安い「.*」/.test(message.content)) {
			verifyCharacter(message,message.content.match(/「(.*)」/)[1]);
	        return;
	    }




    }

	//個別＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝


	//人別　Cro
    if (message.author.username == 'Cro'){
    	var x = rnum(0,30);
    	if (x == 1) {
    		//message.channel.send('だばーーーーー');
	    	yondaflag = false;
	        return;
    	}
    	//message.channel.send(message.channel.id);

    }

	//人別　AlbaLuna
    if (message.author.username == 'AlbaLuna'){
    	var x = rnum(0,30);
        //1/10の確率で発言
        if (x == 1) {
        	//message.channel.send('これは竹林ですね');
	        yondaflag = false;
	        return;
        } else if (x == 2) {
        	//message.channel.send('噂を聞きましたが・・・園芸師ギルドの姫はちょっとやめたほうが・・・');
        	//message.channel.send('あっでも、人の趣味はそれぞれっていうし、大丈夫なのかな！うん！がんばって！');
	        yondaflag = false;
	        return;
        }
    }

	//人別　Rokumaru
    if (message.author.username == 'Rokumaru'){
    	var x = rnum(0,20);
        //1/10の確率で発言
        if (x == 1) {
        	//message.channel.send('なに・・・？どこからかすごい筋肉の気配を感じるかしら！？');
	        yondaflag = false;
	        return;
        } else if (x == 2) {
        	//message.channel.send('ろくぽの筋肉はまだ成長するというの！？');
	        yondaflag = false;
	        return;
        }
    }

	//人別　かぼ太郎
    if (message.author.username == 'かぼ太郎'){
    	var x = rnum(0,60);
        //1/10の確率で発言
        if (x == 1) {
        	message.channel.send('ｼｬｰ!!!!!!');
	        yondaflag = false;
	        return;
        } else if (x == 2) {
          message.channel.send('ペーン！！！！！！');
	        yondaflag = false;
	        return;
        }
    }

	//人別　ハネモノ＠ねあん
    if (message.author.username == 'ハネモノ＠ねあん'){
    	var x = rnum(0,45);
        //1/10の確率で発言
        if (x == 1) {
        	message.channel.send('かわいいにゃん！にゃんにゃんにゃん！');
	        yondaflag = false;
	        return;
        }else if (x == 2) {
        	message.channel.send('にゃんにゃんにゃんにゃんにゃんにゃんにゃん！');
	        yondaflag = false;
	        return;
        }
    }

	//人別　或葉＠クォルア
    if (message.author.username == '或葉＠クォルア'){
    	var x = rnum(0,80);
        //1/10の確率で発言
        if (x == 1) {
        	//message.channel.send('カナ、この前クォルアさんが若葉さんをたらしてるの見たのかしら！');
	        yondaflag = false;
	        return;
        }
    }

	//人別　しゃのん＠Rara
    if (message.author.username == 'しゃのん＠Rara'){
    	var a = 0;
    	var b = 45;
    	var x = Math.floor(Math.random() * (b - a + 1) + a);
        //1/10の確率で発言
        if (x == 1) {
        	//message.channel.send('アルテマさんは' + message.author.username + 'を丸飲みにした。');
	        yondaflag = false;
	        return;
        } else if (x == 2) {
        	//message.channel.send('今日のご飯は四方竹とららふぇるの煮物にしようかしら！');
	        yondaflag = false;
	        return;
        }
    }

    //人別　ちゃんろあ
    if (message.author.username == 'ロアさん'){
   	    if (/殉職|打ち首|打首/.test(message.content)) {
	    	var x = rnum(0,9);
	        //message.channel.send('ちゃんろあさん・・・また殉職されてしまったのですね・・・');
	        if (x == 1) {
	        	//message.channel.send('ついでにあっきゅんは竹林ですね');
		        yondaflag = false;
		        return;
	        }
	        return;
	    } else {
	    	var x = rnum(0,40);
	        if (x == 1) {
	        	//message.channel.send(message.author.username  + 'にハルオーネの加護がありますように・・・');
		        yondaflag = false;
		        return;
	        }else if (x == 2) {
	        	//message.channel.send('あれ・・・カナのラノシアオレンジどこに行ったのかしら！！');
		        yondaflag = false;
		        return;
	        }
	    }
    }

	//人別　やあさん
    if (message.author.username == 'やこる'){
    	var x = rnum(0,19);
        //1/10の確率で発言
        if (x == 1) {
        	var mono = '';
	    	var x3 = rnum(0,200);
            if (x3 == 0){
            	mono = '素麺';
            }else if (x3 == 1){
            	mono = '肉まん';
            }else if (x3 == 2){
            	mono = '謎の角';
            }else if (x3 == 3){
            	mono = 'ラーメン';
            }else if (x3 == 4){
            	mono = 'お好み焼き';
            }else if (x3 == 5){
            	mono = 'ケーキ';
            }else if (x3 == 6){
            	mono = 'かぼちゃの煮物';
            }else if (x3 == 7){
            	mono = 'ららふぇる';
            }else if (x3 == 8){
            	mono = 'しゃのふぇる';
            }else if (x3 == 9){
            	mono = '唐揚げ';
            }else if (x3 == 10){
            	mono = '焼き芋';
            }else if (x3 == 11){
            	mono = '大判焼き';
            }else if (x3 == 12){
            	mono = '回転焼き';
            }else if (x3 == 13){
            	mono = '今川焼き';
            }else if (x3 == 14){
            	mono = '御座候';
            }else if (x3 == 15){
            	mono = 'ラノオレ';
            }else if (x3 == 16){
            	mono = '誰かのカバンに入ってた「クリティカル饅頭」っておやつ';
            }else if (x3 == 17){
            	mono = '肉じゃが';
            }else if (x3 == 18){
            	mono = 'サーモンサラダ';
            }else if (x3 == 19){
            	mono = 'お寿司';
            }else if (x3 == 20){
            	mono = '餃子';
            }else if (x3 == 21){
            	mono = '水炊き';
            }else if (x3 == 22){
            	mono = 'お茶漬け';
            }else {
            	mono = 'おかし';
            }

        	//message.channel.send('もぐもぐ・・・　あっ ' + message.author.username + 'も一緒に' + mono + 'たべる？');
	        yondaflag = false;
	        return;
        }
    }


	//yondaflag = false;
});


// Discordへの接続
client.login(token);

function getLogsAll(){

	var logsUrls = {};
	var syncrequestAll = require('sync-request');
	var getUrlAll = 'https://www.fflogs.com:443/v1/reports/user/CroMilk2?zone=30&api_key=0307d08a790e241745f7bba2b81f1f8b';

	var allReport = httpGetAll(getUrlAll);

	function httpGetAll(url){
	  var response = syncrequestAll(
	    'GET',
	    url
	    );
	    var retStr = "";
		var body = JSON.parse(response.body.toString());
		console.log(body);
		for(var i=0;i<body.length;i++){
	    	if (body[i].zone == 30) {
	    		console.log('https://www.fflogs.com/reports/' + body[i].id + '/');
	    		logsUrls['C' + body[i].start + body[i].id] = 'https://www.fflogs.com/reports/' + body[i].id + '/';
	    	}
	    }
	}
	var retMainStr = "戦闘開始日時,戦闘終了日時,戦闘回数,総戦闘時間,総戦闘時間_フロー待ち等1分含む,戦闘平均時間,最長戦闘時間,戦闘平均時間（秒）,最長戦闘時間（秒）,最長戦闘URL,最長進捗ボス,最長進捗ボス%,全体進捗率,ガルーダまで到達,イフリートまで到達,タイタンまで到達,荒ぶるナッツイーターまで到達,アルテマウェポンまで到達,ゴミの戦い\r\n";
	var result = {};
	var key = Object.keys(logsUrls);
	key.sort();
	for( var i = 0; i < key.length; i++ ) {
    	result[ key[i] ] = logsUrls[ key[i] ];
	}

	for(var key in result) {

		//Object.keys(result).forEach( function(value) {

	   // console.log( value + '：' + this[value] );

		var postUrl = result[key];

		var syncrequest = require('sync-request');
		var returnCode;
		var getUrl = 'https://www.fflogs.com/v1/report/fights/' + postUrl.substr(31,16) +'?api_key=0307d08a790e241745f7bba2b81f1f8b';
    console.log(getUrl);
		retMainStr = retMainStr + httpGet(getUrl);

		function httpGet(url){
		  var response = syncrequest(
		    'GET',
		    url
		    );
			var retStr = "";
			var body = JSON.parse(response.body.toString());

		    var reportStart = body.start;
		    var reportEnd = body.end;
		    var longId = 0;
		    var longTime = 0;
		    var longMsg = '';
		    var bossPercentage = 0;
		    var fightPercentage = 0;
		    var maxFightPercentage = 0;
		    var lastPhaseForPercentageDisplay = 'ボス';
		    var battleStart = 0;
		    var battleEnd = 0;
		    var battleTime;
		    var battleTimeSum = 0;
		    var battleCount = 0;
		    var battleTimeAve = 0;
		    var phase0Count = 0;
		    var phase1Count = 0;
		    var phase2Count = 0;
		    var phase3Count = 0;
		    var phase4Count = 0;
		    var phase5Count = 0;
		    var writeDay;

		    //メンバーチェック
		    var postFlag = false;
		    for(var f=0;f<body.friendlies.length;f++){
		    	if(body.friendlies[f].name == "Cro Milk"){
		    		postFlag = true;
		    	}
		    }

		    for(var i=0;i<body.fights.length;i++){
		    	if (body.fights[i].zoneName == "the Weapon's Refrain (Ultimate)") {
		    		//最初の戦闘開始時間
		    		if (battleStart == 0){
		    			battleStart = body.fights[i].start_time;
		    		}
		    		//最後の戦闘開始時間
		    		battleEnd = body.fights[i].end_time;
		    		//総戦闘数カウント
		    		battleCount = battleCount +1;
		    		//戦闘時間
		    		battleTime = body.fights[i].end_time - body.fights[i].start_time;
		    		//総戦闘時間カウント
		    		battleTimeSum = battleTimeSum + battleTime;

		    		//戦闘％
		    		fightPercentage = (10000 - body.fights[i].fightPercentage) / 100;

		    		//到達フェーズカウント
		    		if(body.fights[i].lastPhaseForPercentageDisplay == 1){
		    			phase1Count = phase1Count + 1;
		    		}else if(body.fights[i].lastPhaseForPercentageDisplay == 2){
		    			phase2Count = phase2Count + 1;
		    		}else if(body.fights[i].lastPhaseForPercentageDisplay == 3){
		    			phase3Count = phase3Count + 1;
		    		}else if(body.fights[i].lastPhaseForPercentageDisplay == 4){
		    			phase4Count = phase4Count + 1;
		    		}else if(body.fights[i].lastPhaseForPercentageDisplay == 5){
		    			phase5Count = phase5Count + 1;
		    		}else{
		    			phase0Count = phase0Count + 1;
		    		}

			    	//時間を計算
			    	//if (longTime < battleTime){
			    	if (maxFightPercentage < fightPercentage){
			    		longTime = battleTime;
			    		maxFightPercentage = fightPercentage;
			    		longId = body.fights[i].id;
			    		bossPercentage = body.fights[i].bossPercentage / 100;
			    		//fightPercentage = (10000 - body.fights[i].fightPercentage) / 100;
			    		if(body.fights[i].lastPhaseForPercentageDisplay == 1){
			    			lastPhaseForPercentageDisplay = 'ガルーダ';
			    		}else if(body.fights[i].lastPhaseForPercentageDisplay == 2){
			    			lastPhaseForPercentageDisplay = 'イフリート';
			    		}else if(body.fights[i].lastPhaseForPercentageDisplay == 3){
			    			lastPhaseForPercentageDisplay = 'タイタン';
			    		}else if(body.fights[i].lastPhaseForPercentageDisplay == 4){
			    			lastPhaseForPercentageDisplay = '変態サンクレッド';
			    		}else if(body.fights[i].lastPhaseForPercentageDisplay == 5){
			    			lastPhaseForPercentageDisplay = 'アルテマウェポン';
			    		}
			    	}
			    }
		    }
		    if(longId != 0 && postFlag){
		    	battleTimeAve = Math.round((battleTimeSum / battleCount) / 1000);

			   	//より細かい詳細
			   	retStr = retStr + unixtimeToDate(Math.round((reportStart + battleStart) / 1000)) + ',' +
			   							unixtimeToDate(Math.round((reportStart + battleEnd) / 1000)) + ',' +
			   							battleCount + ',' +
			   							toHmsSpan(Math.round(battleTimeSum / 1000)) + ',' +
			   							toHmsSpan(Math.round(battleTimeSum / 1000) + (60 * battleCount) ) + ',' +
			   							toHmsSpan(battleTimeAve) + ',' +
			   							toHmsSpan(Math.round(longTime / 1000)) + ',' +
			   							battleTimeAve + ',' +
			   							Math.round(longTime / 1000) + ',' +
			   							'https://www.fflogs.com/reports/' + postUrl.substr(31,16) +'#fight=' + longId + ',' +
			   							lastPhaseForPercentageDisplay + ',' +
			   							bossPercentage + ',' +
			   							maxFightPercentage + ',' +
			   							phase1Count + ',' +
			   							phase2Count + ',' +
			   							phase3Count + ',' +
			   							phase4Count + ',' +
			   							phase5Count + ',' +
			   							phase0Count + '\r\n';
			   	//日付保持（休み判定用）
			   	//writeDay = unixtimeToDate(Math.round((reportStart + battleStart) / 1000));
			   	//writeDay = writeDay.split(' ')[0] + ' 00:00:00';
			}

		    return retStr;
		}
	}

	return retMainStr;
}


function unixtimeToDate(ut) {
	var TZ = +0;
  //var TZ = +9;
	var tD = new Date( ut * 1000 );
	tD.setTime( tD.getTime() + (60*60*1000 * TZ) );

	var y = tD.getFullYear();
	var m = padZero(tD.getMonth()+1);
	var d = padZero(tD.getDate());
	var result = y + "/" + m + "/" + d;

	//時
    var hours = padZero(tD.getHours());
    //分
    var minutes = padZero(tD.getMinutes());
    //秒
    var seconds = padZero(tD.getSeconds());

	result = y + "/" + m + "/" + d + " " + hours + ":" + minutes + ":" + seconds;

	return result;
	function padZero(v) {
		if (v < 10) {
			return "0" + v;
		} else {
			return v;
		}
	}
}

function toHms(t) {
	var hms = "";
	var oh = t / 3600 | 0;
	var m = t % 3600 / 60 | 0;
	var s = t % 60;
	var h;
	if (oh >= 24){
		h = oh - 24;
	}else{
		h = oh;
	}
	hms = padZero(h) + ":" + padZero(m) + ":" + padZero(s) + "";

	return hms;

	function padZero(v) {
		if (v < 10) {
			return "0" + v;
		} else {
			return v;
		}
	}
}

function toHmsSpan(t) {
	var hms = "";
	var oh = t / 3600 | 0;
	var m = t % 3600 / 60 | 0;
	var s = t % 60;
	var h;
	if (oh >= 24){
		h = oh - 24;
	}else{
		h = oh;
	}
	if (h != 0) {
		hms = padZero(h) + "時間" + padZero(m) + "分" + padZero(s) + "秒";
	} else if (m != 0) {
		hms = m + "分" + padZero(s) + "秒";
	} else {
		hms = s + "秒";
    }

	return hms;

	function padZero(v) {
		if (v < 10) {
			return "0" + v;
		} else {
			return v;
		}
	}
}

//random
function rnum(a,b){
 	return Math.floor(Math.random() * (b - a + 1) + a);
}

const ShowGameTitle = function(client)  {
	var a = 0;
	var b = 50;
	var x = Math.floor(Math.random() * (b - a + 1) + a);
	x = 1;
	//console.log('こん');
	//let channel = message.channel;
	//let author = message.author.username;
	//let reply_text = 'こんばんわ。${author}様。';
	if (x == 0) {
		ActiveGame = 'YouTube';
		ActiveGameType = 'WATCHING';
	} else if(x == 1) {
		ActiveGame = 'FINAL FANTASY XIV';
		ActiveGameType = 'PLAYING';
	} else if(x == 2) {
		ActiveGame = 'UNICORN';
		ActiveGameType = 'LISTENING';
	} else if(x == 3) {
		ActiveGame = 'ポプテピピック';
		ActiveGameType = 'WATCHING';
	} else if(x == 4) {
		ActiveGame = 'Dead by Daylight';
		ActiveGameType = 'PLAYING';
	} else if(x == 5) {
		ActiveGame = 'Overwatch';
		ActiveGameType = 'PLAYING';
	} else if(x == 6) {
		ActiveGame = 'Rainbow Six:Siege';
		ActiveGameType = 'PLAYING';
	} else if(x == 7) {
		ActiveGame = 'Identity V';
		ActiveGameType = 'PLAYING';
	} else if(x == 8) {
		ActiveGame = 'とあるバラエティヒカセンの悲劇';
		ActiveGameType = 'WATCHING';
	} else if(x == 9) {
		ActiveGame = '竹林の謎';
		ActiveGameType = 'WATCHING';
	} else if(x == 10) {
		ActiveGame = 'ララフェルの食べ方　しゃのん編';
		ActiveGameType = 'WATCHING';
	} else if(x == 11) {
		ActiveGame = 'おいしいかぼちゃの煮つけ方 ' + rnum(1,100) + '話';
		ActiveGameType = 'WATCHING';
	} else if(x == 12) {
		ActiveGame = 'The gorilla king Rokupo.';
		ActiveGameType = 'WATCHING';
	} else if(x == 13) {
		ActiveGame = '愛人LS潜入調査！';
		ActiveGameType = 'WATCHING';
	} else if(x == 14) {
		var wa = '';
		var x3 = rnum(0,6);
		if (x3 == 0) {
			wa = '東京';
		} else if (x3 == 1) {
			wa = '京都';
		} else if (x3 == 2) {
			wa = '人誅';
		} else if (x3 == 3) {
			wa = '追憶';
		} else if (x3 == 4) {
			wa = '星霜';
		} else if (x3 == 5) {
			wa = '新京都';
		} else if (x3 == 6) {
			wa = '昼下がりの悲劇';
		}
		ActiveGame = 'わたしはにゃん！かわいいにゃん！' + wa + '編';
		ActiveGameType = 'WATCHING';
	} else if(x == 15) {
		ActiveGame = '世界のふぐ ベーリング海峡編';
		ActiveGameType = 'WATCHING';
	} else if(x == 16) {
		ActiveGame = 'お煎餅を食べながらYouTube';
		ActiveGameType = 'WATCHING';
	} else if(x == 17) {
		ActiveGame = 'お蕎麦をすすりながらYouTube';
		ActiveGameType = 'WATCHING';
	} else if(x == 18) {
		ActiveGame = '牛乳を飲みながらYouTube';
		ActiveGameType = 'WATCHING';
	} else if(x == 19) {
		ActiveGame = 'こたつで丸くなりながらYouTube';
		ActiveGameType = 'WATCHING';
	} else if(x == 20) {
		ActiveGame = 'ウンバボ族の逆襲';
		ActiveGameType = 'WATCHING';
	} else {
		ActiveGame = 'YouTube';
		ActiveGameType = 'WATCHING';
	}

	client.user.setActivity(ActiveGame, { type: ActiveGameType })
		.catch(console.error);

}


const verifyCharacter = async (message,itemname) => {
	var retStr = '';
	//find the character with their name and server
	let res1 = await xiv.search(itemname); //case insensitive server names, btw ;)
	for(var ti=0;ti<res1.results.length;ti++){
		if(res1.results[ti].url_type == 'Item'){
			//console.log(res1.results[ti].id);
			//console.log(res1.results[ti].name);
			var iname = res1.results[ti].name;
			var lowPrice = 9999999999999;
			var lowPriceTotal;
			var lowQuantity;
			var lowServer = '';
			//検索開始
			let res2 = await xiv.market.get(res1.results[ti].id,{dc: 'mana'});
			//検索OK
			Object.keys(res2).forEach(function (key) {
			  for(var ti=0;ti<res2[key].prices.length;ti++){
			  	  if(lowPrice > res2[key].prices[ti].price_per_unit){
				  	  lowPrice = res2[key].prices[ti].price_per_unit;
				  	  lowPriceTotal = res2[key].prices[ti].price_total;
				  	  lowQuantity = res2[key].prices[ti].quantity;
				  	  lowServer = key;
				  }
			  }
			});

			if(lowPrice == 9999999999999){
				//console.log(res1.results[ti].name + 'はデータが取得できませんでした・・・');
			}else{
				if(lowQuantity == 1){
					retStr = retStr + 'さっき' + res1.results[ti].name + 'が' + lowServer+'サーバーで'+lowPrice.toLocaleString()+'GILで売ってのを見ました。\n';
				}else{
					retStr = retStr + 'さっき' + res1.results[ti].name + 'が' + lowServer+'サーバーで1つ'+lowPrice.toLocaleString()+'GILで'+lowQuantity.toLocaleString()+'個セットで売ってるの見ました。（'+lowPriceTotal.toLocaleString()+'GIL）\n';
				}
			}
		}
	}
	if(retStr != ''){
		if(message == null){
			console.log(retStr);
		}else{
			message.channel.send(retStr);
		}
	}else{
		if(message == null){
			console.log('「'+itemname+'」はどこにも売ってませんでした・・・人気で売り切れてるのかもねー。もしくはそんなもの存在しないとか。');
		}else{
			message.channel.send('「'+itemname+'」はどこにも売ってませんでした・・・人気で売り切れてるのかもねー。もしくはそんなもの存在しないとか。');
		}
	}
}

const ItemSearch = async (message,itemname) => {
	let res1 = await xiv.search(itemname); //case insensitive server names, btw ;)
	for(var ti=0;ti<res1.results.length;ti++){
		console.log(res1.results[ti]);
	}
}

function getHtml(url){

	var request = require('sync-request');

	var response = request('GET', url);

	console.log(response.getBody().toString());
	// or
	console.log(response.body.toString());

	return response;
}



function getDamegeDoneAll(){

	var logsUrls = {};
	var syncrequestAll = require('sync-request');
	var getUrlAll = 'https://www.fflogs.com:443/v1/reports/user/CroMilk2?zone=30&api_key=0307d08a790e241745f7bba2b81f1f8b';

	var allReport = httpGetAll(getUrlAll);

	function httpGetAll(url){
	  var response = syncrequestAll(
	    'GET',
	    url
	    );
	    var retStr = "";
		var body = JSON.parse(response.body.toString());
		//console.log(body);
		for(var i=0;i<body.length;i++){
	    	if (body[i].zone == 30) {
	    		//console.log('https://www.fflogs.com/reports/' + body[i].id + '/');
	    		logsUrls['C' + body[i].start + body[i].id] = 'https://www.fflogs.com/reports/' + body[i].id + '/';
	    	}
	    }
	}
	var retMainStr = "戦闘開始日時,戦闘終了日時,戦闘回数,総戦闘時間,総戦闘時間_フロー待ち等1分含む,戦闘平均時間,最長戦闘時間,最長戦闘URL,最長進捗ボス,最長進捗ボス%,全体進捗率,ガルーダまで到達,イフリートまで到達,タイタンまで到達,荒ぶるナッツイーターまで到達,アルテマウェポンまで到達,ゴミの戦い\r\n";
	var result = {};
	var key = Object.keys(logsUrls);
	key.sort();
	for( var i = 0; i < key.length; i++ ) {
    	result[ key[i] ] = logsUrls[ key[i] ];
	}

	for(var key in result) {

		//Object.keys(result).forEach( function(value) {

	   // console.log( value + '：' + this[value] );

		var postUrl = result[key];

		var syncrequest = require('sync-request');
		var returnCode;
		var getUrl = 'https://www.fflogs.com/v1/report/fights/' + postUrl.substr(31,16) +'?api_key=0307d08a790e241745f7bba2b81f1f8b';

		//retMainStr = retMainStr +
		var body = httpGet(getUrl);
		function httpGet(url){
			var response = syncrequest('GET',url);
			return JSON.parse(response.body.toString());
		}

		var retStr = "";
		var reportStart = body.start;
	    var reportEnd = body.end;
	    var reportId = postUrl.substr(31,16);
	    var fightId = 0;
	    var battleStart = 0;
	    var battleEnd = 0;

	    //メンバーチェック
	    var postFlag = false;
	    for(var f=0;f<body.friendlies.length;f++){
	    	if(body.friendlies[f].name == "Cro Milk"){
	    		postFlag = true;
	    	}
	    }

	    for(var i=0;i<body.fights.length;i++){
	    	if (body.fights[i].zoneName == "The Weapon's Refrain (Ultimate)") {

	    		fightId = body.fights[i].id;
	    		//最初の戦闘開始時間
	    		battleStart = body.fights[i].start_time;
	    		//最後の戦闘開始時間
	    		battleEnd = body.fights[i].end_time;
				//console.log(reportId + ',' + fightId + ',' + reportStart + ',' + battleStart + ',' + battleEnd)
				//console.log(getLogsRepotDamegeDone(reportId,fightId,reportStart,battleStart,battleEnd,1));

				//これで動くんだけど重たすぎて封印↓↓↓↓↓
				//retStr = retStr + getLogsRepotDamegeDone(reportId,fightId,reportStart,battleStart,battleEnd,1);
				//retStr = retStr + getLogsRepotDamegeDone(reportId,fightId,reportStart,battleStart,battleEnd,2);
				//retStr = retStr + getLogsRepotDamegeDone(reportId,fightId,reportStart,battleStart,battleEnd,3);
				//retStr = retStr + getLogsRepotDamegeDone(reportId,fightId,reportStart,battleStart,battleEnd,4);
				//retStr = retStr + getLogsRepotDamegeDone(reportId,fightId,reportStart,battleStart,battleEnd,5);
		    }
		    break;
	    }






	}
	//console.log(getLogsRepotDamegeDone('vApYfzLhx1wryVX3',1,1557540314774,45703292,46107564,1));

	return retMainStr;
}


function getLogsRepotDamegeDone(reportId,fightId,reportStart,battleStart,battleEnd,phase){
	//unixtimeToDate(Math.round((reportStart + battleStart) / 1000))

	var request = require('sync-request');
	const jsdom = require('jsdom');
	const { JSDOM } = jsdom;
	const url = 'https://www.fflogs.com/reports/table/damage-done/tvxy74WLnZDwfzq1/1/73941740/74008053/source/0/0/0/0/0/0/-1.0.-1/0/Any/Any/0/1042?phase=1&';
	var response = request('GET', url);
    const dom = new JSDOM(response.getBody().toString());
    //console.log(dom.window.document.querySelector('#item > li:last-child').textContent);
    //var str = dom.window.document.querySelector('#main-table-0').textContent;
    var names = dom.window.document.querySelectorAll('#main-table-0 a');
    var dpss = dom.window.document.querySelectorAll('#main-table-0 .main-table-number');
    var amountPercents = dom.window.document.querySelectorAll('#main-table-0 .report-amount-percent');
    var amountTotals = dom.window.document.querySelectorAll('#main-table-0 .report-amount-total');

    var csv = "";
    for (var i=0, l=dpss.length; i<l; i++) {
    	csv = csv + reportId + ',' + fightId + ',' + unixtimeToDate(Math.round((reportStart + battleStart) / 1000)) + ',' + unixtimeToDate(Math.round((reportStart + battleEnd) / 1000)) + ',' + phase + ',';
    	if(typeof names[i] === 'undefined'){
    		csv = csv + 'total,';
    	}else{
    		csv = csv + names[i].textContent.replace(/\s/g, "") + ',';
		}
		if(typeof dpss[i] === 'undefined'){
    		csv = csv + ',';
    	}else{
    		csv = csv + dpss[i].textContent.replace(/\s/g, "") + ',';
	    }
	    if(typeof amountPercents[i] === 'undefined'){
    		csv = csv + ',';
    	}else{
    		csv = csv + amountPercents[i].textContent.replace(/\s/g, "") + ',';
	    }
	    if(typeof amountTotals[i] === 'undefined'){
    		csv = csv + '\r\n';
    	}else{
    		csv = csv + amountTotals[i].textContent.replace(/\s/g, "") + '\r\n';
		}

    }
	return csv;
}




//OneDriveから一番頑張った回のダウンロードリンクを取得する（20190520_223004形式）
function oneDrive(datetime){

	//OneDrive =======
	var request = require('request');
	var fs = require('fs');
	var url = 'https://login.live.com/oauth20_token.srf';
	var client_id = 'd598d8eb-ba1e-47f5-8585-a9fd0de7700a';
	var client_secret = 'bvklRJNXRR^*ddbG65194#|';

	var refresh_token = fs.readFileSync('refresh_token.txt', 'utf-8');
	request.post({
		url: url,
		form: {
		client_id: client_id,
		//        client_secret: client_secret,
		refresh_token: refresh_token,
		grant_type: 'refresh_token'
		},
		json: true,
		headers: {  'Content-Type': 'application/x-www-form-urlencoded' }
	}, function(error, response, d){
		if (!error && response.statusCode == 200) {
			//  アクセストークンの保存
			fs.writeFileSync('access_token.txt', d.access_token);
		} else {
			console.log(response);
		}
	});


	var root = 'https://api.onedrive.com/v1.0';
	var access_token = fs.readFileSync('access_token.txt', 'utf-8');


	var syncrequest = require('sync-request');
	var returnCode;

	//retMainStr = retMainStr +
	var body = httpGet(root+'/drive/items/C6D540071B1A1DC6!1590/children');
	function httpGet(url){
		var response = syncrequest('GET'
		,url
	,{headers: {Authorization: 'Bearer ' + access_token}
		,json: true
		});
		return JSON.parse(response.body.toString());
	}
	var check = datetime;
	var sa = 999999999;
	var filename;
	var downloadUrl;
	for(var i=0;i<body.value.length;i++){
		var str = body.value[i].name;
		var srt2;
		var utime;
		if (/20.*\.mp4/.test(str)) {
			//console.log(str);
			srt2 = str.substr(0,4) + '-' + str.substr(4,2) + '-' + str.substr(6,2) + ' ' + str.substr(9,2) + ':' + str.substr(11,2) + ':' + str.substr(13,2);
			utime = Date.parse(srt2);
			//console.log(utime);
			if (Math.abs(utime - check) < sa){
				sa = Math.abs(utime - check);
				filename = str;
				//console.log("     " + filename);
				downloadUrl = body.value[i]['@content.downloadUrl'];
			}

		}
	}
	return downloadUrl;


	//================

}



async function sample() {
    try {

      const {GoogleSpreadsheet} = require('google-spreadsheet');
      //var GoogleSpreadsheet = require("google-spreadsheet");
      var async = require("async");
      var doc = new GoogleSpreadsheet("1u6-z3S2MgWB6ShP-fLWFEqZNWw_0F_kxm5D561zpf7k"); // ここはスプレッドシートごとに書き換える必要がある
      var sheet;

      console.log("起動：");
      async.series(
        [
          function setAuth(step) {
            var creds = require("./google-generated-creds.json");
            doc.useServiceAccountAuth(creds, step);
          },
          function getInfoAndWorksheets(step) {
            doc.getInfo(function(err, info) {
              sheet = info.worksheets[0];
              step();
            });
          },
          function workingWithCells(step) {
            const COLUMNS = {
              name: 1,
              price: 2,
            };
            sheet.getCells(
              {
                "min-row": 2,
                "max-row": 5,
                "return-empty": true
              },
              function(err, cells) {
                for (let i = 0; i < cells.length / sheet.colCount; i += 1) {
                  const name = cells[i * sheet.colCount + COLUMNS.name].value;
                  const price = cells[i * sheet.colCount + COLUMNS.price].value;
                  console.log(name + " " + price);
                }
              }
            );
          }
        ],
        function(err) {
          if (err) {
            console.log("Error: " + err);
          }
        }
      );


        return Promise.resolve(0);
    } catch(error) {
        console.error(error);
        return Promise.reject(1);
    }
}

/*
client.on('guildMemberUpdate', (oldMember,newMember) => {

	client.channels.get("566923821727088652").sendMessage("ステータスが更新されましたよ");
	console.log('oldMember===================');
	console.log(oldMember);
	console.log('newMember===================');
	console.log(newMember);

});
*/
/*
client.on('presenceUpdate', (oldMember,newMember) => {

	client.channels.get("566923821727088652").sendMessage("presenceが更新されましたよ");
	console.log('oldMember===================');
	console.log(oldMember);
	console.log('newMember===================');
	console.log(newMember);
});
*/
/*
client.on('userNoteUpdate', (user,oldNote,newNote) => {
	client.channels.get("566923821727088652").sendMessage("userNoteUpdateが更新されましたよ");
	console.log('oldUserNoteUpdate===================');
	console.log(oldNote);
	console.log('newUserNoteUpdate===================');
	console.log(newNote);
});*/
/*
client.on('channelPinsUpdate', (channel,time) => {
	client.channels.get("566923821727088652").sendMessage("channelPinsUpdateが更新されましたよ");
	console.log('channelPinsUpdate===================');
});

client.on('channelUpdate', (oldChannel,newChannel) => {
	client.channels.get("566923821727088652").sendMessage("channelUpdateが更新されましたよ");
	console.log('channelUpdate===================');
});
client.on('clientUserGuildSettingsUpdate', (clientUserGuildSettings) => {
	client.channels.get("566923821727088652").sendMessage("clientUserGuildSettingsUpdateが更新されましたよ");
	console.log('clientUserGuildSettingsUpdate===================');
});
client.on('clientUserSettingsUpdate', (clientUserSettings) => {
	client.channels.get("566923821727088652").sendMessage("clientUserSettingsUpdateが更新されましたよ");
	console.log('clientUserSettingsUpdate===================');
});
client.on('emojiUpdate', (oldEmoji,newEmoji) => {
	client.channels.get("566923821727088652").sendMessage("emojiUpdateが更新されましたよ");
	console.log('emojiUpdate===================');
});
client.on('guildMemberUpdate', (oldMember,newMember) => {
	client.channels.get("566923821727088652").sendMessage("guildMemberUpdateが更新されましたよ");
	console.log('guildMemberUpdate===================');
});
client.on('guildUpdate', (oldGuild,newGuild) => {
	client.channels.get("566923821727088652").sendMessage("guildUpdateが更新されましたよ");
	console.log('guildUpdate===================');
});
client.on('messageUpdate', (oldMessage,newMessage) => {
	client.channels.get("566923821727088652").sendMessage("messageUpdateが更新されましたよ");
	console.log('messageUpdate===================');
});
client.on('presenceUpdate', (oldMember,newMember) => {
	client.channels.get("566923821727088652").sendMessage("presenceUpdateが更新されましたよ");
	console.log('presenceUpdate===================');
});
client.on('roleUpdate', (oldRole,newRole) => {
	client.channels.get("566923821727088652").sendMessage("roleUpdateが更新されましたよ");
	console.log('roleUpdate===================');
});
client.on('userNoteUpdate', (user,oldNote,newNote) => {
	client.channels.get("566923821727088652").sendMessage("userNoteUpdateが更新されましたよ");
	console.log('userNoteUpdate===================');
});
client.on('userUpdate', (oldUser,newUser) => {
	client.channels.get("566923821727088652").sendMessage("userUpdateが更新されましたよ");
	console.log('userUpdate===================');
});
client.on('voiceStateUpdate', (oldMember,newMember) => {
	client.channels.get("566923821727088652").sendMessage("voiceStateUpdateが更新されましたよ");
	console.log('voiceStateUpdate===================');
});
*/
/*
client.on('debug', (info) => {
	console.log(info);
});
client.on('error', (error) => {
	console.log(error);
});
client.on('wran', (info) => {
	console.log(info);
});
*/

//ItemSearch(null,'ポーション');
//verifyCharacter(null,'ンスピア');

/*
	ああああ＝＝＝＝＝＝＝＝
general
566923821727088652

絶ふぐ＝＝＝＝＝＝＝＝＝
logs置き場
573786857574498307

参考リンク等
566315857009967104

<client>.channels.get("573786857574498307").sendMessage("メッセージ");

https://www.fflogs.com/v1/docs/

https://www.fflogs.com:443/v1/report/fights/yCzmLP24tKH6vFAh?api_key=0307d08a790e241745f7bba2b81f1f8b
https://www.fflogs.com:443/v1/report/fights/tvxy74WLnZDwfzq1?api_key=0307d08a790e241745f7bba2b81f1f8b




https://www.fflogs.com:443/v1/reports/user/Cro%20Milk?api_key=0307d08a790e241745f7bba2b81f1f8b
https://www.fflogs.com:443/v1/reports/user/Roa%20Nautilus?api_key=0307d08a790e241745f7bba2b81f1f8b
https://www.fflogs.com:443/v1/reports/user/Cro%20Milk?start=0&end=0?api_key=0307d08a790e241745f7bba2b81f1f8b

GET /reports/user/{userName}

https://www.fflogs.com/reports/yCzmLP24tKH6vFAh#fight=8&type=damage-done


＝みれるやつ＝
zones
https://www.fflogs.com:443/v1/zones?api_key=0307d08a790e241745f7bba2b81f1f8b&timeframe=historical

Classes
https://www.fflogs.com:443/v1/classes?api_key=0307d08a790e241745f7bba2b81f1f8b&timeframe=historical

/rankings/encounter/
https://www.fflogs.com/v1/rankings/encounter/1042?api_key=0307d08a790e241745f7bba2b81f1f8b&timeframe=historical&page=1&class=3

（数字はzonesのencountersID）page105まであった（10536）


https://www.fflogs.com:443/v1/rankings/encounter/1042

rankings/character
https://www.fflogs.com:443/v1/rankings/character/Cro%20Milk/anima/jp?api_key=0307d08a790e241745f7bba2b81f1f8b&timeframe=historical
https://www.fflogs.com:443/v1/rankings/character/Roa%20Nautilus/anima/jp?api_key=0307d08a790e241745f7bba2b81f1f8b&timeframe=historical

https://www.fflogs.com:443/v1/rankings/character/Roa%20Nautilus/anima/jp?zone=1042&api_key=0307d08a790e241745f7bba2b81f1f8b&timeframe=historical


parses/character
https://www.fflogs.com:443/v1/parses/character/Cro%20Milk/anima/jp?api_key=0307d08a790e241745f7bba2b81f1f8b&timeframe=historical
https://www.fflogs.com:443/v1/parses/character/Roa%20Nautilus/anima/jp?api_key=0307d08a790e241745f7bba2b81f1f8b&timeframe=historical


/reports/user/{userName}　名前はLogs登録名
https://www.fflogs.com:443/v1/reports/user/CroMilk2?zone=23&api_key=0307d08a790e241745f7bba2b81f1f8b

/report/fights/{code}
https://www.fflogs.com:443/v1/report/fights/yCzmLP24tKH6vFAh?api_key=0307d08a790e241745f7bba2b81f1f8b
https://www.fflogs.com:443/v1/report/fights/tvxy74WLnZDwfzq1?api_key=0307d08a790e241745f7bba2b81f1f8b


/report/events/{view}/{code}　viewは'summary', 'damage-done', 'damage-taken', 'healing', 'casts', 'summons', 'buffs', 'debuffs', 'deaths', 'threat', 'resources', 'interrupts' and 'dispels'
https://www.fflogs.com:443/v1/report/events/summary/yCzmLP24tKH6vFAh?api_key=0307d08a790e241745f7bba2b81f1f8b&sourceid=1
https://www.fflogs.com:443/v1/report/events/summary/tvxy74WLnZDwfzq1?api_key=0307d08a790e241745f7bba2b81f1f8b&sourceid=1
https://www.fflogs.com:443/v1/report/events/summary/f2PpkX1KDY6dHbNa?api_key=0307d08a790e241745f7bba2b81f1f8b&sourceid=1


/report/tables/{view}/{code}
https://www.fflogs.com:443/v1/report/tables/damage-done/yCzmLP24tKH6vFAh?api_key=0307d08a790e241745f7bba2b81f1f8b
https://www.fflogs.com:443/v1/report/tables/damage-done/tvxy74WLnZDwfzq1?api_key=0307d08a790e241745f7bba2b81f1f8b


細かいデータ？
https://www.fflogs.com/reports/graph/damage-done/vApYfzLhx1wryVX3/5/47165826/47570660/source/0/0/0/0/0/0/-1.0.-1/0/Any/Any/0/0?phase=1&
https://www.fflogs.com/reports/graph/damage-done/vApYfzLhx1wryVX3/5/47165826/47570660/source/0/0/0/0/0/0/-1.0.-1/0/Any/Any/0/0?phase=2&
https://www.fflogs.com/reports/graph/damage-done/vApYfzLhx1wryVX3/5/47165826/47570660/source/0/0/0/0/0/0/-1.0.-1/0/Any/Any/0/0?phase=3&
https://www.fflogs.com/reports/graph/damage-done/vApYfzLhx1wryVX3/5/47165826/47570660/source/0/0/0/0/0/0/-1.0.-1/0/Any/Any/0/0?phase=4&
https://www.fflogs.com/reports/graph/damage-done/vApYfzLhx1wryVX3/5/47165826/47570660/source/0/0/0/0/0/0/-1.0.-1/0/Any/Any/0/0?phase=5&




https://www.fflogs.com/reports/graph/damage-done/tvxy74WLnZDwfzq1/1/73941740/74008053/source/0/0/0/0/0/0/-1.0.-1/0/Any/Any/0/0?phase=1&

//これでよいのでは
https://www.fflogs.com/reports/table/damage-done/tvxy74WLnZDwfzq1/1/73941740/74008053/source/0/0/0/0/0/0/-1.0.-1/0/Any/Any/0/1042?phase=1&
　　　　　　　　　　　　　　　　　　　　　　　　　ID              fightID/Start/End
*/

/*
https://discordapp.com/oauth2/authorize?client_id=602672878047199232&scope=bot&permissions=0
*/
