'use strict';
game.import("extension", function (lib, game, ui, get, ai, _status) {
  return {
    name: "极略",
    editable: false,
    content: function (config, pack) {
      console.time(_status.extension);
      if (pack.changelog) {
        var testCode = `\
let a = 1;
const b = 1;
(() => a + b)();`;
        try {
          eval(testCode);
        } catch (error) {
          if (!lib.config["extension_极略_compatibilityAlert"]) {
            game.saveConfig("extension_极略_compatibilityAlert", true);
            alert("极略与你的设备或是无名杀版本不兼容", "极略");
          }
          pack.changelog = `<span style="font-weight:bold;">极略与你的设备不兼容，因此导入被终止了。</span><br>` + pack.changelog;
          return;
        }
        game.showExtensionChangeLog(pack.changelog);
      }
      if (config.debug) {
        lib.arenaReady.push(() => {
          lib.config.characters = window.__configCharactersBackup.slice();
        });
      }
      if (!_status.evaluatingExtension) {
        var callback = () => {
          if (!lib.config["extension_极略_wrongExtensionNameAlert"]) {
            game.saveConfig("extension_极略_wrongExtensionNameAlert", true);
            alert('万能导入/玄武版导入时需将拓展名设置为极略！你是不是设置错了？');
          }
        };
        if (lib.device) {
          window.resolveLocalFileSystemURL(lib.assetURL, function (entry) {
            entry.getDirectory('extension/极略/', {}, function (dirEntry) { }, callback);
          });
        } else {
          fetch(lib.assetURL + "extension/极略/extension.js").catch(e => {
            setTimeout(callback, 500);
          });
        }
      } else {
        game.saveConfig("extension_极略_wrongExtensionNameAlert", false);
      }
      if (config.simple_name === 'hide') {
        get.slimName = function (str) {

          var str2 = lib.translate[str];
          if (lib.translate[str + '_ab']) str2 = lib.translate[str + '_ab'];
          if (!str2) return '';
          var str3 = str2.replace(/^(\s|[☆A-Z])*/, "");
          if (str3 != "") {
            str2 = str3;
          }
          if (str2.startsWith('手杀')) {
            str2 = str2.slice(2);
          }
          return get.verticalStr(str2, true);
        };
      }
      lib.config.all.cards.push('jlsg_qs');
      lib.config.all.characters.push('jlsg_sk', 'jlsg_sr', 'jlsg_soul', 'jlsg_sy');
      lib.skill._jlsg_die_audio = { // 死亡语音
        trigger: { player: 'dieBegin' },
        //direct:true,
        priority: 2,
        forced: true,
        unique: true,
        popup: false,
        filter: function (event, player) {
          return player.name.includes('jlsg');
        },
        content: function () {
          game.playAudio('..', 'extension', '极略', 'die', trigger.player.name);
          // trigger.audioed = true;
        },
      };
      var characterReplaceExclude = {
        jlsgsk_luzhi: 'yl_luzhi',
        jlsgsk_huangyueying: 'jsp_huangyueying',
        jlsgsk_simashi: 'jin_simashi',
        jlsgsk_simazhao: 'jin_simazhao',
        jlsgsk_jiangqin: 'jiangqing',
        jlsgsk_guanyu: 'jsp_guanyu',
        jlsgsk_jiping: 'sp_jiben',
        jlsgsk_mifuren: 'sp_mifuren',
        jlsgsk_hejin: 're_hejin',
        jlsgsk_zoushi: 're_zoushi',
        jlsgsk_kongrong: 'sp_kongrong',
        jlsgsk_machao: 'sp_machao',
        jlsgsk_caiwenji: 'sp_caiwenji',
      };
      var trivialSolveCharacterReplace = function (name, prefix = '') {
        var originalName = prefix + name.substring(name.lastIndexOf('_') + 1);
        if (name in characterReplaceExclude) {
          if (characterReplaceExclude[name]) {
            originalName = characterReplaceExclude[name];
          } else {
            return;
          }
        }
        if (originalName && lib.character[originalName]) {
          if (!lib.characterReplace[originalName]) {
            // console.log(originalName);
            lib.characterReplace[originalName] = [originalName, name];
          } else {
            lib.characterReplace[originalName].push(name);
          }
        }
      };
      var suppressDieAudio = function (name) {
        var cfile = lib.character[name];
        if (cfile) {
          if (cfile[4] === undefined) {
            cfile[4] = ['die_audio'];
          } else {
            cfile[4].add('die_audio');
          }
        }
      };
      for (var i of Object.keys(lib.characterPack['jlsg_sr'])) {
        trivialSolveCharacterReplace(i);
        suppressDieAudio(i);
      }
      for (var i of Object.keys(lib.characterPack['jlsg_sk'])) {
        trivialSolveCharacterReplace(i);
        suppressDieAudio(i);
      }
      for (var i of Object.keys(lib.characterPack['jlsg_soul'])) {
        trivialSolveCharacterReplace(i, 'shen_');
        suppressDieAudio(i);
      }
      for (var i of Object.keys(lib.characterPack['jlsg_sy'])) {
        suppressDieAudio(i);
        if (!lib.config.forbidai_user.contains(i))
          lib.config.forbidai.remove(i);
      }
      if (config.jlsg_identity_music_image && get.mode() != 'boss') {
        lib.arenaReady.push(function () {
          ui.backgroundMusic.volume = lib.config.volumn_background / 8;
          setTimeout(function () {
            ui.backgroundMusic.src = lib.assetURL + "extension/极略/jlsg_identity_music_image.mp3";
          }, 100);
          setInterval(function () {
            ui.backgroundMusic.src = lib.assetURL + "extension/极略/jlsg_identity_music_image.mp3";
          }, 137000);
        });
        lib.arenaReady.push(function () {
          ui.background.setBackgroundImage("extension/极略/jlsg_identity_music_image.jpg");
        });
      }
      if (config.jlsg_boss_music_image && get.mode() == 'boss') {
        lib.arenaReady.push(function () {
          ui.backgroundMusic.volume = lib.config.volumn_background / 8;
          setTimeout(function () {
            ui.backgroundMusic.src = lib.assetURL + "extension/极略/jlsg_boss_music_image.mp3";
          }, 100);
          setInterval(function () {
            ui.backgroundMusic.src = lib.assetURL + "extension/极略/jlsg_boss_music_image.mp3";
          }, 168000);
        });
        lib.arenaReady.push(function () {
          ui.background.setBackgroundImage("extension/极略/jlsg_boss_music_image.jpg");
        });
      }
      // prepare rank & rarity data
      // if (false) {
      if (lib.rank) {
        var retrieveFromTierMaker = function () {
          var result = $(".tier.sort").map(function () {
            var res = $(this).children().map(function () { return $(this).css("background-image").match(/jlsg\w+(?=jpg)/); });
            return res;
          });
          result = result.toArray().map(ss => ss.toArray());
          var ranks = ['s', 'ap', 'a', 'am', 'bp', 'b', 'bm', 'c', 'd'];
          var A = {};
          for (var i = 0; i != result.length; ++i) {
            A[ranks[i]] = result[i];
          }
          return JSON.stringify(A);
        };
        var rank = {
          s: [
            'jlsgsoul_diaochan',
            'jlsgsoul_guojia',
            'jlsgsoul_simahui',
            'jlsgsoul_simayi',
            'jlsgsoul_zhaoyun',
            'jlsgsoul_sunquan',
            'jlsgsr_huangyueying',
            'jlsgsoul_huangyueying',
            'jlsgsoul_sp_zhugeliang',
            'jlsgsk_caiwenji',
          ],
          ap: [
            'jlsgsr_lvbu',
            'jlsgsoul_caocao',
            'jlsgsoul_dianwei',
            'jlsgsoul_jiaxu',
            'jlsgsoul_guanyu',
            'jlsgsoul_liubei',
            'jlsgsoul_zhugeliang',
            'jlsgsoul_lvmeng',
            'jlsgsoul_luxun',
            'jlsgsoul_sunshangxiang',
            'jlsgsr_zhenji',
            'jlsgsr_sunshangxiang',
            'jlsgsr_lvmeng',
            'jlsgsr_luxun',
            'jlsgsr_daqiao',
            'jlsgsk_dongzhuo',
            'jlsgsk_guonvwang',
            'jlsgsoul_zhangliao',
            'jlsgsk_yuji',
            'jlsgsk_xizhicai',
            'jlsgsk_dongbai',
            'jlsgsk_xushi',
          ],
          a: [
            'jlsgsoul_zhouyu',
            'jlsgsoul_zuoci',
            'jlsgsr_simayi',
            'jlsgsr_guojia',
            'jlsgsr_diaochan',
            'jlsgsk_chengyu',
            'jlsgsk_sunqian',
            'jlsgsk_dongyun',
            'jlsgsk_yujin',
            'jlsgsk_simazhao',
            'jlsgsk_kuaiyue',
            'jlsgsk_zhangning',
            'jlsgsk_zhoutai',
          ],
          am: [
            'jlsgsk_zuoci',
            'jlsgsoul_lvbu',
            'jlsgsoul_xiahoudun',
            'jlsgsr_zhugeliang',
            'jlsgsr_zhangliao',
            'jlsgsr_liubei',
            'jlsgsoul_huatuo',
            'jlsgsr_huatuo',
            'jlsgsk_kongrong',
            'jlsgsk_lukang',
            'jlsgsk_xianglang',
            'jlsgsk_guanlu',
            'jlsgsk_zhanglu',
            'jlsgsk_yangxiu',
            'jlsgsk_zoushi',
            'jlsgsk_guansuo',
            'jlsgsk_baosanniang',
          ],
          bp: [
            'jlsgsoul_ganning',
            'jlsgsr_zhouyu',
            'jlsgsr_sunquan',
            'jlsgsr_machao',
            'jlsgsr_ganning',
            'jlsgsr_caocao',
            'jlsgsr_zhaoyun',
            'jlsgsk_chendao',
            'jlsgsk_guanxing',
            'jlsgsk_huangyueying',
            'jlsgsk_zumao',
            'jlsgsk_zhugejin',
            'jlsgsk_maliang',
            'jlsgsk_sunluyu',
            'jlsgsk_mizhu',
            'jlsgsr_xiahoudun',
            'jlsgsk_zhangren',
            'jlsgsk_zhangbu',
            'jlsgsk_heqi',
          ],
          b: [
            'jlsgsoul_zhangfei',
            'jlsgsoul_zhangjiao',
            'jlsgsr_zhangfei',
            'jlsgsr_guanyu',
            'jlsgsk_buzhi',
            'jlsgsk_caochong',
            'jlsgsk_dengzhi',
            'jlsgsk_dongxi',
            'jlsgsk_guanyu',
            'jlsgsk_feiyi',
            'jlsgsk_hejin',
            'jlsgsk_jiping',
            'jlsgsk_jiangqin',
            'jlsgsk_luji',
            'jlsgsk_miheng',
            'jlsgsk_zhuran',
            'jlsgsk_wangyi',
            'jlsgsk_luzhi',
            'jlsgsk_sunhao',
            'jlsgsk_zhoucang',
            'jlsgsk_zhangxiu',
            'jlsgsk_quancong',
            'jlsgsk_simashi',
            'jlsgsk_tianfeng',
            'jlsgsk_wenchou',
            'jlsgsk_xuyou',
            'jlsgsk_yanliang',
            'jlsgsk_wangping',
            'jlsgsk_zhangbao',
            'jlsgsr_xuzhu',
            'jlsgsk_zhugeguo',
          ],
          bm: [
            'jlsgsr_huanggai',
            'jlsgsk_caoren',
            'jlsgsk_bianfuren',
            'jlsgsk_huaxiong',
            'jlsgsk_liyan',
            'jlsgsk_lvlingqi',
            'jlsgsk_sunce',
            'jlsgsk_yuji',
            'jlsgsk_dingfeng',
            'jlsgsk_zangba',
            'jlsgsk_mifuren',
            'jlsgsk_machao',
          ],
          c: [
            'jlsgsk_gongsunzan',
            'jlsgsk_panfeng',
            'jlsgsk_mateng',
          ],
          d: [],
          rarity: {
            legend: [ // 传说
              'jlsgsk_yuji',
            ],
            epic: [ // 史诗
              "jlsgsk_zhangning",
              "jlsgsk_dongyun",
              "jlsgsk_tianfeng",
              "jlsgsk_jiangqin",
              "jlsgsk_zuoci",
              "jlsgsk_heqi",
              "jlsgsk_guanxing",
              "jlsgsk_sunqian",
              "jlsgsk_zhangbao",
              "jlsgsk_dongzhuo",
              "jlsgsk_zhanglu",
              "jlsgsk_quancong",
              "jlsgsk_chengyu",
              "jlsgsk_kuaiyue",
              "jlsgsk_luzhi",
              "jlsgsk_zoushi",
              "jlsgsk_mifuren",
              "jlsgsk_caiwenji",
              'jlsgsk_guansuo',
              'jlsgsk_baosanniang',
              'jlsgsk_dongbai',
            ],
            rare: [ // 稀有
              "jlsgsk_simashi",
              "jlsgsk_xianglang",
              "jlsgsk_luji",
              "jlsgsk_bianfuren",
              "jlsgsk_mateng",
              "jlsgsk_feiyi",
              "jlsgsk_dongxi",
              "jlsgsk_yujin",
              "jlsgsk_panfeng",
              "jlsgsk_zhangbu",
              "jlsgsk_maliang",
              "jlsgsk_chendao",
              "jlsgsk_zhuran",
              "jlsgsk_lukang",
              "jlsgsk_zhoutai",
              "jlsgsk_kongrong",
              "jlsgsk_caochong",
              "jlsgsk_simazhao",
              "jlsgsk_yangxiu",
              "jlsgsk_sunhao",
              "jlsgsk_zhugejin",
              "jlsgsk_zhangxiu",
              "jlsgsk_sunluyu",
              "jlsgsk_yuji",
              "jlsgsk_guonvwang",
              "jlsgsk_zhangren",
              "jlsgsk_mizhu",
              "jlsgsk_zangba",
              "jlsgsk_hejin",
              "jlsgsk_wangyi",
              "jlsgsk_guanyu",
              "jlsgsk_yanliang",
              "jlsgsk_machao",
              "jlsgsk_xushi",
            ],
            junk: [ // 平凡
              'jlsgsk_xuyou',
              'jlsgsk_wangping',
              "jlsgsk_caoren",
              "jlsgsk_huaxiong",
              "jlsgsk_sunce",
              "jlsgsk_dengzhi",
              "jlsgsk_zumao",
              "jlsgsk_gongsunzan",
              "jlsgsk_buzhi",
              "jlsgsk_jiping",
              "jlsgsk_miheng",
              "jlsgsk_liyan",
              "jlsgsk_huangyueying",
              "jlsgsk_zhoucang",
              "jlsgsk_dingfeng",
              "jlsgsk_lvlingqi",
              "jlsgsk_guanlu",
              'jlsgsr_machao',
            ],
          },
        };
        // soul characters reside in the highest rarity rank
        for (var name of Object.keys(lib.characterPack['jlsg_soul'])) {
          if (!Object.keys(rank.rarity).some(rarity => rank.rarity[rarity].contains(name))) {
            rank.rarity.legend.push(name);
          }
        }
        // sr characters drop a rank if srlose is enabled
        for (var name of Object.keys(lib.characterPack['jlsg_sr'])) {
          if (!Object.keys(rank.rarity).some(rarity => rank.rarity[rarity].contains(name))) {
            rank.rarity.rare.push(name);
          }
          if (config.srlose) {
            var ranks = Object.keys(rank);
            ranks.pop();
            for (var i = 0; i != ranks.length; ++i) {
              var theRank = ranks[i];
              var nameIdx = rank[theRank].indexOf(name);
              if (nameIdx != -1 && theRank != 'd') {
                rank[theRank].splice(nameIdx, 1);
                if (name == 'jlsgsr_lvbu') {
                  rank.b.push(name);
                } else {
                  rank[ranks[i + 1]].push(name);
                }
                break;
              }
            }
          } // config.srlose
        } // jlsg_sr
        var addRank = function (rank) {
          if (!lib.rank) return;
          for (var i in rank) {
            if (i == 'rarity') continue;
            lib.rank[i].addArray(rank[i]);
          }
          if (rank.rarity && lib.rank.rarity) {
            for (var i in rank.rarity) {
              if (lib.rank.rarity[i] === undefined) {
                lib.rank.rarity[i] = [];
              }
              lib.rank.rarity[i].addArray(rank.rarity[i]);
            }
          }
        };
        addRank(rank);
      } // lib.rank
      // 千幻聆音 (换肤)
      // temporarily disabled
      if (false && lib.qhlypkg) {
        lib.qhlypkg.push({
          isExt: true,//是否是扩展，一般填true
          filterCharacter: function (name) {
            return name.startsWith('jlsg');//判断此ID的武将是否属于此皮肤包
          },
          // isLutou: lib.config.xwLutou,//判断是否当前启用露头，没有露头皮肤可不需要此项。
          // lutouPrefix:'extension/极略/lutou/',//露头原皮皮肤前缀，标识露头原皮皮肤的位置。
          prefix: 'extension/极略/', //原皮前缀，标识原皮肤的位置。
          skin: {
            standard: 'extension/极略/skin/standard/',//可切换普通皮肤的前缀
            // lutou:'extension/极略/skin/lutou/',//可切换露头皮肤的前缀
          },
          audioOrigin: 'extension/极略/',//原技能配音位置
          // audio:'extension/极略/skin/audio/',//切换皮肤后的技能配音位置
          skininfo: {
            wushaungluanji: {
              title: '稀有',
              translation: '无双乱戟',
              info: '',
            },
            juemingyoulan: {
              title: '限定',
              translation: '绝命幽兰',
              info: '据说在某个神秘游戏里可以提升一点武将的体力上限。',
            },
            nagenanren: {
              title: '传说',
              translation: '那个男人',
              info: '',
            },
            huoshaowuchao: {
              title: '稀有',
              translation: '火烧乌巢',
              info: '',
            },
            zhengtaifenbu: {
              title: '史诗',
              translation: '正态分布',
              info: '据说在某个神秘游戏里可以使开局手牌数+2。',
            },
          }
        });
      }
      console.timeEnd(_status.extension);
    },
    precontent: function (config) {
      if (!config.enable) { return; }
      console.time(_status.extension + 'pre');
      if (config.debug) {
        window.__configCharactersBackup = lib.config.characters;
        lib.config.characters = ["jlsg_sk", "jlsg_sr", "jlsg_soul", "jlsg_sy"];
      }
      game.import('character', function () { // SK
        var jlsg_sk = {
          name: 'jlsg_sk',
          connect: true,
          characterSort: {
            jlsg_sk: {
              jlsg_tiangang: ['jlsgsk_xuyou', 'jlsgsk_dengzhi', 'jlsgsk_dongyun', 'jlsgsk_kuaiyue', 'jlsgsk_yuji'],
              jlsg_disha: ['jlsgsk_sunce', 'jlsgsk_caoren', 'jlsgsk_gongsunzan', 'jlsgsk_huaxiong', 'jlsgsk_zumao',
                'jlsgsk_miheng', 'jlsgsk_zhangbu', 'jlsgsk_guonvwang', 'jlsgsk_quancong', 'jlsgsk_mateng'],
              jlsg_renjie: ['jlsgsk_wangping', 'jlsgsk_buzhi', 'jlsgsk_maliang', 'jlsgsk_sunqian', 'jlsgsk_dongxi',
                'jlsgsk_luzhi', 'jlsgsk_mifuren', 'jlsgsk_xizhicai'],
              jlsg_pojun: ['jlsgsk_zhuran', 'jlsgsk_yanliang', 'jlsgsk_chendao', 'jlsgsk_dingfeng', 'jlsgsk_dongzhuo',
                'jlsgsk_yujin', 'jlsgsk_panfeng', 'jlsgsk_jiangqin', 'jlsgsk_guanxing', 'jlsgsk_guansuo',
                'jlsgsk_baosanniang', 'jlsgsk_dongbai', 'jlsgsk_xushi'],
              jlsg_yinyang: ['jlsgsk_zuoci', 'jlsgsk_guanlu', 'jlsgsk_wangyi', 'jlsgsk_zhanglu', 'jlsgsk_kongrong',
                'jlsgsk_zhoucang', 'jlsgsk_zhoutai', 'jlsgsk_lvlingqi', 'jlsgsk_lukang', 'jlsgsk_luji',
                'jlsgsk_xianglang', 'jlsgsk_zoushi', 'jlsgsk_zhugeguo'],
              jlsg_tanlang: ['jlsgsk_zhangxiu', 'jlsgsk_zhugejin', 'jlsgsk_liyan', 'jlsgsk_jiping', 'jlsgsk_sunhao',
                'jlsgsk_yangxiu', 'jlsgsk_simazhao', 'jlsgsk_simashi', 'jlsgsk_zhangning', 'jlsgsk_feiyi'],
              jlsg_jiangxing: ['jlsgsk_sunluyu', 'jlsgsk_chengyu', 'jlsgsk_mizhu', 'jlsgsk_zhangren', 'jlsgsk_zangba',
                'jlsgsk_hejin', 'jlsgsk_zhangbao', 'jlsgsk_bianfuren', 'jlsgsk_heqi', 'jlsgsk_tianfeng'],
              jlsg_sp: ['jlsgsk_guanyu', 'jlsgsk_huangyueying', 'jlsgsk_machao', 'jlsgsk_caiwenji'],
            },
          },
          character: {
            jlsgsk_simashi: ["male", 'wei', 4, ["jlsg_quanlue"], []],
            jlsgsk_xianglang: ["male", 'shu', 3, ["jlsg_cangshu", "jlsg_kanwu"], []],
            jlsgsk_luji: ["male", 'wu', 3, ["jlsg_huaiju", "jlsg_huntian"], []],
            jlsgsk_bianfuren: ["female", 'wei', 3, ["jlsg_huage", "jlsg_muyi"], []],
            jlsgsk_heqi: ["male", 'wu', 4, ["jlsg_diezhang"], []],
            jlsgsk_mateng: ["male", 'qun', 4, ["mashu", "jlsg_xiongyi"], []],
            jlsgsk_tianfeng: ["male", 'qun', "2/3", ["jlsg_sijian", "jlsg_gangzhi"], []],
            jlsgsk_feiyi: ["male", 'shu', 3, ["jlsg_yanxi", "jlsg_zhige"], []],
            jlsgsk_jiangqin: ["male", 'wu', 4, ["jlsg_shangyi", "jlsg_wangsi"], []],
            jlsgsk_dongyun: ["male", 'shu', 3, ["jlsg_bibu", "jlsg_kuangzheng"], []],
            jlsgsk_dongxi: ["male", 'wu', 4, ["jlsg_duanlan"], []],
            jlsgsk_quancong: ["male", 'wu', 4, ["jlsg_yaoming"], []],
            jlsgsk_yujin: ["male", 'wei', 4, ["jlsg_zhengyi"], []],
            jlsgsk_panfeng: ["male", 'qun', 4, ["jlsg_kuangfu"], []],
            jlsgsk_dengzhi: ['male', 'shu', 3, ['jlsg_hemeng', 'jlsg_sujian'], []],
            jlsgsk_xuyou: ['male', 'wei', 3, ['jlsg_yexi', 'jlsg_kuangyan'], []],
            jlsgsk_zhangbu: ['male', 'wu', 3, ['jlsg_chaochen', 'jlsg_quanzheng'], []],
            jlsgsk_miheng: ['male', 'qun', 3, ['jlsg_shejian', 'jlsg_kuangao'], []],
            jlsgsk_zumao: ['male', 'wu', 4, ['jlsg_yinbing'], []],
            jlsgsk_huaxiong: ['male', 'qun', 5, ['jlsg_fenwei', 'jlsg_shiyong'], []],
            jlsgsk_sunce: ['male', 'wu', 4, ['jlsg_angyang', 'jlsg_weifeng', 'jlsg_xieli'], ['zhu',]],
            jlsgsk_caoren: ['male', 'wei', 4, ['jlsg_jushou'], []],
            jlsgsk_gongsunzan: ['male', 'qun', 4, ['jlsg_yicong', 'jlsg_muma'], []],
            jlsgsk_sunqian: ['male', 'shu', 3, ['jlsg_suiji', 'jlsg_fengyi'], []],
            jlsgsk_maliang: ['male', 'shu', 3, ['jlsg_yalv', 'jlsg_xiemu'], []],
            jlsgsk_buzhi: ['male', 'wu', 3, ['jlsg_zhejie', 'jlsg_fengya'], []],
            jlsgsk_wangping: ['male', 'shu', 4, ['jlsg_yijian', 'jlsg_feijun'], []],
            jlsgsk_huangyueying: ['female', 'shu', 3, ['jlsg_muniu', 'jlsg_liuma'], []],
            jlsgsk_dongzhuo: ['male', 'qun', 6, ['jlsg_baozheng', 'jlsg_lingnu'], []],
            jlsgsk_chendao: ['male', 'shu', 4, ['jlsg_zhongyong'], []],
            jlsgsk_dingfeng: ['male', 'wu', 4, ['jlsg_bozhan', 'jlsg_qingxi'], []],

            jlsgsk_zhuran: ['male', 'wu', 4, ['jlsg_danshou', 'jlsg_yonglie'], []],
            jlsgsk_lukang: ['male', 'wu', 4, ['jlsg_hengshi', 'jlsg_zhijiao'], []],
            jlsgsk_lvlingqi: ['female', 'qun', 5, ['jlsg_jiwux', 'zhuangrong'], []],
            jlsgsk_zhoucang: ['male', 'shu', 4, ['jlsg_daoshi'], []],
            jlsgsk_kongrong: ['male', 'qun', 3, ['jlsg_lirang', 'jlsg_xianshi'], []],
            jlsgsk_caochong: ['male', 'wei', 3, ['jlsg_chengxiang', 'jlsg_renxin'], ['unseen']],
            jlsgsk_zhanglu: ['male', 'qun', 3, ['jlsg_midao', 'jlsg_yishe', 'jlsg_pudu'], []],
            jlsgsk_guanlu: ['male', 'wei', 3, ['jlsg_zongqing', 'jlsg_bugua'], []],
            jlsgsk_simazhao: ['male', 'wei', 3, ['jlsg_zhaoxin', 'jlsg_zhihe'], []],
            jlsgsk_yangxiu: ['male', 'wei', 3, ['jlsg_caijie', 'jlsg_jilei'], []],
            jlsgsk_liyan: ['male', 'shu', 4, ['jlsg_yanliang'], []],
            jlsgsk_jiping: ['male', 'qun', 3, ['jlsg_duzhi', 'jlsg_lieyi'], []],
            jlsgsk_sunhao: ['male', 'wu', 4, ['jlsg_baoli'], []],
            jlsgsk_zhugejin: ['male', 'wu', 3, ['jlsg_huanbing', 'jlsg_hongyuan'], []],
            jlsgsk_zhangxiu: ['male', 'qun', 4, ['jlsg_huaqiang', 'jlsg_chaohuang'], []],
            jlsgsk_sunluyu: ['female', 'wu', 3, ['jlsg_huilian', 'jlsg_wenliang'], []],
            jlsgsk_luzhi: ['male', 'qun', 3, ['jlsg_jinglun', 'jlsg_ruzong'], []],
            jlsgsk_yuji: ['male', 'qun', 3, ['jlsg_guhuo', 'jlsg_fulu'], []],
            jlsgsk_mifuren: ['female', 'shu', 3, ['jlsg_guixiu', 'jlsg_cunsi'], []],
            jlsgsk_zhangning: ['female', 'qun', 3, ['jlsg_leiji', 'jlsg_shanxi'], []],
            jlsgsk_guonvwang: ['female', 'wei', 3, ['jlsg_gongshen', 'jlsg_jianyue'], []],
            jlsgsk_chengyu: ['male', 'wei', 3, ['jlsg_pengri', 'jlsg_danmou'], []],
            jlsgsk_zhangren: ['male', 'qun', 4, ['jlsg_fushe'], []],
            jlsgsk_mizhu: ['male', 'shu', 3, ['jlsg_ziguo', 'jlsg_shangdao'], []],
            jlsgsk_zangba: ['male', 'wei', 4, ['jlsg_hengjiang'], []],
            jlsgsk_hejin: ['male', 'qun', 4, ['jlsg_zhuanshan'], []],
            jlsgsk_wangyi: ['female', 'wei', 3, ['jlsg_zhenlie', 'jlsg_miji'], []],
            jlsgsk_zuoci: ['male', 'qun', 3, ['jlsg_qianhuan'], []],

            jlsgsk_guanyu: ['male', 'wei', 4, ['jlsg_wusheng', 'jlsg_danqi'], []],
            jlsgsk_machao: ['male', 'qun', 4, ['jlsg_zhuiji', 'jlsg_xionglie'], []],
            jlsgsk_caiwenji: ['female', 'wei', 3, ['jlsg_chenqing', 'jlsg_mozhi'], []],
            jlsgsk_zhangbao: ['male', 'qun', 3, ['jlsg_zhoufu', 'jlsg_yingbing'], []],
            jlsgsk_guanxing: ["male", 'shu', 4, ["jlsg_yongji", "jlsg_wuzhi"], []],
            jlsgsk_kuaiyue: ["male", 'qun', 3, ["jlsg_yidu", "jlsg_zhubao"], []],
            jlsgsk_zhoutai: ["male", 'wu', 4, ["jlsg_buqu", "jlsg_fenji"], []],
            jlsgsk_zoushi: ["female", 'qun', 3, ["jlsg_jiaomei", "jlsg_huoshui"], []],
            jlsgsk_yanliang: ['male', 'qun', 4, ['jlsg_hubu'], []],
            jlsgsk_zhugeguo: ["female", 'shu', 3, ["jlsg_yuhua", "jlsg_dengxian"], []],
            jlsgsk_xizhicai: ["male", 'wei', 3, ["jlsg_tiance", "jlsg_jiexin"], []],
            jlsgsk_guansuo: ["male", 'shu', 4, ["jlsg_zhengnan", "jlsg_tongxin"], []],
            jlsgsk_baosanniang: ["female", 'shu', 3, ["jlsg_jianwu", "jlsg_zhennan", "jlsg_tongxin"], []],
            jlsgsk_dongbai: ["female", 'qun', 3, ["jlsg_shemi", "jlsg_jiaohui"], []],
            jlsgsk_xushi: ["female", 'wu', 3, ["jlsg_wengua", "jlsg_fuzhu"], []],
          },
          characterIntro: {
            jlsgsk_kuaiyue: "蒯越（？－214年），字异度，襄阳中庐（今湖北襄阳西南）人。东汉末期人物，演义中为蒯良之弟。原本是荆州牧刘表的部下，曾经在刘表初上任时帮助刘表铲除荆州一带的宗贼（以宗族、乡里关系组成的武装集团）。刘表病逝后与刘琮一同投降曹操，后来官至光禄勋。",
            jlsgsk_dongxi: "董袭（195年前－213或217年），字元世或玄岱，扬州会稽余姚（今浙江余姚）人，东汉末年群雄孙策麾下将领；是江东十二虎臣之一。历任别部司马、扬武都尉、威越校尉，最后官至偏将军。",
          },
          skill: {
            jlsg_zhengyi: {
              audio: "ext:极略:2",
              enable: ['chooseToUse', 'chooseToRespond'],
              hiddenCard: function (player, name) {
                if (get.type(name) != 'basic' || name == 'shan') return false;
                return _status.currentPhase == player ? player.countCards('h') - player.hp == 1 : player.hp - player.countCards('h') == 1;
              },
              filter: function (event, player) {
                if (_status.currentPhase == player && player.countCards('h') - player.hp != 1) return false;
                if (_status.currentPhase != player && player.hp - player.countCards('h') != 1) return false;
                for (var i of lib.inpile) {
                  if (get.type(i) != 'basic' || i == 'shan') continue;
                  if (event.filterCard({ name: i }, player, event)) return true;
                  if (i == 'sha' && lib.inpile_nature.some(nat => event.filterCard({ name: i, nature: nat }, player, event))) {
                    return true;
                  }
                }
                return false;
              },
              chooseButton: {
                dialog: function (event, player) {
                  var list = [];
                  for (var i of lib.inpile) {
                    if (get.type(i) != 'basic' || i == 'shan') continue;
                    list.push(['basic', '', i]);
                    if (i == 'sha') {
                      for (var j of lib.inpile_nature) list.push(['basic', '', i, j]);
                    }
                  }
                  return ui.create.dialog('整毅', [list, 'vcard']);
                },
                filter: function (button, player) {
                  var evt = _status.event.getParent();
                  return evt.filterCard({ name: button.link[2], nature: button.link[3] }, player, evt);
                },
                check: function (button) {
                  var player = _status.event.player;
                  var shaTarget = false;
                  for (var i = 0; i < game.players.length; i++) {
                    if (player.canUse('sha', game.players[i]) && ai.get.effect(game.players[i], { name: 'sha' }, player) > 0) {
                      shaTarget = true;
                    }
                  }
                  if (player.isDamaged()) return (button.link[2] == 'tao') ? 1 : -1;
                  if (shaTarget && player.num('h', 'sha') && !player.num('h', 'jiu')) return (button.link[2] == 'jiu') ? 1 : -1;
                  if (shaTarget && !player.num('h', 'sha')) return (button.link[2] == 'sha') ? 1 : -1;
                  return (button.link[2] == 'sha') ? 1 : -1;
                },
                backup: function (links, player) {
                  var A = {
                    audio: false,
                    popname: true,
                    // ignoreMod:true,
                    filterCard: function (card, player) {
                      return _status.currentPhase == player
                        ? true : false;
                    },
                    viewAs: {
                      name: links[0][2],
                      nature: links[0][3],
                      suit: 'none',
                      number: null,
                      isCard: true,
                    },
                  };
                  if (player.countCards('h') > player.hp) {
                    A.precontent = function () {
                      player.logSkill('jlsg_zhengyi');
                      var card = event.result.cards[0];
                      event.card = card;
                      player.discard(card);
                      // player.$throw(card,1000);
                      event.result.card = {
                        name: event.result.card.name,
                        nature: event.result.card.nature,
                        // cards: [],
                      };
                      event.result.cards = [];
                    };
                  } else {
                    A.precontent = function () {
                      player.logSkill('jlsg_zhengyi');
                      player.draw('nodelay');
                    };
                    A.selectCard = -1;
                    A.filterCard = () => false;
                    // A.onuse = A.onrespond = function (result, player) { player.draw('nodelay');};
                  }
                  return A;
                },
                prompt: function (links, player) {
                  var str = '视为使用或打出' + get.translation({ name: links[0][2], nature: links[0][3] });
                  if (player.hp <= player.countCards('h')) str = '弃置一张手牌，' + str;
                  return str;
                }
              },
              ai: {
                order: 6,
                result: {
                  player: 1,
                },
                threaten: 1.3,
                respondSha: true,
                // respondShan: true,
                fireattack: true,
                skillTagFilter: function (player) {
                  return _status.currentPhase == player ? player.countCards('h') - player.hp == 1 : player.hp - player.countCards('h') == 1;
                },
              },
              group: ['jlsg_zhengyi_shan'],
              subSkill: {
                shan: {
                  audio: "jlsg_zhengyi", // audio: ["jieyue1", 2],
                  enable: ['chooseToUse', 'chooseToRespond'],
                  filter: function (event, player) {
                    return _status.currentPhase == player
                      ? player.countCards('h') - player.hp == 1
                      : player.hp - player.countCards('h') == 1;
                  },
                  filterCard: function (card, player) {
                    return _status.currentPhase == player
                      ? true : false;
                  },
                  selectCard: function () {
                    return _status.currentPhase == _status.event.player
                      ? 1 : -1;
                  },
                  // check: () => true,
                  // ignoreMod:true,
                  viewAs: {
                    name: 'shan',
                    suit: 'none',
                    number: null,
                  },
                  onrespond: function (result, player) {
                    if (_status.currentPhase == player) {
                      player.discard(result.cards);
                      result.card = {
                        name: result.card.name,
                      };
                      result.cards = [];
                    } else {
                      player.draw("nodelay");
                    }
                  },
                  onuse: function (result, player) {
                    if (_status.currentPhase == player) {
                      player.discard(result.cards);
                      result.card = {
                        name: result.card.name,
                      };
                      result.cards = [];
                    } else {
                      player.draw("nodelay");
                    }
                  },
                  ai: {
                    skillTagFilter: function (player) {
                      return _status.currentPhase == player
                        ? player.countCards('h') - player.hp == 1
                        : player.hp - player.countCards('h') == 1;
                    },
                    respondShan: true
                  }
                },
              }
            },
            jlsg_wusheng: {
              audio: 'ext:极略:true',
              inherit: 'wusheng',
            },
            jlsg_quanlue: {
              audio: "ext:极略:2",
              trigger: {
                player: "phaseUseBegin",
              },
              filter: function (event, player) {
                return player.countCards("h");
              },
              check: function (event, player) {
                return game.hasPlayer(function (cur) {
                  return get.attitude(player, cur) != 0;
                });

              },
              content: function () {
                "step 0"
                event.list = [];
                for (var i = 0; i < player.getCards('h').length; i++) {
                  var suit = get.suit(player.getCards('h')[i]);
                  if (event.list.contains(suit)) continue;
                  event.list.push(suit);
                }
                player.showHandcards();
                "step 1"
                player.chooseControl(event.list, function (event, player) {
                  var max = event.list.randomGet();
                  var max2 = player.countCards('h', { suit: max });
                  for (var i = 0; i < event.list.length; i++) {
                    var len = event.list[i];
                    var len2 = player.countCards('h', { suit: len });
                    if (len2 == max2) {
                      if (['spade', 'club'].contains(len)) max = len;
                    }
                    if (len2 > max2) max = len;
                    max2 = player.countCards('h', { suit: max });
                  }
                  return max;
                }).prompt = "权略：请选择1种花色";
                "step 2"
                player.popup('权略' + get.translation(result.control + '2') + get.translation(result.control));
                player.draw(player.countCards("h", { suit: result.control }));
                player.storage.jlsg_quanlue = result.control;
                player.addSkill("jlsg_quanlue_effect");
              },
              ai: {
                effect: {
                  player: function (card, player) {
                    if (!player.storage.jlsg_quanlue) return;
                    if (_status.event.dying) return get.attitude(player, _status.event.dying);
                    if (get.suit(card) == player.storage.jlsg_quanlue && get.type(card) != 'equip') {
                      if (get.type(card) == 'basic') return [0, 1];
                      if (card.name == 'wugu') return;
                      return [1, 0.5];
                    }
                  }
                }
              },
              subSkill: {
                effect: {
                  trigger: {
                    player: "phaseUseAfter",
                  },
                  forced: true,
                  content: function () {
                    "step 0"
                    player.showHandcards();
                    "step 1"
                    player.discard(player.getCards("h", function (card) {
                      return get.suit(card) == player.storage.jlsg_quanlue;
                    }));
                    "step 2"
                    player.removeSkill("jlsg_quanlue_effect");
                  },
                },
              },
            },
            jlsg_huaiju: {
              audio: "ext:极略:2",
              trigger: {
                player: [
                  "phaseJudgeEnd",
                  "phaseDrawEnd",
                  "phaseUseEnd",
                  "phaseDiscardEnd",
                  "phaseJieshuEnd",
                ],
              },
              filter: function (event, player) {
                return player.countCards('h') == 3;
              },
              content: function () {
                "step 0"
                player.chooseControl("摸牌", "弃牌", function (event, player) {
                  return "摸牌";
                }).prompt = "怀橘：你可以摸一张牌或弃置两张牌";
                "step 1"
                if (result.control == "摸牌") {
                  player.draw();
                } else {
                  player.chooseToDiscard('he', 2, true);
                }
              },
            },
            jlsg_huntian: {
              audio: "ext:极略:2",
              trigger: { player: "discardEnd" },
              filter: function (event, player) {
                for (var i = 0; i < event.cards.length; i++) {
                  if (get.position(event.cards[i]) == "d") return true;
                }
                return false;
              },
              content: function () {
                "step 0"
                event.list = [];
                for (var i = 0; i < trigger.cards.length; i++) {
                  if (get.position(trigger.cards[i]) == "d") {
                    event.list.push(trigger.cards[i]);
                  }
                }
                "step 1"
                player.chooseCardButton("将任意张牌置于牌堆顶(后选在上)", event.list, [1, Infinity], true).ai = function (button) {
                  if (ui.selected.buttons.length) {
                    return 0;
                  }
                  return 2 + Math.random();
                };
                "step 2"
                event.cards = result.links;
                player.lose(event.cards, ui.cardPile, 'insert');
                player.$throw(event.cards.length, 1000);
                game.log(player, "将", event.cards, "置于牌堆顶");
                "step 3"
                for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
                  var card = ui.cardPile.childNodes[i];
                  if (event.cards.every(c => get.type(card) != get.type(c))) {
                    player.gain(card, 'gain2');
                    break;
                  }
                }
              }
            },
            jlsg_cangshu: {
              audio: "ext:极略:2",
              trigger: { global: "useCard" },
              // usable: 1,
              direct: true,
              filter: function (event, player) {
                if (event.player == player || get.type(event.card) != "trick" || player.hasSkill('jlsg_cangshu2')) return false;
                return game.online ? player.countCards("h") : player.countCards("h", { type: "basic" });
              },
              content: function () {
                "step 0"
                player.chooseCard("是否对" + get.translation(trigger.player) + "发动藏书？<p>交给" + get.translation(trigger.player) + "一张基本牌，令" + get.translation(trigger.card) + "无效并获得之</p>", { type: "basic" }).ai = function (card) {
                  if (get.attitude(player, trigger.player) < 0)
                    return 10 - get.value(card);
                  return 0;
                }
                "step 1"
                if (result.bool) {
                  player.logSkill("jlsg_cangshu", trigger.player);
                  player.addTempSkill('jlsg_cangshu2');
                  // player.$give(result.cards, trigger.player);
                  trigger.player.gain(result.cards, player, 'giveAuto');
                } else {
                  event.finish();
                }
                "step 2"
                if (trigger.cards) {
                  // player.$draw(trigger.cards);
                  player.gain(trigger.cards, 'gain2');
                }
                trigger.cancel();
              },
            },
            jlsg_cangshu2: {

            },
            jlsg_kanwu: {
              audio: "ext:极略:1",
              enable: ['chooseToUse', 'chooseToRespond'],
              hiddenCard: function (player, name) {
                if (get.type(name) != 'basic' || name == 'shan') return false;
                return _status.currentPhase != player && player.countCards('h') &&
                  (game.online ? player.countCards("h") : player.countCards("h", { type: ['delay', 'trick'] }));
              },
              filter: function (event, player) {
                if (_status.currentPhase == player || !player.countCards('h', { type: ['delay', 'trick'] })) return false;
                for (var i of lib.inpile) {
                  if (get.type(i) != 'basic' || i == 'shan') continue;
                  if (event.filterCard({ name: i }, player, event)) return true;
                  if (i == 'sha' && lib.inpile_nature.some(nat => event.filterCard({ name: i, nature: nat }, player, event))) {
                    return true;
                  }
                }
                return false;
              },
              chooseButton: {
                dialog: function (event, player) {
                  var list = [];
                  for (var i of lib.inpile) {
                    if (get.type(i) != 'basic' || i == 'shan') continue;
                    list.push(['basic', '', i]);
                    if (i == 'sha') {
                      for (var j of lib.inpile_nature) list.push(['basic', '', i, j]);
                    }
                  }
                  return ui.create.dialog('勘误', [list, 'vcard']);
                },
                filter: function (button, player) {
                  var evt = _status.event.getParent();
                  return evt.filterCard({ name: button.link[2], nature: button.link[3] }, player, evt);
                },
                check: function (button) {
                  var player = _status.event.player;
                  var shaTarget = false;
                  for (var i = 0; i < game.players.length; i++) {
                    if (player.canUse('sha', game.players[i]) && ai.get.effect(game.players[i], { name: 'sha' }, player) > 0) {
                      shaTarget = true;
                    }
                  }
                  if (player.isDamaged()) return (button.link[2] == 'tao') ? 1 : -1;
                  if (shaTarget && player.num('h', 'sha') && !player.num('h', 'jiu')) return (button.link[2] == 'jiu') ? 1 : -1;
                  if (shaTarget && !player.num('h', 'sha')) return (button.link[2] == 'sha') ? 1 : -1;
                  return (button.link[2] == 'sha') ? 1 : -1;
                },
                backup: function (links, player) {
                  return {
                    filterCard: function (card) {
                      return get.type(card, 'trick') == 'trick';
                    },
                    audio: false,
                    popname: true,
                    // ignoreMod:true,
                    viewAs: {
                      name: links[0][2],
                      nature: links[0][3],
                      suit: 'none',
                      number: null,
                      isCard: true,
                    },
                    ai1: function (card) {
                      return 6 - get.value(card);
                    },
                    precontent: function () {
                      'step 0'
                      player.logSkill('jlsg_kanwu');
                      var card = event.result.cards[0];
                      event.card = card;
                      player.discard(card);
                      event.result.card = {
                        name: event.result.card.name,
                        nature: event.result.card.nature,
                        // cards: [],
                      };
                      event.result.cards = [];
                    },
                  };
                },
                // prompt: function (links, player) {
                //   return '弃置一张锦囊牌，视为使用或打出' + get.translation({ name: links[0][2], nature: links[0][3] });
                // }
              },
              ai: {
                order: 6,
                result: {
                  player: 1,
                },
                // threaten: 1.3,
                respondSha: true,
                respondShan: true,
                fireattack: true,
                skillTagFilter: function (player) {
                  return _status.currentPhase != player && player.countCards('h');
                },
              },
              group: ['jlsg_kanwu_shan'],
              subSkill: {
                shan: {
                  audio: "jlsg_kanwu", // audio: ["jieyue1", 2],
                  enable: ['chooseToUse', 'chooseToRespond'],
                  filter: function (event, player) {
                    return _status.currentPhase != player;
                  },
                  filterCard: function (card, player) {
                    return get.type(card, 'trick') == 'trick';
                  },
                  // check: () => true,
                  viewAs: {
                    name: 'shan',
                    suit: 'none',
                    number: null,
                  },
                  onrespond: function (result, player) {
                    player.discard(result.cards);
                    result.card = {
                      name: result.card.name,
                    };
                    result.cards = [];
                  },
                  onuse: function (result, player) {
                    player.discard(result.cards);
                    result.card = {
                      name: result.card.name,
                    };
                    result.cards = [];
                  },
                  ai: {
                    skillTagFilter: function (player) {
                      return _status.currentPhase != player && player.countCards('h');
                    },
                    respondShan: true
                  }
                },
              }
            },
            jlsg_huage: {
              audio: "ext:极略:2",
              enable: "phaseUse",
              usable: 1,
              selectTarget: -1,
              filterTarget: function (card, player, target) {
                return target.countCards('he') > 0;
              },
              ignoreTarget: function (card, player, target) {
                return !target.countCards('he');
              },
              content: function () {
                "step 0"
                if (target.countCards('he')) {
                  target.chooseToDiscard("化戈：请弃置至少一张牌，弃置的牌中每有【杀】，你便摸一张牌", 'he', [1, Infinity], true).ai = function (card) {
                    if (card.name == 'sha') return 6 - get.value(card);
                    return -get.useful(card);
                  };
                } else {
                  event.finish();
                }
                "step 1"
                if (result.bool) {
                  event.num = 0;
                  for (var i = 0; i < result.cards.length; i++) {
                    if (result.cards[i].name == "sha") {
                      event.num++;
                    }
                  }
                  if (event.num == 0) {
                    event.finish();
                  }
                } else {
                  event.finish();
                }
                "step 2"
                target.draw(event.num);
              },
              ai: {
                order: 8,
                result: {
                  player: 1,
                },
              },
            },
            jlsg_muyi: {
              audio: "ext:极略:2",
              trigger: { global: "phaseBegin" },
              filter: function (event, player) {
                return event.player != player && event.player.countCards('he') && player.hasSkill('jlsg_muyi');
              },
              direct: true,
              content: function () {
                "step 0"
                trigger.player.chooseCard("是否发动【" + get.translation(player) + "】的技能【母仪】？<p>你可以交给【" + get.translation(player) + "】1至两张牌，回合结束时，其交还你等量的牌。</p>", 'he', [1, 2]).ai = function (card) {
                  if (get.position(card) == 'e' && get.attitude(player, target) > 0) return 7 - get.value(card);
                  if (get.attitude(_status.event.player, player) > 2) return 2 - get.useful(card);
                  return -1;
                };
                "step 1"
                if (result.bool) {
                  player.logSkill("jlsg_muyi");
                  trigger.player.$give(result.cards.length, player);
                  player.gain(result.cards, trigger.player);
                  player.storage.jlsg_muyi = trigger.player;
                  player.storage.jlsg_muyi_effect = result.cards.length;
                  player.addSkill("jlsg_muyi_effect");
                }
              },
              subSkill: {
                effect: {
                  mark: true,
                  marktext: "仪",
                  intro: {
                    name: "母仪",
                    content: function (storage, player) {
                      return "当前回合结束时，你需交给" + get.translation(player.storage.jlsg_muyi) + get.cnNumber(storage) + "张牌";
                    },
                  },
                  trigger: { global: "phaseEnd" },
                  forced: true,
                  filter: function (event, player) {
                    return event.player == player.storage.jlsg_muyi;
                  },
                  logTarget: "player",
                  content: function () {
                    "step 0"
                    player.chooseCard("母仪：交给" + get.translation(player.storage.jlsg_muyi) + get.cnNumber(player.storage.jlsg_muyi_effect) + "张牌", 'he', player.storage.jlsg_muyi_effect, true).ai = function (card) {
                      return 10 - get.value(card);
                    };
                    "step 1"
                    if (result.bool) {
                      player.$give(result.cards.length, trigger.player);
                      trigger.player.gain(result.cards);
                    } else {
                      event.finish();
                    }
                    delete player.storage.jlsg_muyi;
                    delete player.storage.jlsg_muyi_effect;
                    player.removeSkill("jlsg_muyi_effect");
                  },
                },
              },
            },
            jlsg_diezhang: {
              audio: "ext:极略:2",
              trigger: { player: 'useCard' },
              frequent: true,
              filter: function (event, player) {
                if (!event.cards || event.cards.length != 1) return false;
                if (_status.currentPhase != player) return false;
                if (!player.storage.jlsg_diezhang) return false;
                return player.storage.jlsg_diezhang.number < event.cards[0].number;
              },
              content: function () {
                player.draw();
              },
              intro: {
                content: 'card'
              },
              ai: {
                aiOrder: function (player, card, num) {
                  if (typeof card == 'object' && player.isPhaseUsing()) {
                    var evt = player.getLastUsed();
                    if (evt && evt.card && evt.card.number && evt.card.number === card.number) {
                      return num + 10;
                    }
                  }
                },
                // effect: {
                //   player: function (card, player, target) {
                //     if (!player.storage.jlsg_diezhang) return;
                //     var number = get.number(player.storage.jlsg_diezhang);
                //     if (number < get.number(card)) {
                //       return [1, 0.6];
                //     }
                //   },
                // }
              },
              group: ['jlsg_diezhang2', 'jlsg_diezhang3']
            },
            jlsg_diezhang3: {
              trigger: { player: 'useCard' },
              priority: -1,
              silent: true,
              filter: function (event, player) {
                if (!event.cards || event.cards.length != 1) return false;
                return _status.currentPhase == player;

              },
              content: function () {
                player.storage.jlsg_diezhang = trigger.cards[0];
              }
            },
            jlsg_diezhang2: {
              trigger: { player: 'phaseBefore' },
              silent: true,
              priority: 10,
              content: function () {
                delete player.storage.jlsg_diezhang;
              }
            },
            jlsg_xiongyi: {
              audio: "ext:极略:2",
              forced: true,
              trigger: { player: 'phaseZhunbeiBegin' },
              filter: function (event, player) {
                return player.hp == 1 || player.countCards('h') == 0;
              },
              content: function () {
                if (player.hp == 1) {
                  player.recover();
                }
                if (player.countCards('h') == 0) {
                  player.draw(2);
                }
              }
            },
            jlsg_sijian: {
              audio: "ext:极略:1",
              trigger: {
                player: 'loseAfter',
                global: ['equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter'],
              },
              direct: true,
              filter: function (event, player) {
                if (player.countCards('h')) return false;
                var evt = event.getl(player);
                return evt && evt.hs && evt.hs.length;
              },
              content: function () {
                "step 0"
                player.chooseTarget(get.prompt2(event.name), function (card, player, target) {
                  return player != target && target.countDiscardableCards(player, 'he') > 0;
                }).set('ai', function (target) {
                  return -get.attitude(_status.event.player, target);
                });
                "step 1"
                if (result.bool) {
                  player.logSkill(event.name, result.targets);
                  event.target = result.targets[0];
                  player.discardPlayerCard(player.hp, event.target, true);
                }
                else {
                  event.finish();
                }
              },
              ai: {
                expose: 0.2,
              }
            },
            jlsg_gangzhi: {
              // TODO: allow preview of both audio clips
              audio: "ext:极略:1",
              group: ['jlsg_gangzhi2'],
              trigger: { player: 'damageBefore' },
              prompt2: '弃置所有手牌，然后防止此伤害。',
              filter: function (event, player) {
                return player.countCards('h') != 0;
              },
              content: function () {
                "step 0"
                var cards = player.getCards('h');
                player.discard(cards);
                "step 1"
                trigger.cancel();
              },
              ai: {
                maixie_defend: true, // only when sijian is active
                effect: {
                  target: function (card, player, target) {
                    if (player.hasSkillTag('jueqing', false, target)) return;
                    if (!target.hasFriend()) return;
                    if (get.tag(card, 'damage') && target.countCards('h') != 0) {
                      return [0.6, -0.4 * (target.countCards('h') - (target.hasSkill('jlsg_sijian') ? target.hp : 0))];
                    }
                  }
                },
              },
            },
            jlsg_gangzhi2: {
              audio: "ext:极略:true",
              trigger: { player: 'damageAfter' },
              check: function (event, player) {
                return player.isTurnedOver() || game.hasPlayer(
                  p => get.attitude(player, p) > 0
                ) || player.maxHp > 1;
              },
              filter: function (event, player) {
                return player.countCards('h') == 0;
              },
              prompt2: '将武将牌翻面，然后将手牌数补至体力上限。',
              content: function () {
                "step 0"
                player.turnOver();
                "step 1"
                player.drawTo(player.maxHp);
              },
              ai: {
                maixie: true,
                maixie_hp: true,
                effect: {
                  target: function (card, player, target) {
                    if (player.hasSkillTag('jueqing', false, target)) return;
                    if (!target.hasFriend() && (!target.isTurnedOver() || target.hp == 1)) return;
                    if (get.tag(card, 'damage') && target.countCards('h') == 0) return target.isTurnedOver() ? [0, 4] : 0.5;
                  }
                },
              },
            },
            jlsg_yanxi: {
              audio: "ext:极略:2",
              trigger: { player: ['phaseZhunbeiBegin', 'phaseJieshuBegin'] },
              frequent: true,
              filter: function (event, player) {
                return player.countCards('e') <= 0;
              },
              content: function () {
                player.draw();
              },
            },
            jlsg_zhige: {
              audio: "ext:极略:1",
              group: ["jlsg_zhige_3", "jlsg_zhige_4"],
            },
            jlsg_zhige_3: {
              audio: "ext:极略:true",
              enable: ['chooseToUse', 'chooseToRespond'],
              filterCard: function () {
                return false;
              },
              selectCard: -1,
              viewAs: { name: 'shan' },
              viewAsFilter: function (player) {
                return player.getCards("e").length > 0;
              },
              prompt: '弃置装备区的牌，视为打出一张【闪】',
              check: function (event, player) {
                if (player.hp == 1 && player.countCards('h', 'shan') == 0) {
                  return 1;
                }
                var num = 1;
                if (player.hasSkill('jlsg_yanxi')) num++;
                if (player.countCards('e', 'bagua')) num--;
                return player.countCards('e', function (cardx) {
                  return get.value(cardx) > 5;
                }) <= num;
              },
              onuse: function (result, player) {
                game.broadcastAll(function (player) {
                  var sex = player.sex;
                  if (lib.config.background_audio) {
                    game.playAudio('card', sex, 'shan');
                  }
                }, player);
                player.discard(player.getCards("e"));
              },
              onrespond: function (result, player) {
                game.broadcastAll(function (player) {
                  var sex = player.sex;
                  if (lib.config.background_audio) {
                    game.playAudio('card', sex, 'shan');
                  }
                }, player);
                player.discard(player.getCards("e"));
              },
              ai: {
                respondShan: true,
                skillTagFilter: function (player) {
                  if (player.countCards('e') <= 0) return false;
                },
              },
            },
            jlsg_zhige_4: {
              audio: "ext:极略:true",
              enable: ['chooseToUse', 'chooseToRespond'],
              filterCard: function () {
                return false;
              },
              selectCard: -1,
              viewAs: { name: 'sha' },
              viewAsFilter: function (player) {
                return player.getCards("e").length > 0;
              },
              prompt: '弃置装备区的牌，视为打出一张【杀】',
              check: function (event, player) {
                if (player.hp == 1 && player.countCards('h', 'sha') == 0) {
                  return 1;
                }
                var num = 0;
                if (player.hasSkill('jlsg_yanxi')) num++;
                if (player.countCards('e') >= 2) return -1;
                return player.countCards('e', function (cardx) {
                  return get.value(cardx) > 5;
                }) <= num;
              },
              onuse: function (result, player) {
                game.broadcastAll(function (player) {
                  var sex = player.sex;
                  if (lib.config.background_audio) {
                    game.playAudio('card', sex, 'sha');
                  }
                }, player);
                player.discard(player.getCards("e"));
              },
              onrespond: function (result, player) {
                game.broadcastAll(function (player) {
                  var sex = player.sex;
                  if (lib.config.background_audio) {
                    game.playAudio('card', sex, 'sha');
                  }
                }, player);
                player.discard(player.getCards("e"));
              },
              ai: {
                respondSha: true,
                skillTagFilter: function (player) {
                  if (player.countCards('e') <= 0) return false;
                },
              },
            },
            jlsg_wangsi: {
              audio: "ext:极略:2",
              trigger: { player: 'damageEnd' },
              filter: function (event, player) {
                return event.source && event.source != player && event.source.countCards('h') != 0;
              },
              check: function (event, player) {
                return 1;
              },
              frequent: true,
              content: function () {
                player.discardPlayerCard(trigger.source, 'h', 'visible').set('filterButton', function (button, player) {
                  return get.color(button.link) == 'red';
                }) // .set('logSkill', [event.name, trigger.source]);
              },
              ai: {
                maixie_defend: true,
              }
            },
            jlsg_shangyi: {
              audio: "ext:极略:2",
              enable: 'phaseUse',
              usable: 1,
              filterTarget: function (card, player, target) {
                return player != target && target.countCards('h');
              },
              content: function () {
                'step 0'
                game.log(target, '观看了', player, '的手牌');
                target.viewHandcards(player);
                'step 1'
                if (get.mode() == 'identity') {
                  player.chooseControl(['观看其身份牌', '观看其手牌', 'cancel2'], 1).set('prompt', '选择一项');
                }
                'step 2'
                if (!result || !result.control || result.control === '观看其手牌') {
                  player.discardPlayerCard(target, 'h', 'visible').set('filterButton', function (button, player) {
                    return get.color(button.link) == 'black';
                  });
                }
                else if (result && result.control === '观看其身份牌' && target.identity) {
                  game.log(player, '观看了', target, '的身份');
                  var idt = target.identity;
                  var styleStr = {
                    zhu: `data-nature="fire"`,
                    zhong: `data-nature="metal"`,
                    fan: `data-nature="wood"`,
                    nei: 'data-nature="thunder"',
                  }[idt];
                  var tr = {
                    zhu: '主公',
                    zhong: '忠臣',
                    fan: '反贼',
                    nei: '内奸',
                  }[idt] || get.translation(idt);
                  player.chooseControl('ok').set('dialog', [get.translation(target) + '的身份', `<span ${styleStr} style="font-family: huangcao, xinwei;font-size:larger;color: white;">${tr}</span>`]);
                }
              },
              ai: {
                order: 4,
                result: {
                  target: -1,
                },
                // result: {
                //   target: function (player, target) {
                //     var result = 0;
                //     if (target.hasSkillTag('noe')) result += 4 + target.countCards('e');
                //     if (target.hasSkillTag('nolose') || target.hasSkillTag('nodiscard')) result += 5 + target.countCards('he') / 2;
                //     if (target.hasCard(function (card) {
                //       return ['baiyin', 'rewrite_baiyin'].contains(card.name);
                //     }, 'e') && target.isDamaged()) return 10 + result;
                //     if (target.hasCard(function (card) {
                //       var baiyin = ['baiyin', 'rewrite_baiyin'].contains(card.name);
                //       var bol = true;
                //       return get.color(card) == 'black' && (baiyin && (target.isDamaged() ? !bol : bol));
                //     }, 'e')) return -6 + result;
                //     return -5 + result;
                //   },
                // }
              }
            },
            jlsg_kuangzheng: {
              audio: "ext:极略:2",
              direct: true,
              trigger: { player: 'phaseEnd' },
              filter: function (event, player) {
                return game.hasPlayer(function (current) {
                  return current.isLinked() || current.isTurnedOver();
                });
              },
              content: function () {
                "step 0"
                player.chooseTarget(get.prompt(event.name)).set('ai', function (target) {
                  return get.attitude(_status.event.player, target);
                });
                "step 1"
                if (result.bool) {
                  event.target = result.targets[0];
                  player.logSkill(event.name, result.targets);
                } else {
                  event.finish();
                }
                "step 2"
                if (event.target.isLinked()) {
                  event.target.link();
                }
                "step 3"
                if (event.target.isTurnedOver()) {
                  event.target.turnOver();
                }
              },
              ai: {
                expose: 0.2,
              }
            },
            jlsg_bibu: {
              audio: "ext:极略:2",
              group: ['jlsg_bibu1'],
              trigger: { global: 'phaseJieshuBegin' },
              frequent: true,
              filter: function (event, player) {
                if (player.hasSkill('jlsg_bibu2')) return false;
                return event.player != player && player.countCards('h') <= player.hp;
              },
              content: function () {
                player.draw();
                player.addTempSkill('jlsg_bibu2');
              }
            },
            jlsg_bibu1: {
              audio: "ext:极略:2",
              trigger: { global: 'phaseJieshuBegin' },
              direct: true,
              filter: function (event, player) {
                if (player.hasSkill('jlsg_bibu2')) return false;
                return event.player != player && player.countCards('h') > player.hp;
              },
              content: function () {
                "step 0"
                player.chooseCardTarget({
                  filterCard: true,
                  selectCard: 1,
                  filterTarget: function (card, player, target) {
                    return player != target;
                  },
                  ai1: function (card) {
                    if (ui.selected.cards.length > 0) return -1;
                    if (card.name == 'du') return 20;
                    return (_status.event.player.countCards('h') - _status.event.player.hp);
                  },
                  ai2: function (target) {
                    var att = get.attitude(_status.event.player, target);
                    if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') {
                      if (target.hasSkillTag('nodu')) return 0;
                      return 1 - att;
                    }
                    if (target.countCards('h') > _status.event.player.countCards('h')) return 0;
                    return att - 4;
                  },
                  prompt: "###是否发动【裨补】？###你可以将一张手牌交给其他角色"
                });
                "step 1"
                if (result.bool) {
                  player.addTempSkill('jlsg_bibu2');
                  player.logSkill('jlsg_bibu', result.targets);
                  result.targets[0].gain(result.cards, player);
                  player.$give(result.cards.length, result.targets[0]);
                }
              },
              ai: {
                threaten: 1.2,
                order: 2,
                result: {
                  target: 1,
                },
              },
            },
            jlsg_bibu2: {},
            jlsg_duanlan: {
              audio: "ext:极略:2",
              enable: 'phaseUse',
              usable: 1,
              filter: function (event, player) {
                return game.hasPlayer(function (current) {
                  return current != player && current.countCards('hej');
                });
              },
              content: function () {
                'step 0'
                var friends = game.filterPlayer(function (current) {
                  return get.attitude(player, current) >= 4;
                });
                var targets = game.filterPlayer(function (current) {
                  return current != player
                }).sort(lib.sort.seat);
                var info = ['断缆</br></br><div class="center text">选择并弃置1至3张牌</div>'];
                for (var i = 0; i < targets.length; i++) {
                  if (targets[i].countCards('hej')) info.push('<div class="center text">' + get.translation(targets[i]) + '</div>');
                  var hs = targets[i].getCards('h');
                  if (hs.length) {
                    info.push('<div class="center text">手牌区</div>');
                    if (targets[i].isUnderControl()) info.push(hs);
                    else info.push([hs, 'blank']);
                  }
                  var es = targets[i].getCards('e');
                  if (es.length) {
                    info.push('<div class="center text">装备区</div>');
                    info.push(es);
                  }
                  var js = targets[i].getCards('j');
                  if (js.length) {
                    info.push('<div class="center text">判定区</div>');
                    info.push(js);
                  }
                }
                player.chooseButton(true, [1, 3]).set('createDialog', info).set('filterButton', function (button) {
                  return lib.filter.canBeDiscarded(button.link, _status.event.player, get.owner(button.link));
                }).set('ai', function (button) {
                  var player = _status.event.player;
                  var maxNumCards = player.getCards('he', function (card) {
                    return get.value(card) < 9 && !player.hasCard(function (card2) {
                      return card2.number > card.number
                    })
                  });
                  var maxNum = maxNumCards.length ? maxNumCards[0].number : 0;
                  var dngr = player.hp == 1 && !player.hasCard(function (card) {
                    return card.name == 'tao' || card.name == 'jiu'
                  });
                  var owner = get.owner(button.link);
                  var position = get.position(button.link);
                  var num = 0;
                  for (var i = 0; i < ui.selected.buttons.length; i++) {
                    if (['e', 'j'].contains(get.position(ui.selected.buttons[i].link))) {
                      num += ui.selected.buttons[i].link.number;
                    } else num += 7;
                  }
                  var att = get.attitude(player, owner);
                  if (att > 0) {
                    if (position == 'j') {
                      if (button.link.number < maxNum - num) return 100 - button.link.number;
                      if (!dngr) return 80 - button.link.number;
                    }
                    return 0;
                  }
                  if (att < 0) {
                    if (position == 'j') return 0;
                    if (position == 'e') {
                      if (button.link.number < maxNum - num) return 60 - button.link.number;
                      if (!dngr) return 40 - button.link.number;
                    }
                    if (7 < maxNum - num) {
                      if (!dngr) return 1;
                    }
                  }
                  return 0;

                });
                'step 1'
                event.num = 0;
                var owners = [];
                var cards = result.links.slice(0);
                for (var i = 0; i < cards.length; i++) {
                  event.num += cards[i].number;
                  var owner = get.owner(cards[i]);
                  if (!owners.contains(owner)) owners.push(owner);
                }
                owners.sort(lib.sort.seat);
                var todo = [];
                for (var i = 0; i < owners.length; i++) {
                  player.line(owners[i], 'green');
                  owners[i].discard(owners[i].getCards('hej', function (card) {
                    return cards.contains(card);
                  }));
                }
                'step 2'
                player.chooseToDiscard('断缆</br></br><div class="center text">弃置一张点数大于' + num + '的牌，或失去1点体力</div>', function (card) {
                  return card.number > num;
                }, 'he').set('ai', function (card) {
                  if (card.name == 'tao') return 0;
                  return 9 - get.value(card);
                });
                'step 3'
                if (!result.bool) player.loseHp();
              },
              ai: {
                order: 7,
                result: {
                  player: function (player) {
                    //if(player.hasSkillTag('maiHp')&&player.hp>1) return 1;
                    if (player.hp > 2 || player.hasCard(function (card) {
                      return card.number > 10
                    }, 'h')) return game.hasPlayer(function (current) {
                      if (get.attitude(player, current) > 0) return current.countCards('j');
                      else if (get.attitude(player, current) < 0) return current.countCards('he');
                    }) ? 1 : 0;
                    var dngr = player.hp == 1 && !player.hasCard(function (card) {
                      return card.name == 'tao' || card.name == 'jiu'
                    });
                    var js = [], es = [];
                    var minNum1 = 0, minNum2 = 0;
                    game.countPlayer(function (current) {
                      if (get.attitude(player, current) > 0) js = js.concat(current.getCards('j'));
                      else if (get.attitude(player, current) < 0) es = es.concat(current.getCards('e'));
                    });
                    for (var i = 0; i < js.length; i++) minNum1 = Math.min(minNum1, js[i].number);
                    if (js.length) {
                      if (player.hasCard(function (card) {
                        return card.number > minNum1 && get.value(card) < 9
                      }, 'he')) return 1;
                      if (!dngr) {
                        if (js.length > 1) return 1;
                        return game.hasPlayer(function (current) {
                          return current.countCards('he')
                        }) ? 1 : 0;
                      }
                      return 0;
                    }
                    for (var i = 0; i < es.length; i++) minNum2 = Math.min(minNum2, es[i].number);
                    if (es.length) {
                      if (player.hasCard(function (card) {
                        return card.number > minNum2 && get.value(card) < 9
                      }, 'he')) return 1;
                      if (!dngr) {
                        if (es.length > 1) return 1;
                      }
                      return 0;
                    }
                    return 0;
                  }
                }
              }
            },
            jlsg_yaoming: {
              audio: "jlsg_yaoming_",
              locked: false,
              init: function (player) {
                player.storage.jlsg_yaoming = {
                  suits: [],
                  types: [],
                };
              },
              group: ['jlsg_yaoming_strg', 'jlsg_yaoming_1', 'jlsg_yaoming_2', 'jlsg_yaoming_3', 'jlsg_yaoming_4'],
              subfrequent: ['1'],
              subSkill: {
                strg: {
                  trigger: { player: ["useCard", "respond"] },
                  filter: function (event, player) {
                    if (!player.isPhaseUsing()) return false;
                    var phaseUse = _status.event.getParent('phaseUse');
                    var hists = player.getHistory('useCard', function (evt) {
                      return evt.getParent('phaseUse') == phaseUse && evt.card && get.suit(evt.card)
                    })
                    var curSuit = get.suit(event.card);
                    return hists.contains(event) && hists.every(e => e === event || get.suit(e.card) != curSuit);
                  },
                  silent: true,
                  content: function () {
                    var phaseUse = _status.event.getParent('phaseUse');
                    var hists = player.getHistory('useCard', function (evt) {
                      return evt.getParent('phaseUse') == phaseUse && evt.card && get.suit(evt.card)
                    })
                    var suits = new Set(hists.map(e => get.suit(e.card)))
                    player.storage.jlsg_yaoming = [trigger, suits]
                    player.addTempSkill('jlsg_yaoming_mark', 'phaseUseAfter');
                    if (player.hasSkill(event.name)) {
                      player.markSkill('jlsg_yaoming_mark');
                    }

                    // var suit = get.suit(trigger.card), type = get.type(trigger.card, 'trick');
                    // if (['heart', 'diamond', 'spade', 'club'].contains(suit) &&
                    //   !player.storage.jlsg_yaoming.suits.contains(suit)) {
                    //   player.storage.jlsg_yaoming.suits.push(suit);
                    //   player.addTempSkill('jlsg_yaoming_mark', 'phaseUseAfter');
                    //   player.markSkill('jlsg_yaoming_mark');
                    // }
                    // if (!player.storage.jlsg_yaoming.types.contains(type)) {
                    //   player.storage.jlsg_yaoming.types.push(type);
                    // }
                  }
                },
                mark: {
                  onremove: function (player) {
                    delete player.storage.jlsg_yaoming;
                  },
                  intro: {
                    content: function (storage, player) {
                      var str = '使用过的花色：';
                      var suits = [...player.storage.jlsg_yaoming[1]].sort()
                      str += suits.reduce((a, b) => a + get.translation(b), '');
                      return str;
                    },
                    markcount: function (storage, player) {
                      return player.storage.jlsg_yaoming[1].size;
                    },
                  },
                },
                // clear: {
                //   trigger: { player: 'phaseAfter' },
                //   silent: true,
                //   content: function () {
                //     player.storage.jlsg_yaoming = { suits: [], types: [] }
                //   }
                // }
              },
            },
            jlsg_yaoming_: {
              audio: "ext:极略:4",
            },
            jlsg_yaoming_1: {
              audio: "ext:极略:true",
              trigger: { player: ["useCard", "respond"] },
              filter: function (event, player) {
                return player.storage.jlsg_yaoming &&
                  player.storage.jlsg_yaoming[0] == event &&
                  player.storage.jlsg_yaoming[1].size == 1;
              },
              // usable: 1,
              frequent: true,
              content: function () {
                player.draw();
              },
            },
            jlsg_yaoming_2: {
              audio: "ext:极略:true",
              trigger: { player: ["useCard", "respond"] },
              filter: function (event, player) {
                return player.storage.jlsg_yaoming &&
                  player.storage.jlsg_yaoming[0] == event &&
                  player.storage.jlsg_yaoming[1].size == 2;
              },
              // usable: 1,
              direct: true,
              content: function () {
                "step 0"
                player.chooseTarget(get.prompt('jlsg_yaoming'), function (card, player, target) {
                  return player != target && target.countCards('he') > 0;
                }).set('ai', function (target) {
                  return -get.attitude(_status.event.player, target);
                }).set('prompt2', "你可以弃置一名其他角色的一张牌");
                "step 1"
                if (result.bool) {
                  player.logSkill('jlsg_yaoming_2', result.targets);
                  event.target = result.targets[0];
                  player.discardPlayerCard(event.target, true);
                } else {
                  event.finish();
                }
              }
            },
            jlsg_yaoming_3: {
              sub: true,
              audio: "ext:极略:true",
              trigger: { player: ["useCard", "respond"] },
              filter: function (event, player) {
                return player.storage.jlsg_yaoming &&
                  player.storage.jlsg_yaoming[0] == event &&
                  player.storage.jlsg_yaoming[1].size == 3 &&
                  player.canMoveCard();
              },
              // usable: 1,
              prompt2: '你可以移动场上的一张牌',
              // frequent: true,
              check: function (event, player) {
                return player.canMoveCard(true);
              },
              content: function () {
                "step 0"
                // player.logSkill('jlsg_yaoming_3');
                player.moveCard();
                // player.moveCard(get.prompt2('jlsg_yaoming_3'));
              }
            },
            jlsg_yaoming_4: {
              audio: "ext:极略:true",
              trigger: { player: ["useCard", "respond"] },
              filter: function (event, player) {
                return player.storage.jlsg_yaoming &&
                  player.storage.jlsg_yaoming[0] == event &&
                  player.storage.jlsg_yaoming[1].size == 4;
              },
              // usable: 1,
              direct: true,
              content: function () {
                "step 0"
                player.chooseTarget(get.prompt('jlsg_yaoming'), function (card, player, target) {
                  return player != target;
                }).set('ai', function (target) {
                  return -get.attitude(_status.event.player, target);
                }).set('prompt2', "你可以对一名其他角色造成一点伤害");
                "step 1"
                if (result.bool) {
                  player.logSkill('jlsg_yaoming_4', result.targets);
                  event.target = result.targets[0];
                  event.target.damage();
                } else {
                  event.finish();
                }
              }
            },
            jlsg_kuangfu: {
              trigger: { source: 'damageEnd' },
              direct: true,
              audio: "ext:极略:2",
              filter: function (event) {
                if (event._notrigger.contains(event.player)) return false;
                return event.card && event.card.name == 'sha' && event.player.countCards('e');
              },
              content: function () {
                "step 0"
                var neg = get.attitude(player, trigger.player) <= 0;
                player.choosePlayerCard('e', trigger.player).set('ai', function (button) {
                  if (_status.event.neg) {
                    return get.buttonValue(button);
                  }
                  return 0;
                }).set('neg', neg);
                "step 1"
                if (result.bool) {
                  player.logSkill('jlsg_kuangfu');
                  trigger.player.$give(result.links, player);
                  game.delay(2);
                  player.gain(result.links[0]);
                }
              }
            },
            jlsg_zhoufu: {
              audio: "ext:极略:2",
              trigger: { global: 'phaseBegin' },
              filter: function (event, player) {
                return player.countCards('h') != 0 && event.player != player && player.canUse({ name: 'sha' }, event.player, false);
              },
              // check: function (event, player) {
              //   return get.attitude(player, event.player) < 0;
              // },
              direct: true,
              content: function () {
                'step 0'
                player.chooseToDiscard('h', get.prompt2(event.name, trigger.player)).set("ai", function (card) {
                  return get.attitude(player, trigger.player) > -1 ? 0 : 6 - get.useful(card);
                  // return 2 + get.effect(trigger.player, { name: 'sha' }, game.me) - get.value(card);
                }).set('logSkill', event.name);
                'step 1'
                if (!result.bool) {
                  event.finish();
                  return;
                }
                trigger.player.judge(function (card) {
                  if (get.color(card) == 'black') return -1;
                  return 1;
                }).set('judge2', result => !result.bool);
                'step 2'
                if (result.suit === 'spade') {
                  trigger.player.addTempSkill('fengyin');
                }
                if (result.suit === 'club') {
                  trigger.player.chooseToDiscard(2, true);
                }
              },
              ai: {
                threaten: function (player, target) {
                  if (player.getStat().skill.jlsg_zhoufu > 0 && target == _status.currentPhase) {
                    return 2;
                  }
                  return 1.2;
                },
                expose: 0.2,
              }
            },
            // jlsg_zhoufu2: {
            //   init: function (player, skill) {
            //     var skills = player.getSkills(true, false);
            //     for (var i = 0; i < skills.length; i++) {
            //       if (get.skills[i]) {
            //         skills.splice(i--, 1);
            //       }
            //     }
            //     player.disableSkill(skill, skills);
            //   },
            //   onremove: function (player, skill) {
            //     player.enableSkill(skill);
            //   },
            //   mark: true,
            //   locked: true,
            //   intro: {
            //     content: function (storage, player, skill) {
            //       var list = [];
            //       for (var i in player.disabledSkills) {
            //         if (player.disabledSkills[i].contains(skill)) {
            //           list.push(i)
            //         }
            //       }
            //       if (list.length) {
            //         var str = '失效技能：';
            //         for (var i = 0; i < list.length; i++) {
            //           if (lib.translate[list[i] + '_info']) {
            //             str += get.translation(list[i]) + '、';
            //           }
            //         }
            //         return str.slice(0, str.length - 1);
            //       }
            //     },
            //   },
            // },
            jlsg_yingbing: {
              audio: "ext:极略:2",
              usable: 1,
              trigger: { global: 'judgeEnd' },
              filter: function (event, player) {
                if (!event.result) return false;
                if (!event.result.card) return false;
                if (event.nogain && event.nogain(event.result.card)) {
                  return false;
                }
                return get.color(event.result.card) == 'black' && event.player != player;
              },
              check: function (event, player) {
                return get.attitude(player, event.player) < 0;
              },
              content: function () {
                player.useCard({ name: 'sha' }, trigger.player, false);
              },
            },
            jlsg_danqi: {
              audio: 'danji',
              skillAnimation: true,
              unique: true,
              juexingji: true,
              derivation: ['jlsg_tuodao'],
              trigger: { player: 'phaseZhunbeiBegin' },
              forced: true,
              filter: function (event, player) {
                return !player.storage.jlsg_danqi && player.countCards('h') > player.hp;
              },
              init: function (player) {
                player.storage.jlsg_danqi = false;
              },
              content: function () {
                player.awakenSkill('jlsg_danqi');
                player.storage.jlsg_danqi = true;
                player.loseMaxHp();
                player.recover(2);
                player.addSkill('jlsg_tuodao');
              },
              ai: {
                maixie: true,
                maixie_hp: true,
                effect: {
                  target: function (card, player, target) {
                    if (get.tag(card, 'damage') && target.countCards('h') >= target.hp && target.hp > 1 && target.getDamagedHp() < 3) {
                      return [1, 1];
                    }
                  },
                }
              }
            },
            jlsg_tuodao: {
              audio: "ext:极略:1",
              trigger: { target: 'shaMiss' },
              filter: function (event, player) {
                return event.player.inRangeOf(player);
              },
              direct: true,
              content: function () {
                'step 0'
                player.addSkill('jlsg_tuodao_buff');
                'step 1'
                player.chooseToUse({ name: 'sha' }, '拖刀：是否对' + get.translation(trigger.player) + '使用一张【杀】？', trigger.player, -1)
                  .set('logSkill', 'jlsg_tuodao')
                // .set('oncard', function(card, player) {
                //   _status.event.directHit.addArray(game.players);
                // });
                'step 2'
                player.removeSkill('jlsg_tuodao_buff');

              },
              subSkill: {
                buff: {
                  audio: false,
                  trigger: { player: 'shaBegin' },
                  forced: true,
                  popup: false,
                  content: function () {
                    trigger.directHit = true;
                  },
                  ai: {
                    unequip: true,
                  }
                }
              }
            },
            jlsg_zhuiji: {
              audio: "ext:极略:2",
              forced: true,
              trigger: {
                source: 'damageEnd',
              },
              filter: function (event, player) {
                return event.player != player;
              },
              content: function () {
                var target = trigger.player;
                if (!target.storage.jlsg_zhuiji_effect) {
                  target.storage.jlsg_zhuiji_effect = [];
                }
                for (let info of target.storage.jlsg_zhuiji_effect) {
                  if (info.player == player) {
                    ++info.count;
                    target.markSkill('jlsg_zhuiji_effect');
                    return;
                  }
                }
                target.storage.jlsg_zhuiji_effect.push({
                  player: player,
                  count: 1,
                });
                target.addSkill('jlsg_zhuiji_effect');
                target.markSkill('jlsg_zhuiji_effect');
              },
              subSkill: {
                effect: {
                  charlotte: true,
                  onremove: true,
                  mod: {
                    globalTo: function (from, to, distance) {
                      for (let info of to.storage.jlsg_zhuiji_effect) {
                        if (info.player == from) {
                          return distance - info.count;
                        }
                      }
                    },
                  },
                  intro: {
                    markCount(content, player) {
                      return content.reduce((a, b) => a + b.count, 0);
                    },
                    content(content, player, skill) {
                      return content.map(info => `${get.translation(info.player)}计算与你的距离-${info.count}`)
                        .join('<br>');
                    },
                  },
                },
              },
            },
            jlsg_xionglie: {
              audio: "ext:极略:2",
              direct: true,
              shaRelated: true,
              trigger: { player: 'useCardToPlayered' },
              filter: function (event, target) {
                return event.isFirstTarget && event.card.name == 'sha';
              },
              content: function () {
                'step 0'
                var special = !game.hasPlayer(p => p != player && get.distance(player, p) > 1);
                event.special = special;
                var effect = 0;
                for (var p of trigger.targets) {
                  if (trigger.excluded.contains(p)) continue;
                  effect += get.effect(p, trigger.card, player, player)
                }
                var choice = effect >= 1;
                if (special) {
                  var prompt = `###${get.prompt(event.name)}###此【杀】不可被【闪】响应且伤害+1`;
                  player.chooseBool(prompt, choice);
                } else {
                  player.chooseControlList([
                    '此【杀】不可被【闪】响应',
                    '此【杀】伤害+1',
                  ],
                    get.prompt(event.name),
                    function (event, player) {
                      if (_status.event.choice) {
                        return [0, 1].randomGet();
                      }
                      return 2;
                    }
                  ).set('choice', choice);
                }
                'step 1'
                var crit = [false, false];
                if (event.special) {
                  if (result.bool) {
                    crit = [true, true];
                  }
                } else {
                  if (result.index < 2) {
                    crit[result.index] = true;
                  }
                }
                if (crit[0] || crit[1]) {
                  player.logSkill(event.name);
                }
                if (crit[0]) {
                  game.log(trigger.card, '不可被【闪】响应');
                  trigger.directHit.length = 0;
                  trigger.directHit.push(...game.players);
                }
                if (crit[1]) {
                  game.log(trigger.card, '伤害+1');
                  ++trigger.getParent().baseDamage;
                }
              },
              ai: {
                directHit_ai: true,
              },
            },
            jlsg_chenqing: {
              audio: "ext:极略:2",
              trigger: { global: 'dying' },
              usable: 1,
              filter: function (event, player) {
                return event.player.hp <= 0;
              },
              direct: true,
              init: function (player) {
                player.storage.jlsg_chenqing = 0;
              },
              content: function () {
                'step 0'
                player.chooseTarget(get.prompt2('jlsg_chenqing'), function (card, player, target) {
                  return target != player && target != _status.event.getTrigger().player;
                }).set('ai', function (target) {
                  var player = _status.event.player;
                  var trigger = _status.event.getTrigger();
                  var att1 = get.attitude(player, trigger.player); // 菜 -> 濒死角色
                  var att2 = get.attitude(target, trigger.player); // 目标 -> 濒死角色
                  var att3 = get.attitude(player, target); // 菜 -> 目标
                  switch (_status.event.discardNum) {
                    case 0:
                    case 1:
                      att1 *= 2;
                      att2 = 0;
                      break;
                    case 2:
                    case 3:
                      att2 *= (get.sgn(att2) == get.sgn(att1) ? 0.5 : -0.5);
                      att3 *= 1.2;
                      break;
                    case 4:
                      att2 *= (get.sgn(att2) == get.sgn(att1) ? 0.5 : -0.5);
                      att3 *= 1.5;
                      buff = Math.min(0.5, target.countCards('he') * 0.1);
                      if (att2 > 0) buff *= 1.2;
                      att3 *= 1 + buff;
                      break;
                    case 5:
                      att1 = att2 = 0;
                      if (target.countCards('he') == 0) att3 = 0;
                      if (target.countCards('he') <= 1) {
                        att3 = -att3;
                        break;
                      }
                      att3 += 0.5 * Math.random();
                      if (target.countCards('he') == 2) att3 = -0.4 * att3;
                      att3 *= Math.min(1, 0.1 * target.countCards('he'))
                      break;
                    default:
                      att1 = att2 = 0;
                      att3 = -att3;
                      if (target.countCards('he') + 4 < _status.event.discardNum) {
                        att3 *= target.countCards('he') / (_status.event.discardNum - 4);
                      }
                      break;
                  }
                  // if (att3 < 0) return 0;
                  return att1 + att2 + att3;
                }).set('discardNum', player.storage.jlsg_chenqing);
                'step 1'
                if (result.bool) {
                  // player.addTempSkill('chenqing2', 'roundStart');
                  event.target = result.targets[0];
                  event.target.draw(4);
                  player.logSkill('chenqing', event.target);
                }
                else {
                  event.finish();
                }
                'step 2'
                var num = player.storage.jlsg_chenqing;
                var target = event.target;
                var tosave = trigger.player;
                var att = get.attitude(target, tosave);
                var hastao = target.countCards('h', 'tao');
                if (num == 0) {
                  return;
                }
                target.chooseToDiscard(num, true, 'he').set('ai', function (card) {
                  var num = _status.event.selectCard[0];
                  var hastao = _status.event.hastao;
                  var att = _status.event.att;
                  if (!hastao && att > 0) {
                    var suit = get.suit(card);
                    for (var i = 0; i < ui.selected.cards.length; i++) {
                      if (get.suit(ui.selected.cards[i]) == suit) {
                        return -4 - get.value(card);
                      }
                    }
                  }
                  if (att < 0 && ui.selected.cards.length + 1 == num) {
                    var suit = get.suit(card);
                    for (var i = 0; i < ui.selected.cards.length; i++) {
                      if (get.suit(ui.selected.cards[i]) == suit) {
                        return -get.value(card);
                      }
                    }
                    return -10 - get.value(card);
                  }
                  return -get.value(card);
                }).set('hastao', hastao).set('att', att);
                'step 3'
                ++player.storage.jlsg_chenqing;
                player.markSkill('jlsg_chenqing');
                if (result.cards) {
                  var suits = [];
                  for (var i = 0; i < result.cards.length; i++) {
                    suits.add(get.suit(result.cards[i]));
                  }
                  if (suits.length != result.cards.length) {
                    return;
                  }
                }
                if (game.checkMod({ name: 'tao', isCard: true }, player, trigger.player, 'unchanged', 'cardSavable', player)) {
                  event.target.useCard({ name: 'tao', isCard: true }, trigger.player);
                }
              },
              intro: {
                content: '已经发动了&次技能',
              },
              ai: {
                expose: 0.2,
                threaten: 1,
              }
            },
            jlsg_mozhi: {
              audio: "ext:极略:2",
              trigger: { global: 'phaseJieshuBegin' },
              direct: true,
              filter: function (event, player) {
                return event.player.getHistory('useCard', function (evt) {
                  return ['basic', 'trick'].contains(get.type(evt.card));
                }).length > 0 && player.countCards('hs') > 0;
              },
              content: function () {
                var card = trigger.player.getHistory('useCard', function (evt) {
                  return ['basic', 'trick'].contains(get.type(evt.card));
                }).pop().card
                event._result = {};
                card = { name: card.name, nature: card.nature };
                if (card.name != 'jiu' && lib.filter.cardEnabled(card)) {
                  if (game.hasPlayer(function (current) {
                    return player.canUse(card, current);
                  })) {
                    lib.skill.jlsg_mozhix.viewAs = card;
                    var next = player.chooseToUse();
                    if (next.isOnline()) {
                      player.send(function (card) {
                        lib.skill.jlsg_mozhix.viewAs = card;
                      }, card)
                    }
                    next.logSkill = 'jlsg_mozhi';
                    next.set('openskilldialog', `###${get.prompt(event.name)}###将一张手牌当${get.translation(card)}使用`);
                    next.set('norestore', true);
                    next.set('_backupevent', 'jlsg_mozhix');
                    next.set('custom', {
                      add: {},
                      replace: { window: function () { } }
                    });
                    next.backup('jlsg_mozhix');
                  }
                }
              },
            },
            jlsg_mozhix: {
              filterCard: function (card) {
                return get.itemtype(card) == 'card';
              },
              selectCard: 1,
              position: 'hs',
              popname: true,
            },
            jlsg_hemeng: {
              audio: "ext:极略:1",
              enable: 'phaseUse',
              filter: function (event, player) {
                return player.countCards('h') && player.storage.jlsg_hemeng_usable;
              },
              filterTarget: function (card, player, target) {
                return player != target;
              },
              content: function () {
                'step 0'
                player.storage.jlsg_hemeng_usable--;
                // target.viewCards('和盟', player.getCards('h'));
                target.gainPlayerCard(player, 'h', 'visible', true);
                'step 1'
                // player.viewCards('和盟', target.get('he'));
                // target.isUnderControl();
                player.gainPlayerCard(target, 'visible', true, 'he').set('ai', function (button) {
                  var card = button.link;
                  return get.value(card);
                });
              },
              init: function (player) {
                player.storage.jlsg_hemeng_usable = 0;
              },
              group: ['jlsg_hemeng_usable'],
              subSkill: {
                usable: {
                  trigger: { player: 'phaseUseBegin' },
                  popup: false,
                  forced: true,
                  content: function () {
                    player.storage.jlsg_hemeng_usable = player.getDamagedHp() + 1;
                  }
                }
              },
              ai: {
                order: 6,
                result: {
                  player: 1,
                  target: -0.5,
                }
              }
            },
            jlsg_sujian: {
              audio: "ext:极略:1",
              trigger: { player: 'gainEnd' },
              filter: function (event, player) {
                // return (event.cards[0].original == 'h' || event.cards[0].original == 'e' || event.cards[0].original == 'j');
                if (!event.source || event.source == player || !event.source.isIn()) return false;
                var evt = event.getl(event.source);
                return evt && evt.cards2 && evt.cards2.length != 0;
              },
              direct: true,
              content: function () {
                'step 0'
                player.chooseTarget(get.prompt2('jlsg_sujian'), function (card, player, target) {
                  return player != target && target.countDiscardableCards(player, 'he') > 0;
                }).ai = function (target) {
                  // if (!player.countCards('he')) return -get.attitude(player, target) && target.countCards('he');
                  // if (player.countCards('he') > 4) return get.attitude(player, target) && target.countCards('he');
                  // return 0;
                  return get.effect(target, { name: 'guohe' }, player, player) + get.effect(player, { name: 'guohe' }, target, player) - 1;
                }
                'step 1'
                if (result.bool) {
                  player.logSkill('jlsg_sujian', result.targets);
                  result.targets[0].discardPlayerCard(player, 'he', true);
                  player.discardPlayerCard(result.targets[0], 'he', true);
                }
              }
            },
            jlsg_yexi: {
              audio: "ext:极略:1",
              trigger: { player: 'phaseAfter' },
              filter: function (event, player) {
                return player.countCards('h') > 0;
              },
              direct: true,
              content: function () {
                'step 0'
                var check, i, num = 0;
                for (i = 0; i < game.players.length; i++) {
                  if (player != game.players[i] && game.players[i].num('h') > 1) {
                    var att = get.attitude(player, game.players[i]);
                    if (att > 3) {
                      num++;
                    }
                  }
                }
                check = (num > 0 && (player.countCards('h') > 1 || player.hp > 2));
                player.chooseCardTarget({
                  ai1: function (card) {
                    var evt = _status.event;
                    if (!evt.check) return 0;
                    return 6 - get.useful(card);
                  },
                  ai2: function (target) {
                    var evt = _status.event;
                    if (!evt.check) return 0;
                    return get.attitude(evt.player, target);
                  },
                  filterTarget: function (card, player, target) {
                    return target != player;
                  },
                  filterCard: true,
                  prompt: '是否发动【夜袭】？',
                  check: check,
                  target: target
                });
                'step 1'
                if (result.bool) {
                  event.target = result.targets[0];
                  player.logSkill('jlsg_yexi', event.target);
                  player.discard(result.cards);
                  event.target.chooseControl('选项一', '选项二', function () {
                    return Math.random() < 0.5 ? '选项一' : '选项二';
                  }).set('prompt', '夜袭<br><br><div class="text">1:使用黑色【杀】时无视防具.</div><br><div class="text">2:使用红色【杀】时无视距离.</div></br>');
                } else {
                  event.finish();
                }
                'step 2'
                if (result.control == '选项一') {
                  event.target.addSkill('jlsg_yexi_getBlack');
                } else {
                  event.target.addSkill('jlsg_yexi_getRed');
                }
              },
              subSkill: {
                getBlack: {
                  unique: true,
                  trigger: { player: 'phaseUseBegin' },
                  forced: true,
                  popup: false,
                  mark: true,
                  marktext: '夜',
                  intro: {
                    name: '夜袭',
                    content: '使用黑色【杀】时无视防具'
                  },
                  content: function () {
                    player.addTempSkill('jlsg_yexi_black', 'phaseAfter');
                    player.removeSkill('jlsg_yexi_getBlack');
                  }
                },
                getRed: {
                  trigger: { player: 'phaseUseBegin' },
                  forced: true,
                  unique: true,
                  popup: false,
                  mark: true,
                  marktext: '夜',
                  intro: {
                    name: '夜袭',
                    content: '使用红色【杀】时无视距离'
                  },
                  content: function () {
                    player.addTempSkill('jlsg_yexi_red', 'phaseAfter');
                    player.removeSkill('jlsg_yexi_getRed');
                  }
                },
                black: {
                  mark: true,
                  unique: true,
                  marktext: '夜',
                  intro: {
                    name: '夜袭',
                    content: '使用黑色【杀】时无视防具'
                  },
                  trigger: { player: 'shaBefore' },
                  forced: true,
                  popup: false,
                  filter: function (event, player) {
                    return event.card && get.color(event.card) == 'black';
                  },
                  content: function () {
                    player.addTempSkill('unequip', 'shaAfter');
                  }
                },
                red: {
                  mark: true,
                  unique: true,
                  marktext: '夜',
                  intro: {
                    name: '夜袭',
                    content: '使用红色【杀】时无视距离'
                  },
                  mod: {
                    targetInRange: function (card, player) {
                      if (card.name == 'sha' && get.color(card) == 'red') return true;
                    }
                  }
                }
              }
            },
            jlsg_kuangyan: {
              audio: "ext:极略:2",
              group: ['jlsg_kuangyan1', 'jlsg_kuangyan2']
            },
            jlsg_kuangyan1: {
              audio: "ext:极略:true",
              priority: -1,
              trigger: { player: 'damageBegin3' },
              filter: function (event, player) {
                return !event.nature && event.num == 1;
              },
              forced: true,
              content: function () {
                trigger.cancel();
              },
              ai: {
                effect: {
                  target: function (card, player, target) {
                    if (get.tag(card, 'damage')) {
                      if (!get.nature(card)) {
                        if (card.name == 'sha' && (!player.hasSkill('jiu') || !player.hasSkill('reluoyi') || !player.hasSkill('luoyi'))) return 0.1;
                        return 0.2;
                      }
                    }
                  },
                }
              },
              group: null,
            },
            jlsg_kuangyan2: {
              audio: "ext:极略:true",
              trigger: { player: 'damageBegin3' },
              filter: function (event, player) {
                return event.num >= 2;
              },
              priority: -1,
              forced: true,
              content: function () {
                trigger.num++;
              },
              ai: {
                effect: {
                  target: function (card, player, target) {
                    if (get.tag(card, 'damage')) {
                      if (card.name == 'sha' && (player.hasSkill('jiu') || player.hasSkill('reluoyi') || player.hasSkill('luoyi'))) return [1, -2];
                    }
                  },
                }
              },
              group: null,
            },
            jlsg_chaochen: {
              audio: "ext:极略:1",
              usable: 1,
              enable: 'phaseUse',
              filterCard: true,
              selectCard: [1, Infinity],
              discard: false,
              lose: false,
              // prepare: function (cards, player, targets) {
              //   player.$give(cards.length, targets[0]);
              // },
              filterTarget: function (card, player, target) {
                return player != target;
              },
              check: function (card) {
                if (ui.selected.cards.length == 0) return 4 - get.value(card);
                return 0;
              },
              content: function () {
                player.give(cards, target);
                // target.gain(cards);
                // target.storage.jlsg_chaochen = player;
                target.addTempSkill('jlsg_chaochen2', { player: 'phaseAfter' });
                target.markAuto('jlsg_chaochen2', [player]);
              },
              ai: {
                order: 0.5,
                result: {
                  player: -1,
                  target: function (player, target) {
                    var th = target.countCards('h');
                    if (th + 1 > target.hp) return -1;
                    return 0;
                  }
                }
              }
            },
            jlsg_chaochen2: {
              audio: "jlsg_chaochen",
              mark: true,
              marktext: '朝',
              intro: {
                content: "回合开始时，若手牌数大于体力值，受到$造成的1点伤害",
              },
              trigger: { player: 'phaseBegin' },
              filter: function (event, player) {
                return player.storage.jlsg_chaochen2 && player.countCards('h') > player.hp;
              },
              direct: true,
              onremove: function (player) {
                delete player.storage.jlsg_chaochen2;
              },
              content: function () {
                'step 0'
                var target = player.storage.jlsg_chaochen2.shift();
                target.logSkill('jlsg_chaochen2', player);
                player.damage(target);
                if (player.storage.jlsg_chaochen2.length) {
                  event.redo();
                }
                // player.storage.jlsg_chaochen2.logSkill('jlsg_chaochen2', player);
                // player.damage(player.storage.jlsg_chaochen2);
                // delete player.storage.jlsg_chaochen2;
              }
            },
            jlsg_quanzheng: {
              audio: "ext:极略:1",
              trigger: { target: 'useCardToBefore' },
              filter: function (event, player) {
                if (event.player == player) return false;
                if (event.player.countCards('h') > player.countCards('h') || event.player.countCards('e') > player.countCards('e'))
                  return get.type(event.card) == 'trick' || event.card.name == 'sha';
                return false;
              },
              frequent: true,
              content: function () {
                player.draw();
              }
            },
            jlsg_shejian: {
              audio: "ext:极略:1",
              enable: 'phaseUse',
              filter: function (event, player) {
                return !player.get('e', '2') &&
                  game.countPlayer(p => p.countCards('he') && player != p && !p.hasSkill('jlsg_shejian2'));
              },
              filterTarget: function (card, player, target) {
                return target.countCards('he') && player != target && !target.hasSkill('jlsg_shejian2');
              },
              content: function () {
                'step 0'
                target.addTempSkill('jlsg_shejian2');
                player.discardPlayerCard('he', target, true);
                target.chooseBool('是否对' + get.translation(player) + '使用一张【杀】？').ai = function (event, player) {
                  return get.effect(player, { name: 'sha' }, target, target) + 3;
                }
                'step 1'
                if (result.bool) {
                  target.useCard({ name: 'sha' }, player, false);
                }
              },
              ai: {
                order: 9,
                result: {
                  player: function (player, target) {
                    if (player.hp <= 2) return -2;
                    if (!player.countCards('h', 'shan')) return -1;
                    return -0.5;
                  },
                  target: -1,
                }
              }
            },
            jlsg_shejian2: {},
            jlsg_kuangao: {
              audio: "ext:极略:2",
              trigger: { target: 'shaAfter' },
              filter: function (event, player) {
                if (!event.player) return false;
                return player.countCards('he') // && event.player.countCards('he')
                  || event.player.countCards('h') < Math.min(5, event.player.maxHp);
              },
              check: function (event, player) {
                var phe = player.countCards('he');
                var the = event.player.countCards('he');
                if (the > phe && get.attitude(player, event.player) < 0) return 1;
                if (event.player.countCards('h') < event.player.maxHp && get.attitude(player, event.player) > 0) return 1;
                return 0;
              },
              direct: true,
              content: function () {
                'step 0'
                event.target = trigger.player;
                var prompts = [
                  `弃置所有牌，然后${get.translation(event.target)}弃置所有牌`,
                  `令${get.translation(event.target)}摸牌至体力上限（至多摸至五张）`
                ];
                event.prompts = [];
                if (player.countCards('he')) {
                  event.prompts.push(0);
                }
                if (event.target.countCards('h') < Math.min(5, event.target.maxHp)) {
                  event.prompts.push(1);
                }
                var coeff = 0.5 * Math.random() + 0.75; // target card guess coeff
                var ai = function (event, player) {
                  if (get.attitude(player, event.target) > 0) {
                    if (!event.prompts.contains(1)) return 'cancel2';
                    return prompts[1];
                  } else {
                    if (!event.prompts.contains(0)) return 'cancel2';
                    var targetHEValue = coeff * event.target.getCards('h').reduce((a, b) => a + get.value(b, event.target), 0)
                      + event.target.getCards('e').reduce((a, b) => a + get.value(b, event.target), 0);
                    var playerHEValue = player.getCards('he').reduce((a, b) => a + get.value(b, player), 0);
                    return (coeff * targetHEValue * get.attitude(player, event.target)
                      - targetHEValue * get.attitude(player, player) > 0)
                      ? prompt[0] : 'cancel2';
                  }
                };
                player.chooseControlList(event.prompts.map(n => prompts[n]), ai, get.prompt(event.name, event.target));
                'step 1'
                if (result.control == 'cancel2') {
                  event.finish();
                  return;
                }
                player.logSkill(event.name, event.target);
                if (event.prompts[result.index] == 0) {
                  player.discard(player.getCards('he'));
                  event.target.discard(event.target.getCards('he'));
                } else {
                  event.target.drawTo(event.target.maxHp);
                }
              },
              // contentx: function () {
              //   'step 0'
              //   player.chooseControl('选项一', '选项二', function () {
              //     var phe = player.countCards('he');
              //     var the = trigger.player.countCards('he');
              //     if (the > phe && get.attitude(player, trigger.player) < 0) return '选项一';
              //     if (get.attitude(player, trigger.player) > 0) return '选项二';
              //     return '选项二';
              //   }).set('prompt', '狂傲<br><br><div class="text">1:弃置所有牌(至少一张),然后' + get.translation(trigger.player) + '弃置所有牌.</div><br><div class="text">2:令' + get.translation(trigger.player) + '将手牌补至其体力上限的张数(至多5张).</div></br>');
              //   'step 1'
              //   if (result.control == '选项一') {
              //     player.discard(player.get('he'));
              //     trigger.player.discard(trigger.player.get('he'));
              //   } else {
              //     if (Math.min(5, trigger.player.maxHp) - trigger.player.countCards('h')) {
              //       trigger.player.drawTo(trigger.player.maxHp);
              //     }
              //   }
              // },
              // ai: {
              //   effect: {
              //     target: function (card, player, target, current) {
              //       if (card.name != 'sha') return;
              //       if (get.attitude(player, target) < 0) return [1, -target.countCards('he'), 1, -player.countCards('he')];
              //       if (get.attitude(player, target) > 3 && player.countCards('h') < player.maxHp - 2 && target.hp > 2) return [1, 0.5, 1, Math.min(5, player.maxHp) - player.countCards('h')];
              //       return [1, -target.countCards('he'), 1, -player.countCards('he')];
              //     }
              //   }
              // }
            },
            jlsg_yinbing: {
              audio: "ext:极略:1",
              trigger: { global: 'shaBegin' },
              filter: function (event, player) {
                if (event.player == player || event.target == player) return false;
                return event.target.inRangeOf(player) && event.target.countCards('e');
              },
              logTarget: 'target',
              check: function (event, player) {
                if (player.countCards('h', 'shan') && get.effect(event.target, { name: 'sha' }, event.player, player) < 0) {
                  return 1;
                }
                if (player.hp == 1 && event.player.countCards('e', 'guanshi')) return 0;
                if (get.attitude(player, event.target) > 0 && player.hp >= 2 && get.effect(event.target, { name: 'sha' }, event.player, player) < 0) return 1;
                return 0;
              },
              content: function () {
                player.gainPlayerCard(trigger.target, 'e', true);
                trigger.target = player;
                trigger.untrigger();
                trigger.trigger('useCardToBefore');
                trigger.trigger('shaBefore');
              },
              group: ['jlsg_yinbing2'],
            },
            jlsg_yinbing2: {
              audio: "ext:极略:true",
              trigger: { target: 'shaBefore' },
              filter: function (event, player) {
                return player.countCards('he') > 0 && player.isDamaged();
              },
              direct: true,
              content: function () {
                'step 0'
                var next = player.chooseToDiscard(get.prompt('jlsg_yinbing2'), 'he')
                next.ai = function (card) {
                  if (player.getDamagedHp() > 1) return 6 - get.value(card);
                  if (player.getDamagedHp() > 2) return 10 - get.value(card);
                  return 4 - get.value(card);
                };
                next.logSkill = 'jlsg_yinbing2';
                'step 1'
                if (result.bool) {
                  player.draw(player.getDamagedHp());
                }
              },
            },
            jlsg_fenwei: {
              audio: "ext:极略:1",
              trigger: { source: 'damageBegin1' },
              filter: function (event, player) {
                return event.card && event.card.name == 'sha' && event.notLink() && event.player.countCards('h');
              },
              forced: true,
              content: function () {
                'step 0'
                event.card = trigger.player.get('h').randomGet();
                player.line(trigger.player);
                player.showCards(event.card);
                'step 1'
                if (event.card.name == 'tao' || event.card.name == 'jiu') {
                  player.gain(event.card);
                  trigger.player.$give(event.card, player);
                }
                if (get.type(event.card) != 'basic') {
                  trigger.player.discard(event.card);
                  trigger.num++;
                }
              },
            },
            jlsg_shiyong: {
              trigger: { player: 'damageEnd' },
              audio: "ext:极略:1",
              filter: function (event) {
                if (event.card && (event.card.name == 'sha')) {
                  if (get.color(event.card) == 'red') return true;
                  if (event.source && event.source.hasSkill('jiu')) return true;
                }
                return false;
              },
              forced: true,
              content: function () {
                'step 0'
                player.loseMaxHp();
                'step 1'
                if (player.maxHp <= 1) {
                  player.storage.shiyongEndLife = trigger.source;
                }
              },
              ai: {
                effect: {
                  target: function (card, player, target, current) {
                    if (card.name == 'sha') {
                      if (get.color(card) == 'red') return [1, -2];
                      if (player.hasSkill('jiu')) return [1, -1.5];
                    }
                    if (get.tag(card, 'save') && target.isDying() && target.storage.shiyongEndLife) {
                      var source = target.storage.shiyongEndLife;
                      if (get.attitude(source, target) < 0 && target.identity == 'fan') return;
                      return 'zeroplayertarget';
                    }
                  }
                },
                neg: true,
              }
            },
            jlsg_angyang: {
              shaRelated: true,
              audio: "ext:极略:1",
              trigger: { player: ['shaBefore', 'juedouBefore'] },
              filter: function (event, player) {
                if (event.card.name == 'juedou') return true;
                return get.color(event.card) == 'red';
              },
              frequent: true,
              content: function () {
                if (trigger.target.countCards('j')) {
                  player.draw(2);
                } else {
                  player.draw();
                }
              },
              ai: {
                effect: {
                  target: function (card, player, target) {
                    if (card.name == 'sha' && get.color(card) == 'red') return [1, 0.6];
                  },
                  player: function (card, player, target) {
                    if (card.name == 'sha' && get.color(card) == 'red') return [1, 1];
                  }
                }
              },
              group: 'jlsg_angyang2'
            },
            jlsg_angyang2: {
              audio: "jlsg_angyang",
              trigger: { target: ['shaBefore', 'juedouBefore'] },
              filter: function (event, player) {
                if (event.card.name == 'juedou') return true;
                return get.color(event.card) == 'red';
              },
              frequent: true,
              content: function () {
                if (trigger.player.countCards('j')) {
                  player.draw(2);
                } else {
                  player.draw();
                }
              },
              ai: {
                effect: {
                  target: function (card, player, target) {
                    if (card.name == 'juedou') return [1, 0.6];
                  },
                  player: function (card, player, target) {
                    if (card.name == 'juedou') return [1, 1];
                  }
                }
              },
            },
            jlsg_weifeng: {
              audio: "ext:极略:1",
              trigger: { player: 'phaseBegin' },
              filter: function (event, player) {
                return player.countCards('h') < player.hp && player.countCards('h') > 0;
              },
              direct: true,
              content: function () {
                'step 0'
                player.chooseTarget('是否发动【威风】？', function (card, player, target) {
                  return player != target && target.countCards('h');
                }).ai = function (target) {
                  return -get.attitude(player, target);
                }
                'step 1'
                if (result.bool) {
                  event.target = result.targets[0];
                  player.logSkill('jlsg_weifeng', event.target);
                  player.chooseToCompare(event.target);
                } else {
                  event.finish();
                }
                'step 2'
                if (result.bool) {
                  player.draw(2);
                } else {
                  event.target.draw(2);
                }
              }
            },
            jlsg_xieli: {
              audio: "ext:极略:1",
              zhuSkill: true,
              trigger: { player: 'chooseToCompareBegin' },
              filter: function (event, player) {
                return player.hasZhuSkill('jlsg_xieli') && game.hasPlayer(p => p != player && p.group == 'wu');
              },
              check: function (event, player) {
                return game.hasPlayer(p => p != player && p.group == 'wu' && get.attitude(player, p) > 1);
              },
              content: function () {
                'step 0'
                event.targets = game.filterPlayer(p => p != player && p.group == 'wu');
                event.cards = [];
                'step 1'
                var current = event.targets.shift();
                event.current = current;
                if (!current) {
                  event.goto(3);
                } else if (!current.countCards('h')) {
                  event.redo();
                } else {
                  current.chooseCard('是否帮' + get.translation(player) + '打出一张拼点牌？').ai = function (card) {
                    if (get.attitude(current, player) > 2) {
                      return get.number(card, player) > 8 && 7 - get.value(card);
                    } else if (get.attitude(current, player) < -2 && event.cards.length == 0 &&
                      !event.targets.some(p => p.countCards('h') && get.attitude(p, player) > 2)) {
                      // 使坏
                      return get.number(card, player) < 5 && 7 - get.value(card);
                    }
                    return 0;
                  }
                }
                'step 2'
                if (result.bool) {
                  event.cards = event.cards.concat(result.cards[0]);
                  event.current.lose(result.cards[0], ui.ordering).set('getlx', false);
                  // event.current.$give(1, player);
                  event.current.$throw(1, 1000);
                }
                event.goto(1);
                'step 3'
                if (event.cards.length) {
                  var dialog = ui.create.dialog('协力', event.cards);
                  player.chooseButton(dialog, true).set('ai', function (button) {
                    return get.number(button.link, player);
                  });
                } else {
                  event.finish();
                }
                'step 4'
                if (!trigger.fixedResult) trigger.fixedResult = {};
                trigger.fixedResult[player.playerid] = result.buttons[0].link;
                // player.gain(result.buttons[0].link);
                // player.discard(event.cards);
              },
            },
            jlsg_jushou: {
              audio: "ext:极略:1",
              trigger: { player: 'phaseJieshuBegin' },
              check: function (event, player) {
                var num = game.filterPlayer(p => p != player && player.inRangeOf(p)).length;
                if (player.isTurnedOver()) return true;
                if (num > 2) return 1;
                return 0;
              },
              content: function () {
                'step 0'
                var num = game.filterPlayer(p => p != player && player.inRangeOf(p)).length;
                player.draw(Math.min(5, num + 1));
                player.turnOver();
              }
            },
            jlsg_yicong: {
              audio: 'yicong',
              inherit: 'yicong'
            },
            jlsg_muma: {
              audio: "ext:极略:1",
              trigger: { global: 'loseAfter' },
              forced: true,
              filter: function (event, player) {
                if (event.player == player) return false;
                if (_status.currentPhase == player) return false;
                for (var i = 0; i < event.cards.length; i++) {
                  if (event.cards[i].original == 'e' && get.position(event.cards[i]) == 'd')
                    return !player.get('e', get.subtype(event.cards[i])[5]) && (get.subtype(event.cards[i]) == 'equip3' || get.subtype(event.cards[i]) == 'equip4');
                }
                return false;
              },
              content: function () {
                for (var i = 0; i < trigger.cards.length; i++) {
                  if (trigger.cards[i].original == 'e' && !player.get('e', get.subtype(trigger.cards[i])[5]) && (get.subtype(trigger.cards[i]) == 'equip3' || get.subtype(trigger.cards[i]) == 'equip4'))
                    player.gain(trigger.cards[i], 'gain');
                }

              },
            },
            jlsg_suiji: {
              audio: "ext:极略:2",
              trigger: { global: 'phaseDiscardBegin' },
              filter: function (event, player) {
                return event.player != player;
              },
              direct: true,
              content: function () {
                'step 0'
                player.chooseCard('是否对' + get.translation(trigger.player) + '发动【随骥】？', [1, Infinity])
                  .set('ai', function (card) {
                    var cha = trigger.player.countCards('h') - trigger.player.hp;
                    var att = get.attitude(player, trigger.player);
                    if (cha == 0 && ui.selected.cards.length == 0) return att > 3 ? 2 : -1;
                    if (cha >= 1) {
                      if (ui.selected.cards.length == 0) {
                        if (att > 0) return get.value(card);
                        return 7.5 - get.value(card);
                      }
                      if (ui.selected.cards.length >= 1) return -1;
                    }
                    if (trigger.player.countCards('h') <= 2 && get.attitude(player, trigger.player) > 3 && player.countCards('h') > 3) return 6 - get.value(card);
                    return 0;
                  });
                'step 1'
                if (result.bool) {
                  player.logSkill('jlsg_suiji', trigger.player);
                  trigger.player.gain(result.cards, player, 'giveAuto');
                } else {
                  event.finish();
                }
                'step 2'
                var num = trigger.player.countCards('h') - trigger.player.hp;
                if (num > 0) {
                  var next = trigger.player.chooseCard('交给' + get.translation(player) + get.translation(num) + '张手牌', num, true)
                  next.ai = function (card) {
                    var att = get.attitude(trigger.player, player);
                    if (att > 3) {
                      if (ui.selected.cards.length == 0 && trigger.hp > player.hp) {
                        return get.value(card);
                      }
                    }
                    return 20 - get.value(card);
                  };
                } else {
                  event.finish();
                }
                'step 3'
                if (result.bool) {
                  player.gain(result.cards, trigger.player, 'giveAuto');
                }
              }
            },
            jlsg_fengyi: {
              audio: "ext:极略:2",
              trigger: { target: 'useCardToBefore' },
              filter: function (event, player) {
                return get.type(event.card) == 'trick' && event.targets.length == 1;
              },
              frequent: true,
              content: function () {
                player.draw();
              },
              ai: {
                effect: {
                  target: function (card, player, target) {
                    if (get.type(card) == 'trick') {
                      if (card.name == 'jiedao') return;
                      if (get.tag(card, 'multitarget')) return;
                      return [0.5, 0.6];
                    }
                  },
                }
              }
            },
            jlsg_yalv: {
              audio: "ext:极略:2",
              trigger: { player: ['damageEnd', 'phaseUseBegin'] },
              frequent: true,
              content: function () {
                'step 0'
                event.cards = get.cards(2);
                game.cardsGotoOrdering(event.cards);
                var dialog = ui.create.dialog("雅虑：是否调换牌堆顶两张牌的顺序？", event.cards, 'hidden');
                player.chooseBool(dialog, get.value(event.cards[0]) < get.value(event.cards[1]));
                // player.chooseCardButton('雅虑:请选择牌堆顶的牌,先选择的在上', 2, event.cards, true);
                'step 1'
                if (!result.bool) {
                  event.cards.reverse();
                }
                for (var card of event.cards) {
                  ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
                }
                player.chooseBool('是否摸一张牌？', () => true).set('frequentSkill', event.name);
                'step 2'
                if (result.bool) {
                  player.draw();
                }
              }
            },
            jlsg_xiemu: {
              audio: "ext:极略:1",
              trigger: { global: 'phaseZhunbeiBegin' },
              direct: true,
              content: function () {
                'step 0'
                player.chooseCard('是否对' + get.translation(trigger.player) + '发动【协穆】？').ai = function (card) {
                  if (get.attitude(player, trigger.player) > 0 && trigger.player.hasJudge('lebu')) return get.suit(card) == 'heart';
                  if (get.attitude(player, trigger.player) > 0 && trigger.player.hasJudge('bingliang')) return get.suit(card) == 'club';
                  if (get.attitude(player, trigger.player) > 0 && trigger.player.hasJudge('shandian')) return (get.suit(card) != 'spade' || (card.number < 2 || card.number > 9));
                  if (get.attitude(player, trigger.player) < 0 && trigger.player.hasJudge('lebu')) return get.suit(card) != 'heart';
                  if (get.attitude(player, trigger.player) < 0 && trigger.player.hasJudge('bingliang')) return get.suit(card) != 'club';
                  if (get.attitude(player, trigger.player) < 0 && trigger.player.hasJudge('shandian')) return (get.suit(card) == 'spade' && card.number >= 2 && card.number <= 9);
                  if (trigger.player == player) return 10;
                  return 0;
                }
                'step 1'
                if (result.bool) {
                  player.logSkill('jlsg_xiemu', trigger.player);
                  trigger.player.addTempSkill('jlsg_xiemu3');
                  player.lose(result.cards, ui.cardPile, 'insert');
                  game.log(player, '将一张牌置于牌堆顶');
                  player.$throw(1, 1000);
                }
              },
              group: 'jlsg_xiemu2',
            },
            jlsg_xiemu2: {
              trigger: { global: 'phaseJieshuBegin' },
              audio: "ext:极略:1",
              logTarget: 'player',
              prompt2: function (event, player) {
                if (player == event.player) {
                  return "摸一张牌";
                } else {
                  return `令${get.translation(event.player)}摸一张牌`;
                }
              },
              frequent: function (event, player) {
                return event.player == player;
              },
              filter: function (event, player) {
                return event.player.hasSkill('jlsg_xiemu3');
              },
              check: function (event, player) {
                if (get.attitude(player, event.player) > 0) return 1;
                return 0;
              },
              content: function () {
                // player.logSkill('jlsg_xiemu', trigger.player);
                trigger.player.draw();
              },
            },
            jlsg_xiemu3: {},
            jlsg_zhejie: {
              audio: "ext:极略:1",
              trigger: { global: 'phaseDiscardEnd' },
              filter: function (event, player) {
                return event.player != player && player.countCards('h') > 0;
              },
              direct: true,
              content: function () {
                'step 0'
                var next = player.chooseToDiscard('是否发动对' + get.translation(trigger.player) + '【折节】？');
                next.ai = function (card) {
                  if (get.attitude(player, trigger.player) < 0 && trigger.player.countCards('he')) return 5.5 - get.value(card);
                  return 0;
                };
                next.logSkill = ['jlsg_zhejie', trigger.player];
                'step 1'
                if (result.bool && trigger.player.countCards('he') > 0) {
                  trigger.player.chooseToDiscard('he', true);
                } else {
                  event.finish();
                }
                'step 2'
                if (get.type(result.cards[0]) == 'equip') {
                  event.card = result.cards[0];
                  player.chooseTarget('选择一名目标获得' + get.translation(event.card), function (card, player, target) {
                    return trigger.player != target;
                  }).ai = function (target) {
                    if (get.attitude(player, target) <= 0) return -5;
                    return 6 - target.countCards('e');
                  }
                } else {
                  event.finish();
                }
                'step 3'
                if (result.bool) {
                  result.targets[0].gain(event.card, 'gain');
                }
              },
              ai: {
                expose: 0.2,
              }
            },
            jlsg_fengya: {
              audio: "ext:极略:1",
              trigger: { player: 'damageBegin3' },
              frequent: true,
              filter: function (event) {
                return event.source != undefined;
              },
              check: function () {
                return 1;
              },
              content: function () {
                "step 0"
                player.draw();
                trigger.source.chooseBool('是否摸一张牌并令此伤害-1?').ai = function () {
                  if (get.attitude(trigger.source, player) == 0 && trigger.num <= 1) return 2;
                  return get.attitude(trigger.source, player) > 0;
                }
                "step 1"
                if (result.bool) {
                  trigger.source.draw();
                  trigger.num--;
                }
              },
              ai: {
                maixie: true,
                maixie_hp: true,
                effect: {
                  target: function (card, player, target) {
                    if (get.attitude(target, player) < 0) return;
                    if (get.tag(card, 'damage')) {
                      return [1, 0.3, 1, 0.9];
                    }
                  },
                }
              }
            },
            jlsg_yijian: {
              audio: "ext:极略:1",
              trigger: { player: 'phaseUseBefore' },
              direct: true,
              content: function () {
                'step 0'
                player.chooseTarget('是否发动【义谏】？', function (card, player, target) {
                  return player != target;
                }).ai = function (target) {
                  var hasTrick = player.hasCard(function (card) {
                    return ['trick'].contains(get.type(card));
                  }, 'h');
                  if (get.attitude(player, target) <= 0) return 0;
                  var result = Math.max(1, 5 - target.countCards('h'));
                  if (player.isHealthy()) {
                    if (!hasTrick) {
                      if (player.hp >= player.countCards('h')) {
                        return player.hasCard(function (card) {
                          return get.tag(card, 'damage')
                        }) ? 0 : result;
                      } else {
                        return player.hasCard(function (card) {
                          return get.tag(card, 'damage') && card.name != 'sha';
                        }) ? 0 : result;
                      }
                    }
                  } else {
                    var compare = target.countCards('h') + 1 >= player.countCards('h');
                    if (!hasTrick && player.countCards('h') < player.hp) return compare ? 10 : result;
                    if (player.hp <= 2 && compare && ((player.countCards('h') >= 2 && player.countCards('h', 'sha') <= 1) || player.countCards('h') < 2)) return 10;
                    return 0;
                  }
                }
                'step 1'
                if (result.bool) {
                  event.target = result.targets[0];
                  trigger.cancel();
                  player.logSkill('jlsg_yijian', result.targets[0]);
                  result.targets[0].draw();
                } else {
                  event.finish();
                }
                'step 2'
                if (event.target && event.target.num('h') >= player.countCards('h')) {
                  player.recover();
                }
              }
            },
            jlsg_feijun: {
              audio: "ext:极略:2",
              popup: false,
              trigger: { player: 'phaseUseBegin' },
              forced: true,
              content: function () {
                if (player.countCards('h') >= player.hp) {
                  player.logSkill('jlsg_feijun1');
                  player.storage.jlsg_feijun = player.hp;
                  player.addTempSkill('jlsg_feijun_more');
                } else {
                  player.logSkill('jlsg_feijun2');
                  player.addTempSkill('jlsg_feijun_less');
                }
              },
              subSkill: {
                more: {
                  mod: {
                    attackFrom: function (from, to, distance) {
                      return distance - from.storage.jlsg_feijun;
                    },
                    cardUsable: function (card, player, num) {
                      if (card.name == 'sha') return num + 1;
                    }
                  }
                },
                less: {
                  mod: {
                    cardEnabled: function (card) {
                      if (card.name == 'sha') return false
                    }
                  }
                }
              }
            },
            jlsg_feijun1: {
              inherit: 'jlsg_feijun',
              sub: true,
              audio: 'ext:极略:true',
            },
            jlsg_feijun2: {
              inherit: 'jlsg_feijun',
              sub: true,
              audio: 'ext:极略:true',
            },
            jlsg_muniu: {
              audio: "ext:极略:2",
              trigger: {
                global: ['equipAfter', 'addJudgeAfter', 'loseAfter', 'gainAfter', 'loseAsyncAfter'],
              },
              filter: function (event, player) {
                if (_status.currentPhase != player) return false;
                return game.hasPlayer(p => {
                  var evt = event.getl(p);
                  return evt && evt.es && evt.es.length;
                });
              },
              direct: true,
              content: function () {
                'step 0'
                event.num = game.filterPlayer(p => {
                  var evt = trigger.getl(p);
                  return evt && evt.es && evt.es.length;
                }).length;
                'step 1'
                if (!event.num) {
                  event.finish();
                  return;
                }
                --event.num;
                player.chooseTarget(get.prompt2('jlsg_muniu')).ai = function (target) {
                  var att = get.attitude(player, target);
                  if (target.countCards('h')) {
                    att = Math.max(att, -0.8 * get.attitude(player, target));
                  }
                  return att;
                }
                'step 2'
                if (!result.bool) {
                  event.finish();
                  return;
                }
                event.target = result.targets[0];
                player.logSkill('jlsg_muniu', event.target);
                if (!event.target.countDiscardableCards(player, 'h')) {
                  event.target.draw();
                  event.finish();
                } else {
                  player.discardPlayerCard(event.target, 'h').ai = function (button) {
                    if (get.attitude(player, event.target) > 0) return false;
                    return get.value(button.link);
                  }
                }
                'step 3'
                if (!result.bool) {
                  event.target.draw();
                }
                event.goto(1);
              },
              group: ['jlsg_muniu2']
            },
            jlsg_muniu2: {
              trigger: { global: 'equipEnd' },
              filter: function (event, player) {
                if (_status.currentPhase != player) return false;
                return true;
              },
              direct: true,
              content: function () {
                'step 0'
                player.chooseTarget(get.prompt2('jlsg_muniu')).ai = function (target) {
                  var att = get.attitude(player, target);
                  if (target.countCards('h')) {
                    att = Math.max(att, -0.8 * get.attitude(player, target));
                  }
                  return att;
                }
                'step 1'
                if (!result.bool) {
                  event.finish();
                  return;
                }
                event.target = result.targets[0];
                player.logSkill('jlsg_muniu', event.target);
                if (!event.target.countDiscardableCards(player, 'h')) {
                  event.target.draw();
                  event.finish();
                } else {
                  player.discardPlayerCard(event.target, 'h').ai = function (button) {
                    if (get.attitude(player, event.target) > 0) return false;
                    return get.value(button.link);
                  }
                }
                'step 2'
                if (!result.bool) {
                  event.target.draw();
                }
              },
            },
            jlsg_liuma: {
              audio: "ext:极略:1",
              usable: 1,
              enable: 'phaseUse',
              filterCard: function (card) {
                return get.type(card) == 'basic';
              },
              filterTarget: function (card, player, target) {
                return target != player && target.countCards('e');
              },
              selectTarget: [1, 2],
              content: function () {
                'step 0'
                if (targets.length) {
                  event.target = targets.shift();
                } else {
                  event.finish();
                }
                'step 1'
                event.target.chooseCardTarget({
                  prompt: '选择一名角色将你的一张装备牌交给该角色,或令' + get.translation(player) + '获得你一张手牌',
                  filterCard: true,
                  position: 'e',
                  filterTarget: function (card, player, target) {
                    return player != target;
                  },
                  ai1: function (card) {
                    return 1;
                  },
                  ai2: function (target) {
                    return get.attitude(event.target, target) > 0;
                  },
                });
                'step 2'
                if (result.bool) {
                  event.target.line(result.targets, 'green');
                  result.targets[0].gain(result.cards);
                  event.target.$give(result.cards.length, result.targets[0]);
                  event.goto(0);
                } else {
                  player.gainPlayerCard('h', event.target);
                }
              },
              ai: {
                order: 6,
                result: {
                  player: 1,
                  target: -1,
                }
              }
            },
            jlsg_baozheng: {
              audio: "ext:极略:2",
              trigger: { player: 'phaseJieshuBegin' },
              forced: true,
              priority: 10,
              filterTarget: function (card, player, target) {
                return target.countCards('he') > 0;
              },
              content: function () {
                'step 0'
                event.targets = game.filterPlayer(p => p != player && p.countCards('he'));
                event.targets.sortBySeat();
                'step 1'
                if (!event.targets.length) {
                  event.finish();
                  return;
                }
                event.target = event.targets.shift();
                if (event.target.countCards('he') == 1) {
                  event.target.give(event.target.getCards('he'), player);
                  event.redo();
                  return;
                }
                var canDiscard = event.target.countDiscardableCards(event.target, 'he') >= 2;
                if (!canDiscard) {
                  event.target.chooseCard('he', true, '暴征：将一张牌交给' + get.translation(player));
                } else {
                  event.target.chooseCard('he', [1, 2], true, `暴征：将一张牌交给${get.translation(player)}<br>或者选择两张弃置，然后对其造成一点伤害`,
                    function (card, player) {
                      return ui.selected.cards.length
                        ? [card, ...ui.selected.cards].every(c => lib.filter.cardDiscardable(c, player))
                        : true
                    },
                    function (card, cards) {
                      var evt = _status.event.getParent();
                      if (!ui.selected.cards.length) return -get.value(card);
                      if (get.attitude(evt.target, evt.player) < 0) return 7 - get.value(card) + get.value(ui.selected.cards[0]);
                      else return -1;
                    })
                    .set('complexCard', true);
                }
                'step 2'
                if (result.bool) {
                  if (result.cards.length == 1) {
                    event.target.give(result.cards, player);
                  } else {
                    event.target.discard(result.cards);
                    if (target.ai.shown < player.ai.shown) {
                      target.addExpose(0.1);
                    }
                    player.damage(event.target);
                  }
                }
                event.goto(1);
              },
              contentBackup: function () {
                "step 0"
                var targets = game.players.slice(0);
                targets.remove(player);
                targets.sort(lib.sort.seat);
                event.targets = targets;
                event.num = 0;
                "step 1"
                if (event.num < event.targets.length) {
                  event.target = event.targets[event.num];
                  if (event.target.countDiscardableCards(event.target, 'he') >= 2) {
                    event.target.chooseCard('交给' + get.translation(player) + '一张牌，或弃置两张牌对其造成1点伤害', 'he').ai = function (card) {
                      if (get.attitude(event.target, player) > 0) return 10 - get.value(card);
                      return 0;
                    }
                  } else if (event.target.countCards('h') == 1) {
                    event.target.chooseCard('交给' + get.translation(player) + '一张牌', 'he', true);
                  } else {
                    event.num++;
                    event.redo();
                  }

                } else {
                  event.finish();
                }
                "step 2"
                if (result.bool) {
                  player.gain(result.cards[0]);
                  event.target.$give(1, player);
                  event.num++;
                  event.goto(1);
                } else if (event.target.countDiscardableCards(event.target, 'he') >= 2) {
                  event.target.chooseToDiscard('弃置两张牌对' + get.translation(player) + '造成1点伤害', 2, 'he', true);
                  event.target.line(player, 'fire');
                  player.damage(event.target);
                  event.num++;
                  event.goto(1);
                }
              }
            },
            jlsg_lingnu: {
              audio: "ext:极略:2",
              trigger: { player: 'phaseEnd' },
              forced: true,
              priority: 9,
              filter: function (event, player) {
                return player.storage.jlsg_lingnu >= 2;
              },
              content: function () {
                "step 0"
                player.loseMaxHp();
                var targets = game.players.slice(0);
                targets.remove(player);
                targets.sort(lib.sort.seat);
                event.targets = targets;
                event.num = 0;
                "step 1"
                if (num < event.targets.length) {
                  if (event.targets[num].num('hej')) {
                    player.gainPlayerCard(event.targets[num], 'hej', true);
                  }
                  event.num++;
                  event.redo();
                }
              },
              group: ['jlsg_lingnu_getStat', 'jlsg_lingnu_init'],
              subSkill: {
                getStat: {
                  trigger: { player: 'damageEnd' },
                  forced: true,
                  popup: false,
                  silent: true,
                  content: function () {
                    player.storage.jlsg_lingnu += trigger.num;
                  }
                },
                init: {
                  trigger: { player: 'phaseBegin' },
                  forced: true,
                  popup: false,
                  silent: true,
                  content: function () {
                    player.storage.jlsg_lingnu = 0;
                  }
                }
              }
            },
            jlsg_zhongyong: {
              audio: "ext:极略:2",
              trigger: { player: 'phaseZhunbeiBegin' },
              check: function (event, player) {
                return (!player.hasJudge('lebu') || !player.hasJudge('bingliang')) && (player.hp >= 2 || player.hasCard('tao', 'h')) &&
                  game.hasPlayer(function (cur) {
                    return get.attitude(player, cur) != 0;
                  });
              },
              content: function () {
                player.loseHp();
                player.addTempSkill('jlsg_zhongyong_phaseDrawBegin', 'phaseAfter');
                player.addTempSkill('jlsg_zhongyong_distance', 'phaseAfter');
                player.addTempSkill('jlsg_zhongyong_giveCard', 'phaseAfter');
              },
              init: function (player) {
                player.storage.jlsg_zhongyong_discard = [];
              },
              subSkill: {
                phaseDrawBegin: {
                  trigger: { player: 'phaseDrawBegin2' },
                  forced: true,
                  popup: false,
                  filter: function (event, player) {
                    return !event.numFixed;
                  },
                  content: function () {
                    trigger.num += player.getDamagedHp();
                  }
                },
                distance: {
                  mod: {
                    globalFrom: function (from, to, distance) {
                      return -Infinity;
                    }
                  }
                },
                giveCard: {
                  trigger: { player: 'phaseDiscardAfter' },
                  filter: function (event, player) {
                    return player.getHistory('lose', function (evt) {
                      return evt.type == 'discard' && evt.getParent('phaseDiscard') == event && evt.cards.filterInD('d').length > 0;
                    }).length != 0;
                  },
                  direct: true,
                  content: function () {
                    'step 0'
                    event.cards = [];
                    event.events = player.getHistory('lose', function (evt) {
                      return evt.type == 'discard' && evt.getParent('phaseDiscard') == trigger && evt.cards.filterInD('d').length > 0;
                    });
                    event.events.forEach(evt => event.cards.addArray(evt.cards.filterInD('d')));
                    player.chooseTarget('是否发动【忠勇】让一名角色获得你本阶段内的弃牌？', function (card, player, target) {
                      return player != target;
                    }).ai = function (target) {
                      return get.attitude(player, target) > 0;
                    }
                    'step 1'
                    if (result.bool) {
                      player.logSkill('jlsg_zhongyong', result.targets[0]);
                      result.targets[0].gain(event.cards);
                      result.targets[0].$gain(event.cards);
                    }
                  }
                }
              }
            },
            jlsg_bozhan: {
              audio: "ext:极略:true",
              trigger: { player: 'shaMiss', target: 'shaMiss' },
              forced: true,
              content: function () {
                trigger.target.chooseToUse('是否对' + get.translation(trigger.player) + '使用一张【杀】？', { name: 'sha' }, -1, trigger.player);
              }
            },
            jlsg_qingxi: {
              shaRelated: true,
              audio: "ext:极略:true",
              trigger: { player: 'shaBegin' },
              forced: true,
              filter: function (event, player) {
                return player.countCards('e') < event.target.countCards('e');
              },
              content: function () {
                trigger.directHit = true;
              }
            },
            jlsg_danshou: {
              audio: "ext:极略:1",
              trigger: {
                target: "useCardToTargeted",
              },
              filter: function (event, player) {
                return event.card.name == 'sha' && player.canCompare(event.player);
              },
              forced: true,
              content: function () {
                'step 0'
                player.chooseToCompare(trigger.player);
                'step 1'
                if (result.bool) {
                  player.draw(2);
                  player.discardPlayerCard(trigger.player, true);
                } else {
                  // trigger.directHit = true;
                  trigger.getParent().directHit.add(player);
                  // player.draw();
                }
              },
            },
            jlsg_yonglie: {
              audio: "ext:极略:1",
              trigger: { global: 'damageEnd' },
              filter: function (event, player) {
                return event.card && event.card.name == 'sha' && event.notLink() && event.player.inRangeOf(player) && event.source && event.source.isAlive();
              },
              check: function (event, player) {
                if (player.hp > 2) return get.attitude(player, event.source) < 0;
                return 0;
              },
              prompt: function (event, player) {
                var str = '';
                str += '是否对' + get.translation(event.source) + '发动【勇烈】'
                return str;
              },
              content: function () {
                player.loseHp();
                player.line(trigger.source);
                trigger.source.damage();
              },
            },
            jlsg_hengshi: {
              audio: "ext:极略:2",
              trigger: { player: 'phaseDiscardBegin' },
              frequent: true,
              filter: function (event, player) {
                return player.countCards('h');
              },
              check: () => true,
              content: function () {
                player.draw(player.countCards('h'));
              },
              ai: {
                effect: {
                  player: function (card, player, target) {
                    var hs = player.countCards('h');
                    if (player.hasSkill('jlsg_zhijiao')) {
                      if (game.hasPlayer(function (cur) {
                        return get.attitude(player, cur) > 3 && !cur.hasJudge('lebu') && cur != player;
                      })) {
                        if (hs >= 5 && !['wuzhong', 'shunshou', 'wugu'].contains(card.name)) return 'zeroplayertarget';
                      }
                    } else {
                      if (get.tag(card, 'recover') && player.getHandcardLimit() <= (hs * 2)) return [0, 0, 0, 0];
                      if (player.getHandcardLimit() / 2 == hs) return [1, -0.6];
                    }
                  },
                }
              }
            },
            jlsg_zhijiao: {
              audio: "ext:极略:2",
              trigger: { player: 'phaseJieshuBegin' },
              unique: true,
              limited: true,
              direct: true,
              init: function (player) {
                player.storage.jlsg_zhijiao = false;
                player.storage.jlsg_zhijiao2 = [];
              },
              filter: function (event, player) {
                return !player.storage.jlsg_zhijiao && player.storage.jlsg_zhijiao2.length;
              },
              mark: true,
              intro: {
                content: 'limited'
              },
              content: function () {
                'step 0'
                player.chooseTarget('是否发动【至交】？', function (card, player, target) {
                  return player != target;
                }).ai = function (target) {
                  var cardnum = player.storage.jlsg_zhijiao2.length;
                  var att = get.attitude(player, target);
                  if (att <= 0) return 0;
                  var result = Math.max(9 - target.countCards('he'), 1);
                  if (target.hasJudge('lebu')) result -= 2;
                  result = Math.max(1, result);
                  result += att;
                  if (cardnum >= 5) return result;
                  if (player.hp == 2 && cardnum >= 4) return result;
                  if (player.hp == 1) return result;
                  return 0;
                }
                'step 1'
                if (result.bool) {
                  player.storage.jlsg_zhijiao = true;
                  player.logSkill('jlsg_zhijiao', result.targets[0]);
                  result.targets[0].gain(player.storage.jlsg_zhijiao2);
                  result.targets[0].$gain(player.storage.jlsg_zhijiao2);
                  player.awakenSkill('jlsg_zhijiao');
                }
                player.storage.jlsg_zhijiao2 = [];
              },
              group: ['jlsg_zhijiao2'],
              ai: {
                order: function (skill, player) {
                  if (player.hp < player.maxHp && player.countCards('h') > 1) {
                    return 10;
                  }
                  return 4;
                },
                result: {
                  target: function (player, target) {
                    if (target.hasSkillTag('nogain')) return 0;
                    if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') {
                      if (target.hasSkillTag('nodu')) return 0;
                      return -10;
                    }
                    if (target.hasJudge('lebu')) return 0;
                    var nh = target.countCards('h');
                    var np = player.countCards('h');
                    if (player.hp == player.maxHp || player.storage.rerende < 0 || player.countCards('h') <= 1) {
                      if (nh >= np - 1 && np <= player.hp && !target.hasSkill('haoshi')) return 0;
                    }
                    return Math.max(1, 5 - nh);
                  },
                },
                effect: {
                  target: function (card, player, target) {
                    if (player == target && get.type(card) == 'equip') {
                      if (target.countCards('e', { subtype: get.subtype(card) }) > 0) {
                        if (game.hasPlayer(function (current) {
                          return current != target && get.attitude(target, current) > 3;
                        })) {
                          return 0;
                        }
                      }
                    }
                  },
                },
                threaten: 0.8,
              },
            },
            jlsg_zhijiao2: {
              trigger: { player: 'discardAfter' },
              forced: true,
              popup: false,
              priority: -1,
              filter: function (event, player) {
                if (player.storage.jlsg_zhijiao) return false;
                if (_status.currentPhase != player) return false;
                for (var i = 0; i < event.cards.length; i++) {
                  if (get.position(event.cards[i]) == 'd') {
                    return true;
                  }
                }
                return false;
              },
              content: function () {
                for (var i = 0; i < trigger.cards.length; i++) {
                  if (get.position(trigger.cards[i]) == 'd') {
                    player.storage.jlsg_zhijiao2 = player.storage.jlsg_zhijiao2.concat(trigger.cards[i]);
                  }
                }
                player.syncStorage('jlsg_zhijiao2');
                player.markSkill('jlsg_zhijiao2');
              },
              intro: {
                content: 'cards'
              }
            },
            jlsg_jiwux: {
              audio: "ext:极略:3",
              trigger: { player: 'phaseUseBegin' },
              filter: function (event, player) {
                return player.countCards('h', 'sha') > 0;
              },
              direct: true,
              content: function () {
                'step 0'
                player.chooseCard(get.prompt('jlsg_jiwux'), function (card, player, target) {
                  return card.name == 'sha' && !(card.isJiwu && card.isJiwu[1] && card.isJiwu[2] && card.isJiwu[3]);
                }).ai = function (card) {
                  var value = 0;
                  if (card.nature) {
                    if (card.nature == 'fire') value += 0.004;
                    if (card.nature == 'thunder') value += 0.003;
                  }
                  switch (get.suit(card)) {
                    case 'heart':
                      value += 0.004;
                      break;
                    case 'diamond':
                      value += 0.003;
                      break;
                    case 'spade':
                      value += 0.002;
                      break;
                    case 'club':
                      value += 0.001;
                      break;
                    default:
                      break;
                  }
                  value = value + card.number / 1000;
                  return value;
                }
                'step 1'
                if (result.bool) {
                  player.logSkill('jlsg_jiwux');
                  event.card = result.cards[0];
                  player.showCards(event.card);
                  let paint = function (card, paintType, toggle = true) {
                    if (!document.body.contains(card.parentElement)) {
                      return;
                    }
                    var target = card.querySelector(`#Jiwu${paintType}`);
                    if (target) {
                      if (!toggle) {
                        card.removeChild(target);
                      }
                      return;
                    }
                    let div = document.createElement("div");
                    card.appendChild(div);
                    div.style.minWidth = "33%";
                    div.style.top = "4px";
                    div.style.height = "4px";
                    // div.style.opacity = "0.5";
                    switch (paintType) {
                      case 1:
                        div.setAttribute("id", "Jiwu1");
                        div.style.left = "0%";
                        div.style.backgroundColor = "rgba(255,0,0,0.6)";
                        break;
                      case 2:
                        div.setAttribute("id", "Jiwu2");
                        div.style.left = "33%";
                        div.style.backgroundColor = "rgba(0,255,0,0.6)";
                        break;
                      case 3:
                        div.setAttribute("id", "Jiwu3");
                        div.style.left = "67%";
                        div.style.backgroundColor = "rgba(0,0,255,0.6)";
                        break;
                      default:
                        break;
                    }
                  };
                  if (!event.card.isJiwu) event.card.isJiwu = {
                    // _paint(paintType, toggle) {
                    //   paint(event.card, paintType, toggle);
                    // },
                    _card: event.card,
                    get 1() { return this._1; },
                    get 2() { return this._2; },
                    get 3() { return this._3; },
                    set 1(value) {
                      if (value == this._1) return;
                      this._1 = !!value;
                      game.broadcastAll(paint, this._card, 1, !!value);
                    },
                    set 2(value) {
                      if (value == this._2) return;
                      this._2 = !!value;
                      game.broadcastAll(paint, this._card, 2, !!value);
                    },
                    set 3(value) {
                      if (value == this._3) return;
                      this._3 = !!value;
                      game.broadcastAll(paint, this._card, 3, !!value);
                    },
                    _1: false,
                    _2: false,
                    _3: false,
                  };
                  event._options = ['此【杀】不计入次数限制',
                    '此【杀】无距离限制,且可以额外指定1个目标',
                    '此【杀】的伤害值+1'
                  ];
                  const options = [1, 2, 3].filter(key => !event.card.isJiwu[key])
                    .map(key => event._options[key - 1]);
                  player.chooseControl(options, 'dialogcontrol', function () {
                    return Math.floor(Math.random() * options.length);
                  })//.set('prompt', prompt);
                } else {
                  event.finish();
                }
                'step 2'

                if (result.control == event._options[0]) {
                  event.card.isJiwu[1] = true;
                  game.log(player, '所展示的', event.card, '不计入次数限制');
                  // game.broadcastAll(paint, event.card, 0, true);
                } else if (result.control == event._options[1]) {
                  event.card.isJiwu[2] = true;
                  game.log(player, '所展示的', event.card, '无距离限制，且可以额外指定1个目标');
                  // game.broadcastAll(paint, event.card, 1, true);
                } else if (result.control == event._options[2]) {
                  event.card.isJiwu[3] = true;
                  game.log(player, '所展示的', event.card, '伤害值+1');
                  // game.broadcastAll(paint, event.card, 2, true);
                }
              },
              group: ['jlsg_jiwux_one', 'jlsg_jiwux_two', 'jlsg_jiwux_three', 'jlsg_jiwux_clear'],
              subSkill: {
                one: {
                  mod: {
                    cardUsable: function (card, player) {
                      var criterion = card.name == "sha" && (card.isJiwu && card.isJiwu[1] ||
                        card.cards && card.cards.length == 2 && card.cards[0].isJiwu && card.cards[0].isJiwu[1]);
                      if (criterion) {
                        return Infinity;
                      }
                    }
                  },
                  trigger: { player: 'useCard' },
                  filter: function (event, player) {
                    // return event.card && event.card.isJiwu && event.card.isJiwu[1];
                    if (!event.card) return false;
                    return event.card.name == "sha" && (event.card.isJiwu && event.card.isJiwu[1] ||
                      event.card.cards && event.card.cards.length == 1 && event.card.cards[0].isJiwu && event.card.cards[0].isJiwu[1]);
                  },
                  forced: true,
                  content: function () {
                    if (player.stat[player.stat.length - 1].card.sha > 0) {
                      player.stat[player.stat.length - 1].card.sha--;
                    }
                  }
                },
                two: {
                  mod: {
                    targetInRange: function (card, player) {
                      var criterion = card.name == "sha" && (card.isJiwu && card.isJiwu[2] ||
                        card.cards && card.cards.length == 1 && card.cards[0].isJiwu && card.cards[0].isJiwu[2]);
                      if (criterion) return true;
                    },
                    selectTarget: function (card, player, range) {
                      var criterion = card.name == "sha" && (card.isJiwu && card.isJiwu[2] ||
                        card.cards && card.cards.length == 1 && card.cards[0].isJiwu && card.cards[0].isJiwu[2]);
                      if (criterion && range[1] != -1) range[1]++;
                    }
                  }
                },
                three: {
                  trigger: { source: 'damageBegin' },
                  forced: true,
                  filter: function (event, player) {
                    if (!event.card) return false;
                    var criterion = event.card.name == "sha" && (event.card.isJiwu && event.card.isJiwu[3] ||
                      event.card.cards && event.card.cards.length == 1 && event.card.cards[0].isJiwu && event.card.cards[0].isJiwu[3]);
                    return criterion && event.notLink();
                  },
                  content: function () {
                    trigger.num++;
                  }
                },
                clear: {
                  // FIXME: missing clear logic
                  trigger: { player: ['useCardAfter', 'discardAfter'] },
                  silent: true,
                  filter: function (event, player) {
                    var cards = event.cards;
                    if (!cards) cards = event.card && event.card.cards;
                    return cards;// && cards.length == 1 && cards[0].isJiwu;
                  },
                  forced: true,
                  popup: false,
                  content: function () {
                    if (trigger.card) {
                      if (trigger.card.isJiwu) {
                        trigger.card.isJiwu._card = trigger.card;
                        trigger.card.isJiwu[1] = false;
                        trigger.card.isJiwu[2] = false;
                        trigger.card.isJiwu[3] = false;
                        delete trigger.card.isJiwu;
                      }
                      if (trigger.card.cards) {
                        for (var card of trigger.card.cards) {
                          if (card.isJiwu) {
                            card.isJiwu._card = card;
                            card.isJiwu[1] = false;
                            card.isJiwu[2] = false;
                            card.isJiwu[3] = false;
                            delete card.isJiwu;
                          }
                        }
                      }
                    } else if (trigger.cards) {
                      for (var card of trigger.cards) {
                        if (card.isJiwu) {
                          card.isJiwu._card = card;
                          card.isJiwu[1] = false;
                          card.isJiwu[2] = false;
                          card.isJiwu[3] = false;
                          delete card.isJiwu;
                        }
                      }
                    }
                  }
                }
              },
              // ai:{
              // effect:{
              // player:function(card,player,target){

              // }
              // }
              // }
            },
            jlsg_daoshi: {
              audio: "ext:极略:2",
              trigger: { global: 'phaseJieshuBegin' },
              filter: function (event, player) {
                return event.player.countCards('e') > 0 && (player == event.player || player.hasSkill("jlsg_daoshi"));
              },
              direct: true,
              content: function () {
                'step 0'
                var prompt = (trigger.player == player) ? "是否发动【刀侍】摸一张牌?" :
                  `###是否对${get.translation(event.target)}发动【刀侍】？###摸一张牌并将装备区的一张牌交给${get.translation(player)}`;
                trigger.player.chooseBool(prompt).ai = function () {
                  if (trigger.player == player) return true;
                  if (get.attitude(trigger.player, player) > 0 && player.countCards('e') < 2)
                    return 1;
                  return 0;
                }
                'step 1'
                if (result.bool) {
                  trigger.player.logSkill('jlsg_daoshi', player);
                  trigger.player.draw();
                  if (trigger.player != player) {
                    trigger.player.chooseCardButton('选择一张牌交给' + get.translation(player), trigger.player.get('e'), true);
                  } else {
                    event.finish();
                  }
                } else {
                  event.finish();
                }
                'step 2'
                if (result.bool) {
                  player.gain(result.links[0]);
                  trigger.player.$give(result.links[0], player);
                }
              }
            },
            jlsg_lirang: {
              audio: "ext:极略:2",
              trigger: { global: 'phaseZhunbeiEnd' },
              filter: function (event, player) {
                if (event.player != player && !player.hasSkill('jlsg_lirang')) return false;
                if (game.online) {
                  return player.storage.jlsg_lirang.length < 4 && event.player.countCards('h');
                }
                var liSuits = player.storage.jlsg_lirang.map(c => get.suit(c));
                return event.player.countCards('h', c => !liSuits.contains(get.suit(c)));
              },
              direct: true,
              content: function () {
                'step 0'
                var liSuits = player.storage.jlsg_lirang.map(c => get.suit(c));
                var next = trigger.player.chooseCard(get.prompt('jlsg_lirang', player, trigger.player));
                next.filterCard = function (card) {
                  return !liSuits.contains(get.suit(card));
                }
                next.ai = function (card) {
                  if (get.attitude(trigger.player, player) > 0) {
                    if (jlsg.needKongcheng(trigger.player)) return 20 - get.value(card);
                    return 7 - get.value(card);
                  }
                  if (get.attitude(trigger.player, player) <= 0) {
                    return card.name == 'du';
                  }
                  return false;
                }
                'step 1'
                if (result.bool) {
                  player.logSkill('jlsg_lirang', trigger.player);
                  trigger.player.$give(result.cards.length, player, false);
                  trigger.player.lose(result.cards, ui.special, 'toStorage');
                  player.storage.jlsg_lirang = player.storage.jlsg_lirang.concat(result.cards);
                  player.markSkill('jlsg_lirang');
                  player.syncStorage('jlsg_lirang');
                  // player.updateMarks('jlsg_lirang');
                  trigger.player.draw();
                }
              },
              init: function (player) {
                player.storage.jlsg_lirang = [];
              },
              intro: {
                content: 'cards'
              },
              group: ['jlsg_lirang2'],
              ai: {
                threaten: 3,
              }
            },
            jlsg_lirang2: {
              enable: 'chooseToUse',
              filter: function (event, player) {
                return player.storage.jlsg_lirang.length >= 2 && event.filterCard({ name: 'tao' }, player, event);
              },
              chooseButton: {
                dialog: function (event, player) {
                  return ui.create.dialog('礼让', player.storage.jlsg_lirang, 'hidden');
                },
                select: 2,
                backup: function (links, player) {
                  return {
                    audio: "jlsg_lirang",
                    filterCard: function () { return false },
                    selectCard: -1,
                    viewAs: { name: 'tao', cards: links },
                    cards: links,
                    onuse: function (result, player) {
                      result.cards = lib.skill[result.skill].cards;
                      player.storage.jlsg_lirang.remove(result.cards);
                      player.syncStorage('jlsg_lirang');
                      player.markAuto('jlsg_lirang2')
                      // player.logSkill('jlsg_lirang2',result.targets);
                    }
                  }
                },
              },
              ai: {
                // order:10,
                order: function () {
                  var od = get.order({ name: 'tao' }) + 0.2;
                  // if (event.filterCard({name:'jiu'},_status.event.player,_status.event)) {
                  //   od =Math.max(od, get.order({name:'jiu'})+0.2);
                  // }
                  return od;
                },
                save: true,
                result: {
                  player: function (player) {
                    if (_status.event.dying) return get.attitude(player, _status.event.dying);
                    return 0;
                  },
                }
              }
            },
            jlsg_lirangBackup: {
              enable: 'chooseToUse',
              direct: true,
              check: function (event, player) {
                if (event.player == player) return 10;
                if (get.attitude(player, event.player) > 0) return 5;
                return 0;
              },
              filter: function (event, player) {
                if (player.storage.jlsg_lirang.length < 2) return false;
                if (event.type == 'dying') {
                  return event.filterCard({ name: 'tao' }, player);
                }
                if (event.parent.name != 'phaseUse') return false;
                if (!lib.filter.filterCard({ name: 'tao' }, player, event)) {
                  return false;
                }
                return player.hp < player.maxHp;
              },
              filterTarget: function (card, player, target) {
                if (_status.event.type == 'dying') {
                  return target == _status.event.dying;
                }
                return player == target;
              },
              selectTarget: -1,
              chooseButton: {
                dialog: function (event, player) {
                  return ui.create.dialog('礼让', player.storage.jlsg_lirang, 'hidden');
                },
                select: 2,
                check: function (event, player) {
                  return 1;
                },
                backup: function (links, player) {
                  return {
                    audio: "ext:极略:2",
                    filterCard: function () {
                      return false
                    },
                    selectCard: -1,
                    viewAs: { name: 'tao' },
                    cards: links,
                    onuse: function (result, player) {
                      result.cards = lib.skill.jlsg_lirang2_backup.cards;
                      var cards = result.cards;
                      player.storage.jlsg_lirang.remove(cards);
                      player.syncStorage('jlsg_lirang');
                      if (!player.storage.jlsg_lirang.length) {
                        player.unmarkSkill('jlsg_lirang');
                      } else {
                        player.markSkill('jlsg_lirang');
                      }
                    }
                  }
                }
              },
              ai: {
                save: true,
                order: 9,
                result: {
                  target: function (player, target) {
                    return get.effect(target, { name: 'tao' }, player, target);
                  }
                },
              }
            },
            jlsg_xianshi: {
              audio: "ext:极略:2",
              trigger: { player: 'damageBegin3' },
              filter: function (event, player) {
                return (event.source != undefined);
              },
              frequent: true,
              content: function () {
                'step 0'
                trigger.source.chooseToDiscard('弃置一张牌并展示所有手牌，或令此伤害-1').ai = function (card) {
                  if (get.attitude(trigger.source, player) < 0) {
                    if (trigger.source.needsToDiscard()) return 7 - get.value(card);
                    return 6 - get.value(card);
                  }
                  return false;
                }
                'step 1'
                if (result.bool) {
                  trigger.source.showHandcards();
                } else {
                  trigger.num--;
                }
              },
              ai: {
                effect: {
                  target: function (card, player, target, current) {
                    if (get.tag(card, 'damage')) {
                      var bs = player.get('h');
                      if (bs.length == 0) return 0;
                      if ((player.hasSkill('jiu') || player.hasSkill('tianxianjiu')) && card.name == 'sha') return;
                      if (player.countCards('h') <= 1) return 0;
                      var n = 0.5;
                      if (player.hasCard(function (cardx) {
                        return get.value(cardx) < 6;
                      }, 'h') || player.needsToDiscard()) n = 0;
                      return [1, n];
                    }
                  }
                }
              }
            },
            jlsg_chengxiang: {
              audio: "ext:极略:2",
              inherit: 'chengxiang',
              content: function () {
                "step 0"
                event.cards = get.cards(4);
                game.cardsGotoOrdering(event.cards);
                event.videoId = lib.status.videoId++;
                game.broadcastAll(function (player, id, cards, num) {
                  var str;
                  if (player == game.me && !_status.auto) {
                    str = '称象：选择任意张点数不大于13的牌';
                  }
                  else {
                    str = '称象';
                  }
                  var dialog = ui.create.dialog(str, cards);
                  dialog.videoId = id;
                }, player, event.videoId, event.cards, 13);
                event.time = get.utc();
                game.addVideo('showCards', player, ['称象', get.cardsInfo(event.cards)]);
                game.addVideo('delay', null, 2);
                "step 1"
                var next = player.chooseButton([0, 4]);
                next.set('dialog', event.videoId);
                next.set('filterButton', function (button) {
                  var num = 0
                  for (var i = 0; i < ui.selected.buttons.length; i++) {
                    num += get.number(ui.selected.buttons[i].link);
                  }
                  return (num + get.number(button.link) <= _status.event.maxNum);
                });
                next.set('maxNum', 13);
                next.set('ai', function (button) {
                  return get.value(button.link, _status.event.player);
                });
                "step 2"
                if (result.bool && result.links) {
                  //player.logSkill('chengxiang');
                  var cards2 = [];
                  for (var i = 0; i < result.links.length; i++) {
                    cards2.push(result.links[i]);
                    cards.remove(result.links[i]);
                  }
                  event.cards2 = cards2;
                }
                else {
                  event.finish();
                }
                var time = 1000 - (get.utc() - event.time);
                if (time > 0) {
                  game.delay(0, time);
                }
                "step 3"
                game.broadcastAll('closeDialog', event.videoId);
                var cards2 = event.cards2;
                player.gain(cards2, 'log', 'gain2');
              },
            },
            jlsg_renxin: {
              audio: "ext:极略:2",
              inherit: 'oldrenxin',
              // ai: {
              //   expose: 0.5
              // }
            },
            jlsg_midao: {
              audio: "ext:极略:2",
              enable: 'phaseUse',
              usable: 1,
              filterTarget: function (card, player, target) {
                return target.countCards('h') > player.countCards('h') && player != target;
              },
              filter: function (event, player) {
                for (var i = 0; i < game.players.length; i++)
                  if (game.players[i].num('h') > player.countCards('h')) return true;
                return false;
              },
              selectTarget: -1,
              multitarget: true,
              multiline: true,
              content: function () {
                'step 0'
                if (targets.length) {
                  event.target = targets.shift();
                } else {
                  var maxh = true;
                  for (var i = 0; i < game.players.length; i++) {
                    if (game.players[i].num('h') > player.countCards('h')) {
                      maxh = false;
                    }
                  }
                  if (maxh) {
                    player.loseHp();
                  }
                  event.finish();
                }
                'step 1'
                if (event.target.countCards('h')) {
                  event.target.chooseCard('选择一张手牌交给' + get.translation(player), true).ai = function (card) {
                    return -get.value(card);
                  }
                } else {
                  event.goto(0);
                }
                'step 2'
                if (result.bool) {
                  player.gain(result.cards[0]);
                  target.$give(1, player);
                }
                event.goto(0);
              },
              ai: {
                order: 2,
                result: {
                  player: function (player) {
                    var cangain = 0;
                    for (var i = 0; i < game.players.length; i++) {
                      if (game.players[i].num('h') > player.countCards('h')) cangain++;
                    }
                    var maxh = true;
                    for (var i = 0; i < game.players.length; i++) {
                      if (game.players[i].num('h') - 1 > player.countCards('h') + cangain) {
                        maxh = false;
                      }
                    }
                    if (maxh && cangain > 1 && player.hp > 2) return 1;
                    if (maxh && player.hp == 2) return -2;
                    if (maxh && player.hp == 1 && !player.countCards('h', 'tao')) return -10;
                    if (maxh && cangain <= 1) return -1;
                    if (!maxh) return cangain;
                    return 0;
                  },
                  target: -1,
                }
              }
            },
            jlsg_yishe: {
              audio: "ext:极略:2",
              enable: 'phaseUse',
              usable: 1,
              filterTarget: function (card, player, target) {
                return target.countCards('h') <= player.countCards('h') && player != target;
              },
              filter: function (event, player) {
                return player.countCards('h') > 0;
              },
              content: function () {
                player.swapHandcards(target);
              },
              // content: function () {
              //   'step 0'
              //   event.cards0 = target.get('h');
              //   event.cards1 = player.get('h');
              //   target.lose(event.cards0, ui.special);
              //   player.lose(event.cards1, ui.special);
              //   'step 1'
              //   target.gain(event.cards1);
              //   player.gain(event.cards0);
              //   target.$give(event.cards0.length, player);
              //   player.$give(event.cards1.length, target);
              // },
              ai: {
                order: 1,
                result: {
                  player: function (player, target) {
                    return target.countCards('h') - player.countCards('h');
                  },
                  target: function (player, target) {
                    return player.countCards('h') - target.countCards('h');
                  },
                }
              }
            },
            jlsg_pudu: {
              audio: "ext:极略:1",
              unique: true,
              limited: true,
              enable: 'phaseUse',
              skillAnimation: true,
              animationStr: '普渡',
              animationColor: 'water',
              filterTarget: function (card, player, target) {
                return player != target;
              },
              filter: function (event, player) {
                return !player.storage.jlsg_pudu;
              },
              init: function (player) {
                player.storage.jlsg_pudu = false;
              },
              mark: true,
              intro: {
                content: 'limited'
              },
              multitarget: true,
              multiline: true,
              selectTarget: -1,
              content: function () {
                'step 0'
                player.storage.jlsg_pudu = true;
                event.current = player.next;
                event.targets = targets.slice();
                'step 1'
                var target = event.targets.shift();
                player.gain(target, target.getCards('h'), 'bySelf');
                target.$give(target.num('h'), player);
                // game.delayx(0.5);
                if (event.targets.length) {
                  event.redo();
                }
                'step 2'
                var maxh = true;
                for (var i = 0; i < game.players.length; i++) {
                  if (game.players[i].num('h') > player.countCards('h')) {
                    maxh = false;
                  }
                }
                if (maxh) {
                  player.chooseCard('选择一张手牌交给' + get.translation(event.current), true).ai = function (card) {
                    if (get.attitude(player, event.current) > 0)
                      return get.value(card);
                    return -get.value(card);
                  }
                } else {
                  player.unmarkSkill('jlsg_pudu');
                  event.finish();
                }
                'step 3'
                if (result.bool) {
                  // event.current.gain(result.cards[0]);
                  player.$give(1, event.current);
                  event.current.gain(player, result.cards[0], 'bySelf', false);
                  game.delayx(0.3);
                  if (event.current.next != player && event.current.next.isAlive()) {
                    event.current = event.current.next;
                  } else {
                    event.current = event.current.next.next;
                  }
                  event.goto(2);
                }

              },
              ai: {
                order: 4.5,
                result: {
                  player: function (player, target) {
                    var num = 0;
                    var list = [];
                    var listnum = 0;
                    for (var i = 0; i < game.players.length - 1; i++) {
                      list.push('0');
                    }
                    for (var i = 0; i < game.players.length; i++) {
                      num += game.players[i].num('h');
                    }
                    var max = function () {
                      for (var i = 0; i < list.length; i++) {
                        if (list[i] > num) return true;
                      }
                      return false;
                    }
                    while (!max()) {
                      num--;
                      list[listnum % (game.players.length - 1)]++;
                      listnum++;
                    }
                    return num - player.countCards('h');
                  },
                  target: function (player, target) {
                    var num = 0;
                    var list = [];
                    var listnum = 0;
                    for (var i = 0; i < game.players.length - 1; i++) {
                      list.push('0');
                    }
                    for (var i = 0; i < game.players.length; i++) {
                      num += game.players[i].num('h');
                    }
                    var max = function () {
                      for (var i = 0; i < list.length; i++) {
                        if (list[i] > num) return true;
                      }
                      return false;
                    }
                    while (!max()) {
                      num--;
                      list[listnum % (game.players.length - 1)]++;
                      listnum++;
                    }
                    for (var i = 0; i < game.players.length; i++) {
                      if (target == game.players[i]) var nu = i;
                    }
                    return list[nu - 1] - target.countCards('h');
                  }
                }
              }
            },
            jlsg_zongqing: {
              audio: "ext:极略:2",
              trigger: { player: 'phaseDrawBegin' },
              check: function (event, player) {
                if (player.isDamaged() && player.countCards('h', { color: 'red' })) return 2;
                if (player.countCards('h', 'sha') && !player.countCards('h', 'jiu')) return 1;
                return 0;
              },
              content: function () {
                'step 0'
                player.judge(function (card) {
                  if (get.color(card) == 'red' && player.isDamaged()) return 2;
                  if (get.color(card) == 'red') return 1;
                  if (get.color(card) == 'black' && player.countCards('h', 'sha')) return 1;
                  return 0;
                });
                'step 1'
                player.storage.jlsg_zongqing = result.card;
                player.addSkill('jlsg_zongqing_show');
              },
              subSkill: {
                show: {
                  audio: false,
                  trigger: { player: 'phaseDrawEnd' },
                  forced: true,
                  popup: false,
                  filter: function (event) {
                    // return event.parent.parent.name == 'phaseDraw';
                    return event.cards && event.cards.length;
                  },
                  content: function () {
                    'step 0'
                    event.card = player.storage.jlsg_zongqing;
                    // player.showCards(event.card);
                    player.showCards(trigger.cards);
                    'step 1'
                    var cards = [];
                    if (get.color(event.card) == 'red') {
                      for (var i = 0; i < trigger.cards.length; i++) {
                        if (get.color(trigger.cards[i]) == 'black') {
                          cards.push(trigger.cards[i]);
                        }
                      }
                      if (cards.length) {
                        if (cards.length == 2) {
                          event.cards = cards;
                          player.chooseToDiscard('纵情:选择一张牌弃置', function (card) {
                            return _status.event.getParent().cards.contains(card);
                          }, true).ai = get.disvalue;
                        } else {
                          player.discard(cards);
                        }
                        player.useCard({ name: 'jiu' }, player);
                      }
                    } else { // card color == black
                      for (var i = 0; i < trigger.cards.length; i++) {
                        if (get.color(trigger.cards[i]) == 'red') {
                          cards.push(trigger.cards[i]);
                        }
                      }
                      if (cards.length) {
                        if (cards.length == 2) {
                          event.cards = cards;
                          player.chooseToDiscard('纵情:选择一张牌弃置', function (card) {
                            return _status.event.getParent().cards.contains(card);
                          }, true).ai = get.disvalue;
                        } else {
                          player.discard(cards);
                        }
                        if (player.isDamaged()) {
                          player.useCard({ name: 'tao' }, player);
                        }
                      }
                    }
                    'step 2'
                    player.removeSkill('jlsg_zongqing_show');
                  }
                }
              }
            },
            jlsg_bugua: {
              audio: "ext:极略:1",
              trigger: { global: 'judgeBefore' },
              content: function () {
                'step 0'
                player.showCards(ui.cardPile.firstChild, '牌堆顶的牌');
                event.chosed = false;
                'step 1'
                player.chooseCard('是否将一张手牌置于牌堆顶？').set('ai', function (card) {
                  var trigger = _status.event.getTrigger();
                  var player = _status.event.player;
                  var judging = ui.cardPile.firstChild;
                  var result = trigger.judge(card) - trigger.judge(judging);
                  var attitude = get.attitude(player, trigger.player);
                  if (attitude == 0 || result == 0) return 0;
                  if (attitude > 0) {
                    return result - get.value(card) / 2;
                  } else {
                    return -result - get.value(card) / 2;
                  }
                });
                event.current = player;
                'step 2'
                if (result && result.cards) {
                  event.card = result.cards[0];
                  event.card = result.cards[0];
                  event.current.showCards(event.card, '置于牌堆顶');
                  event.current.lose(event.card, ui.cardPile, 'insert', 'visible');
                  event.current.$throw(1, 1000);
                  game.log(event.current, '将', event.card, '置于牌堆顶');
                } else {
                  if (trigger.player == player) {
                    event.finish();
                  } else if (event.chosed) {
                    event.finish();
                  } else {
                    trigger.player.chooseCard('将一张手牌置于牌堆顶？').set('ai', function (card) {
                      var trigger = _status.event.getTrigger();
                      var player = trigger.player;
                      var judging = ui.cardPile.firstChild;
                      var result = trigger.judge(card) - trigger.judge(judging);
                      var attitude = get.attitude(player, trigger.player);
                      if (attitude == 0 || result == 0) return 0;
                      if (attitude > 0) {
                        return result - get.value(card) / 2;
                      } else {
                        return -result - get.value(card) / 2;
                      }
                      return -get.value(card);
                    });
                    event.chosed = true;
                    event.current = trigger.player;
                    event.goto(2);
                  }
                }
              },
              ai: {
                tag: {
                  rejudge: 1,
                },
              },
              group: ['jlsg_bugua2', 'jlsg_bugua3'],
            },
            jlsg_bugua2: {
              audio: "ext:极略:true",
              trigger: { global: 'judgeAfter' },
              filter: function (event, player) {
                return (get.color(event.result.card) == 'red');
              },
              check: function (event, player) {
                return get.attitude(player, event.player) > 0;
              },
              prompt: function (event, player) {
                var str = '';
                str += '是否对' + get.translation(event.player) + '发动【卜卦】令其摸一张牌';
                return str;
              },
              content: function () {
                trigger.player.draw(true);
              }
            },
            jlsg_bugua3: {
              audio: "ext:极略:true",
              trigger: { global: 'judgeAfter' },
              filter: function (event, player) {
                return (get.color(event.result.card) == 'black') && event.player.countCards('he');
              },
              check: function (event, player) {
                return get.attitude(player, event.player) < 0;
              },
              prompt: function (event, player) {
                var str = '';
                str += '是否对' + get.translation(event.player) + '发动【卜卦】令其弃一张牌';
                return str;
              },
              content: function () {
                trigger.player.chooseToDiscard('he', 1, true);
              }
            },
            jlsg_zhaoxin: {
              audio: "ext:极略:2",
              trigger: { player: 'damageEnd' },
              filter: function (event, player) {
                var suits = ['heart', 'club', 'spade', 'diamond'];
                var cards = player.get('h');
                for (var i = 0; i < cards.length; i++) {
                  if (suits.contains(get.suit(cards[i])))
                    suits.remove(get.suit(cards[i]));
                }
                return suits.length > 0;
              },
              check: function (event, player) {
                return true;
              },
              // frequent: true,
              content: function () {
                player.showHandcards();
                var suits = ['heart', 'club', 'spade', 'diamond'];
                event.cards = player.get('h');
                for (var i = 0; i < event.cards.length; i++) {
                  if (suits.contains(get.suit(event.cards[i])))
                    suits.remove(get.suit(event.cards[i]));
                }
                if (suits.length)
                  player.draw(suits.length);
              }
            },
            jlsg_zhihe: {
              audio: "ext:极略:2",
              usable: 1,
              enable: 'phaseUse',
              filter: function (event, player) {
                return player.countCards('h') > 0;
              },
              filterCard: function (card, target, player) {
                for (var i = 0; i < ui.selected.cards.length; i++) {
                  if (get.suit(card) == get.suit(ui.selected.cards[i])) return false;
                }
                return true;
              },
              check: function (card) {
                return 10 - get.value(card);
              },
              discard: false,
              lose: false,
              prompt: '请选择你想要保留的卡牌',
              selectCard: function () {
                var cards = _status.event.player.get('h');
                var suits = [];
                for (var i = 0; i < cards.length; i++) {
                  if (!suits.contains(get.suit(cards[i])))
                    suits.push(get.suit(cards[i]));
                }
                return suits.length;
              },
              content: function () {
                'step 0'
                player.showHandcards();
                var he = [];
                var hs = player.get('h');
                he = he.concat(hs);
                for (var i = 0; i < cards.length; i++) {
                  he.remove(cards[i]);
                }
                player.discard(he);
                'step 1'
                player.draw(player.countCards('h'));

              },
              ai: {
                order: 2,
                result: {
                  player: function (player) {
                    var cards = player.get('h');
                    var suits = [];
                    for (var i = 0; i < cards.length; i++) {
                      if (!suits.contains(get.suit(cards[i])))
                        suits.push(get.suit(cards[i]));
                    }
                    var canget = (suits.length * 2 - player.countCards('h'));
                    return canget + 0.1;
                  }
                }
              }
            },
            jlsg_caijie: {
              audio: "ext:极略:1",
              trigger: { global: 'phaseZhunbeiBegin' },
              check: function (event, player) {
                var cards = player.get('h');
                for (var i = 0; i < cards.length; i++) {
                  if (cards[i].number > 11 && get.value(cards[i]) < 7) {
                    return get.attitude(player, event.player) < 0;
                  }
                }
                if (player.countCards('h', 'shan') && get.attitude(player, event.player) < 0 && player.countCards('h') > 2) return 1;
                return 0;
              },
              filter: function (event, player) {
                return event.player != player && event.player.countCards('h') >= player.countCards('h') && player.countCards('h') > 0;
              },
              prompt: function (event, player) {
                var str = '';
                str += '是否对' + get.translation(event.player) + '发动【才捷】？';
                return str;
              },
              content: function () {
                'step 0'
                player.chooseToCompare(trigger.player);
                'step 1'
                if (result.bool) {
                  player.draw(2);
                } else {
                  trigger.player.useCard({ name: 'sha' }, player, false);
                }
              },
              ai: {
                expose: 0.2
              }
            },
            jlsg_jilei: {
              audio: "ext:极略:1",
              trigger: { player: 'damageEnd' },
              check: function (event, player) {
                return get.attitude(player, event.source) < 0;
              },
              filter: function (event, player) {
                return event.source && event.source.countCards('h') > 0;
              },
              content: function () {
                'step 0'
                trigger.source.showHandcards();
                var cards = [
                  trigger.source.getCards('h', { type: 'basic' }),
                  trigger.source.getCards('h', { type: ['trick', 'delay'] }),
                  trigger.source.getCards('h', { type: 'equip' }),
                ];
                var maxNum = cards.reduce((a, b) => a.length > b.length ? a : b).length;
                if (cards.filter(cs => cs.length == maxNum).length == 1) {
                  trigger.source.discard(cards.filter(cs => cs.length == maxNum)[0]);
                  event.finish();
                  return;
                }
                var choices = [], choice, v = Infinity, tempv;
                if (cards[0].length == maxNum) {
                  choices.push('基本牌');
                  choice = '基本牌';
                  v = cards[0].reduce((a, b) => a + get.value(b, trigger.source), 0);
                }
                if (cards[1].length == maxNum) {
                  choices.push('锦囊牌');
                  tempv = cards[1].reduce((a, b) => a + get.value(b, trigger.source), 0);
                  if (tempv < v) {
                    choice = '锦囊牌';
                    v = tempv;
                  }
                }
                if (cards[2].length == maxNum) {
                  choices.push('装备牌');
                  tempv = cards[2].reduce((a, b) => a + get.value(b, trigger.source), 0);
                  if (tempv < v) {
                    choice = '装备牌';
                    v = tempv;
                  }
                }
                player.chooseControl(choices).set('prompt', '弃置一种类型的手牌').set('choice', choice).set('ai', function () {
                  return _status.event.choice;
                });
                'step 1'
                switch (result.control) {
                  case '基本牌':
                    trigger.source.discard(trigger.source.getCards('h', { type: 'basic' }));
                    break;
                  case '锦囊牌':
                    trigger.source.discard(trigger.source.getCards('h', { type: ['trick', 'delay'] }));

                    break;
                  case '装备牌':
                    trigger.source.discard(trigger.source.getCards('h', { type: 'equip' }));
                    break;
                }
              },
            },
            jlsg_yanliang: {
              audio: "ext:极略:2",
              trigger: { global: 'phaseZhunbeiBegin' },
              filter: function (event, player) {
                return player.countDiscardableCards(player, 'he');
              },
              direct: true,
              content: function () {
                'step 0'
                player.chooseToDiscard('是否对' + get.translation(trigger.player) + '发动【延粮】?', 'he').ai = function (card) {
                  if (get.attitude(player, trigger.player) > 0 && trigger.player.countCards('j', 'lebu')) return 8 - get.value(card) && get.color(card) == 'black';
                  if (get.attitude(player, trigger.player) < 0) return 4 - get.value(card);
                  return 0;
                };
                'step 1'
                if (result.bool) {
                  player.logSkill('jlsg_yanliang', trigger.player);
                  if (get.color(result.cards[0]) == 'red') {
                    trigger.player.addTempSkill('jlsg_yanliang_adjust');
                    trigger.player.addTempSkill('jlsg_yanliang_red');
                  } else {
                    trigger.player.addTempSkill('jlsg_yanliang_adjust');
                    trigger.player.addTempSkill('jlsg_yanliang_black');
                  }
                }
              },
              subSkill: {
                adjust: {
                  trigger: { player: 'phaseDrawBefore' },
                  priority: 100,
                  forced: true,
                  popup: false,
                  content: function () {
                    trigger.cancel();
                    player.removeSkill('jlsg_yanliang_adjust');
                  }
                },
                red: {
                  trigger: { player: 'phaseUseAfter' },
                  forced: true,
                  popup: false,
                  mark: true,
                  intro: {
                    marktext: '延',
                    content: '摸牌阶段在出牌阶段后进行'
                  },
                  content: function () {
                    player.phaseDraw();
                    player.removeSkill('jlsg_yanliang_red');
                  }
                },
                black: {
                  trigger: { player: 'phaseDiscardAfter' },
                  forced: true,
                  popup: false,
                  mark: true,
                  intro: {
                    marktext: '延',
                    content: '摸牌阶段在弃牌阶段后进行'
                  },
                  content: function () {
                    player.phaseDraw();
                    player.removeSkill('jlsg_yanliang_black');
                  }
                }
              }
            },
            jlsg_duzhi: {
              audio: "ext:极略:1",
              trigger: { player: 'recoverEnd' },
              direct: true,
              content: function () {
                'step 0'
                player.chooseTarget('是否发动【毒治】？', function (card, target, player) {
                  return player != target;
                }).ai = function (target) {
                  return -get.attitude(player, target);
                }
                'step 1'
                if (result.bool) {
                  player.logSkill('jlsg_duzhi', result.targets);
                  for (var i = 0; i < result.targets.length; i++) {
                    result.targets[i].loseHp(trigger.num);
                    result.targets[i].chooseToUse({ name: 'sha' }, player);
                  }
                }
              },
              ai: {
                expose: 0.2
              },
              group: 'jlsg_duzhi2'
            },
            jlsg_duzhi2: {
              direct: true,
              trigger: { source: 'damageEnd' },
              filter: function (event, player) {
                return event.card && event.card.name == 'sha' && get.color(event.card) == 'red' && event.num > 0 && event.notLink();
              },
              content: function () {
                'step 0'
                player.chooseTarget('是否发动【毒治】？', [1, trigger.num], function (card, target, player) {
                  return player != target;
                }).ai = function (target) {
                  return -get.attitude(player, target);
                }
                'step 1'
                if (result.bool) {
                  player.logSkill('jlsg_duzhi', result.targets);
                  for (var i = 0; i < result.targets.length; i++) {
                    result.targets[i].loseHp();
                    result.targets[i].chooseToUse({ name: 'sha' }, player);
                  }
                }
              },
              ai: {
                expose: 0.2
              },
            },
            jlsg_lieyi: {
              mod: {
                cardname: function (card, player, name) {
                  if (card.name == 'tao') return 'sha';
                  if (card.name == 'shan') return 'jiu';
                },
              },
              audio: "ext:极略:1",
              trigger: {
                player: "useCard",
              },
              forced: true,
              filter: function (event, player) {
                return event.card.name == 'sha' && event.cards && event.cards.length == 1 && event.cards[0].name == 'tao'
                  || event.card.name == 'jiu' && event.cards && event.cards.length == 1 && event.cards[0].name == 'shan';
              },
              content: function () {
              },
            },
            jlsg_baoli: {
              audio: "ext:极略:2",
              usable: 1,
              enable: 'phaseUse',
              filterTarget: function (card, player, target) {
                if (player == target) return false;
                return !target.countCards('e') || target.countCards('j');
              },
              content: function () {
                target.damage(player);
              },
              ai: {
                order: 4,
                result: {
                  target: -1,
                }
              }
            },
            jlsg_huanbing: {
              audio: "ext:极略:2",
              trigger: { target: 'shaBefore' },
              // filter: function (event, player) {
              //   if (get.itemtype(event.card) != 'card') return false;
              //   return event.card && event.card.name == 'sha';
              // },
              forced: true,
              init: function (player) {
                player.storage.jlsg_huanbing = [];
              },
              content: function () {
                'step 0'
                trigger.cancel();
                player.$gain2(trigger.cards);
                trigger.player.lose(trigger.cards, ui.special, 'tostorage'); // might not be necessary
                player.storage.jlsg_huanbing = player.storage.jlsg_huanbing.concat(trigger.cards);
                player.syncStorage('jlsg_huanbing');
                if (player.storage.jlsg_huanbing.length != 0) {
                  player.markSkill('jlsg_huanbing');
                }
              },
              intro: {
                content: 'cards'
              },
              ai: {
                effect: {
                  target: function (card, player, target) {
                    if (card.name == 'sha') return 0.6;
                  }
                }
              },
              group: 'jlsg_huanbing2'
            },
            jlsg_huanbing2: {
              audio: "ext:极略:2",
              trigger: { player: 'phaseZhunbeiBegin' },
              filter: function (event, player) {
                return player.storage.jlsg_huanbing.length;
              },
              forced: true,
              content: function () {
                'step 0'
                if (player.storage.jlsg_huanbing.length) {
                  event.card = player.storage.jlsg_huanbing.shift();
                  if (!player.storage.jlsg_huanbing.length) {
                    player.unmarkSkill('jlsg_huanbing');
                  }
                  else {
                    player.markSkill('jlsg_huanbing');
                  }
                  player.syncStorage('jlsg_huanbing');
                  player.$phaseJudge(event.card);
                  player.judge(function (card) {
                    if (get.color(card) == 'red') return 1;
                    return -0.5;
                  });
                }
                else {
                  event.finish();
                }
                'step 1'
                if (result.bool) {
                  player.draw();
                }
                else {
                  player.loseHp();
                  player.gain(event.card, 'fromstorage');
                }
                event.goto(0);
              }
              // content: function () {
              //   'step 0'
              //   if (player.storage.jlsg_huanbing.length) {
              //     event.card = player.storage.jlsg_huanbing.shift();
              //     player.syncStorage('jlsg_huanbing');
              //     if (!player.storage.jlsg_huanbing.length) {
              //       player.unmarkSkill('jlsg_huanbing');
              //     } else {
              //       player.markSkill('jlsg_huanbing');
              //     }
              //     // player.lose(event.card,'visible');
              //     player.$throw(event.card);
              //     player.judge( // player.storage.jlsg_huanbing[0],
              //       function (card) {
              //         if (get.color(card) == 'red') return 1;
              //         return -0.5;
              //     });
              //   } else {
              //     event.finish();
              //   }
              //   'step 1'
              //   // player.storage.jlsg_huanbing.remove(player.storage.jlsg_huanbing[0]);
              //   if (result.bool) {
              //     player.draw('nodelay');
              //   } else {
              //     console.log(event.card);
              //     player.gain(event.card, 'gain2');
              //     player.loseHp();
              //   }
              //   event.goto(0);
              // }
            },
            // jlsg_hongyuan: {
            //   enable: "phaseUse",
            //   usable: 1,
            //   filterCard: true,
            //   selectCard: 2,
            //   audio: "ext:极略:1",
            //   position: 'h',
            //   check: function (card) {
            //     return 7 - get.value(card);
            //   },
            //   multitarget: true,
            //   targetprompt: ["被移走", "被放置"],
            //   filterTarget: function (card, player, target) {
            //     if (ui.selected.targets.length) {
            //       var from = ui.selected.targets[0];
            //       var judges = from.getCards('j');
            //       for (var i = 0; i < judges.length; i++) {
            //         if (!target.hasJudge(judges[i].viewAs || judges[i].name)) return true;
            //       }
            //       if (target.isMin()) return false;
            //       if ((from.getEquip(1) && !target.getEquip(1)) ||
            //         (from.getEquip(2) && !target.getEquip(2)) ||
            //         (from.getEquip(3) && !target.getEquip(3)) ||
            //         (from.getEquip(4) && !target.getEquip(4)) ||
            //         (from.getEquip(5) && !target.getEquip(5))) return true;
            //       return false;
            //     } else {
            //       return target.countCards('e') > 0;
            //     }
            //   },
            //   selectTarget: 2,
            //   content: function () {
            //     "step 0"
            //     if (targets.length == 2) {
            //       player.choosePlayerCard('e', true, function (button) {
            //         if (get.attitude(player, targets[0]) > get.attitude(player, targets[1]), true) {
            //           return get.position(button.link) == 'j' ? 10 : 0;
            //         } else {
            //           if (get.position(button.link) == 'j', true) return -10;
            //           return get.equipValue(button.link);
            //         }
            //       }, targets[0]);
            //     } else {
            //       event.finish();
            //     }
            //     "step 1"
            //     if (result.bool) {
            //       if (get.position(result.buttons[0].link) == 'e', true) {
            //         event.targets[1].equip(result.buttons[0].link, true);
            //       } else if (result.buttons[0].link.viewAs) {
            //         event.targets[1].addJudge({ name: result.buttons[0].link.viewAs }, [result.buttons[0].link], true);
            //       } else {
            //         event.targets[1].addJudge(result.buttons[0].link, true);
            //       }
            //       event.targets[0].$give(result.buttons[0].link, event.targets[1], true)
            //       game.delay();
            //     }
            //   },
            //   ai: {
            //     order: 10,
            //     result: {
            //       target: function (player, target) {
            //         if (ui.selected.targets.length == 0) {
            //           if (target.countCards('j') && get.attitude(player, target) > 0) return 1;
            //           if (get.attitude(player, target) < 0) {
            //             var players = game.filterPlayer();
            //             for (var i = 0; i < players.length; i++) {
            //               if (get.attitude(player, players[i]) > 0) {
            //                 if ((target.getEquip(1) && !players[i].getEquip(1)) ||
            //                   (target.getEquip(2) && !players[i].getEquip(2)) ||
            //                   (target.getEquip(3) && !players[i].getEquip(3)) ||
            //                   (target.getEquip(4) && !players[i].getEquip(4)) ||
            //                   (target.getEquip(5) && !players[i].getEquip(5)))
            //                   return -1;
            //               }
            //             }
            //           }
            //           return 0;
            //         } else {
            //           return get.attitude(player, ui.selected.targets[0]) > 0 ? -1 : 1;
            //         }
            //       },
            //     },
            //     expose: 0.2,
            //     threaten: 1.5,
            //   },
            // },
            jlsg_hongyuan: {
              audio: "ext:极略:1",
              usable: 1,
              enable: 'phaseUse',
              filter: function (event, player) {
                return player.countDiscardableCards(player, 'h') && player.isDamaged() && player.canMoveCard();
              },
              filterCard: true,
              selectCard: function () {
                return [1, _status.event.player.getDamagedHp()];
              },
              check: function (card) {
                return 6 - ai.get.value(card);
              },
              filterTarget: function (card, player, target) {
                return target.canMoveCard();
              },
              content: function () {
                'step 0'
                event.count = cards.length;
                'step 1'
                target.chooseTarget('请选择目标', function (card, player, target2) {
                  return target2.countCards('ej');
                }).set('ai', function (target2) {
                  var target = _status.event.player;
                  if (ai.get.attitude(target, target2) > 0 && target2.num('j')) return 1;
                  return -ai.get.attitude(target, target2);
                });
                'step 2'
                if (result.bool) {
                  target.gainPlayerCard('请选择想要获得的牌', [1, event.count], 'ej', result.targets[0], true);
                }
                else {
                  event.finish();
                }
                'step 3'
                if (result.bool) {
                  event.count -= result.links.length;
                  if (event.count) event.goto(1);
                }
              },
            },
            jlsg_huaqiang: {
              audio: "ext:极略:2",
              usable: 1,
              enable: 'phaseUse',
              filter: function (event, player) {
                return player.countCards('h') >= player.hp;
              },
              filterCard: function (card) {
                for (var i = 0; i < ui.selected.cards.length; i++) {
                  if (get.suit(card) == get.suit(ui.selected.cards[i])) return false;
                }
                return true;
              },
              selectCard: function () {
                return Math.min(4, _status.event.player.hp);
              },
              filterTarget: function (card, player, target) {
                return player != target;
              },
              check: function (card) {
                return 6 - get.value(card);
              },
              content: function () {
                target.damage();
              },
              ai: {
                order: 8,
                expose: 0.2,
                result: {
                  player: function (player) {
                    var eff = player.hp / 2;
                    return -eff;
                  },
                  target: function (player, target) {
                    return get.damageEffect(target, player);
                  }
                }
              }
            },
            jlsg_chaohuang: {
              audio: "ext:极略:1",
              usable: 1,
              enable: 'phaseUse',
              filterTarget: function (card, player, target) {
                return target.inRangeOf(player) && player.canUse({ name: 'sha' }, target, false);
              },
              delay: false,
              line: false,
              selectTarget: [1, Infinity],
              multitarget: true,
              content: function () {
                player.loseHp();
                player.useCard({ name: 'sha' }, targets, false);
              },
              ai: {
                order: 5,
                result: {
                  target: function (player, target) {
                    var ts = game.filterPlayer(function (cur) {
                      return cur.inRangeOf(player) && player.canUse({ name: 'sha' }, cur, false) && get.effect(cur, { name: 'sha' }, player, player) > 0;
                    });
                    if (ts.length <= 1 || player.hp <= 1) return 0;
                    return get.effect(target, { name: 'sha' }, player, target);
                  }
                }
              }
            },
            jlsg_old_zhishi: {
              audio: "ext:极略:2",
              srlose: true,
              enable: "phaseUse",
              usable: 1,
              filter: function (event, player) {
                return player.countCards("h", "sha") || player.countCards("h", "shan");
              },
              filterCard: function (card) {
                return card.name == 'sha' || card.name == 'shan';
              },
              prompt: "选择一张【杀】或【闪】，并且选择一名有手牌的其他角色，发动【治世】。",
              filterTarget: function (card, player, target) {
                return target != player && target.countCards('h');
              },
              discard: false,
              lose: false,
              content: function () {
                "step 0"
                player.showCards(cards[0]);
                var nono = false;
                if (ai.get.damageEffect(target, player, player)) nono = true;
                if (cards[0].name == 'sha') {
                  target.chooseToDiscard("请弃置一张【杀】，令" + get.translation(target) + "恢复1点体力，否则你受到1点伤害", { name: "sha" }).set("ai", function () {
                    if (_status.nono == true) return false;
                    return true;
                  }).set('nono', nono);
                }
                if (cards[0].name == 'shan') {
                  target.chooseCard("请展示一张【闪】，令" + get.translation(target) + "恢复1点体力，否则你受到1点伤害", 'h', function (card, player, target) {
                    return get.name(card) == "shan";
                  }).set("ai", function () {
                    if (_status.nono == true) return false;
                    return true;
                  }).set('nono', nono);
                }
                "step 1"
                if (cards[0].name == 'shan' && result.cards) {
                  target.showCards(result.cards[0]);
                }
                "step 2"
                if (result.bool) {
                  player.recover();
                  target.recover();
                } else {
                  target.damage(player);
                }
              },
              ai: {
                basic: {
                  order: 7,
                },
                result: {
                  player: function (player) {
                    return 1;
                  },
                  target: function (player, target) {
                    return get.damageEffect(target, player, player);
                  },
                },
              },
            },
            jlsg_huilian: {
              audio: "ext:极略:1",
              usable: 1,
              enable: 'phaseUse',
              filterTarget: function (card, player, target) {
                return player != target;
              },
              content: function () {
                'step 0'
                target.judge(function (card) {
                  if (target.hp == target.maxHp) {
                    if (get.suit(card) == 'heart') return 1;
                  }
                  if (get.suit(card) == 'heart') return 2;
                  return 1;
                });
                'step 1'
                target.gain(result.card, 'gain2');
                if (result.suit == 'heart') {
                  target.recover();
                }
              },
              ai: {
                order: 9,
                expose: 0.2,
                result: {
                  target: function (target) {
                    if (target.isDamaged()) return 2;
                    return 1;
                  }
                }
              }
            },
            jlsg_wenliang: {
              audio: "ext:极略:2",
              trigger: { global: 'judgeAfter' },
              frequent: true,
              filter: function (event, player) {
                return (get.color(event.result.card) == 'red');
              },
              content: function () {
                player.draw();
              }
            },
            jlsg_qianhuan: {
              audio: "ext:极略:2",
              // forbid:['guozhan'],
              trigger: {
                player: 'enterGame',
                global: 'phaseBefore',
              },
              forced: true,
              unique: true,
              priority: -555,
              init: function (player) {
                player.storage.jlsg_qianhuan_fenpei = [];
              },
              filter: function (event, player) {
                if (event.name == 'phase') {
                  return event.player == player || game.phaseNumber == 0;
                } else {
                  return true;
                }
              },
              content: function () {
                "step 0"
                // if (player.isUnseen(2)) {
                //   player.useSkill('jlsg_qianhuan2');
                // }
                if (get.config('double_character')) { // || lib.config.mode == 'guozhan'
                  // event.num = 4;
                  event.set('num', 4);
                  // player.name2 = player.name1;
                } else {
                  // event.num = 2;
                  event.set('num', 2);
                }
                // var list = [];
                // for (var i in lib.character) {
                //   if (lib.filter.characterDisabled(i)) continue;
                //   if (lib.filter.characterDisabled2(i)) continue;
                //   list.push(i);
                // }
                // for (var i = 0; i < game.players.length; i++) {
                //   if (game.players[i] == player) continue;
                //   list.remove([game.players[i].name]);
                //   list.remove([game.players[i].name1]);
                //   list.remove([game.players[i].name2]);
                // }
                // list.remove(player.name);
                // var list = list.randomGets(3);
                var list;
                if (_status.characterlist) {
                  list = _status.characterlist.slice();
                } else if (_status.connectMode) {
                  list = get.charactersOL();
                } else {
                  list = get.gainableCharacters();
                }
                var stagePlayers = game.players.concat(game.dead);
                for (const player of stagePlayers) {
                  list.remove(player.name);
                  list.remove(player.name1);
                  list.remove(player.name2);
                }
                list = list.randomGets(3);
                event.list = list;
                var skills = [];
                for (var i of list) {
                  skills.addArray((lib.character[i][3] || []).filter(function (skill) {
                    var info = get.info(skill);
                    return info && !info.zhuSkill && !info.limited && !info.juexingji && !info.hiddenSkill && !info.charlotte && !info.hiddenSkill && !info.dutySkill;
                  }));
                }
                skills.addArray(player.storage.jlsg_qianhuan_fenpei);
                if (!list.length || !skills.length) { event.finish(); return; }
                if (player.isUnderControl()) {
                  game.swapPlayerAuto(player);
                }
                var switchToAuto = function () {
                  _status.imchoosing = false;
                  event._result = {
                    bool: true,
                    skills: skills.randomGets(event.num),
                  };
                  if (event.dialog) event.dialog.close();
                  if (event.control) event.control.close();
                };
                var chooseButton = function (list, skills) {
                  var event = _status.event;
                  if (!event._result) event._result = {};
                  event._result.skills = [];
                  var rSkill = event._result.skills;
                  var dialog = null;
                  if (player.storage.jlsg_qianhuan_fenpei.length) {
                    lib.character[player.name][3] = player.storage.jlsg_qianhuan_fenpei;
                    dialog = ui.create.dialog(`请选择获得至多${event.num == 2 ? '两' : '四'}个技能`, [list.concat(player.name), 'character'], 'hidden');
                  } else {
                    dialog = ui.create.dialog(`请选择获得至多${event.num == 2 ? '两' : '四'}个技能`, [list, 'character'], 'hidden');
                  }
                  event.dialog = dialog;
                  var table = document.createElement('div');
                  table.classList.add('add-setting');
                  table.style.margin = '0';
                  table.style.width = '100%';
                  table.style.position = 'relative';
                  for (var i = 0; i < skills.length; i++) {
                    var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
                    td.link = skills[i];
                    table.appendChild(td);
                    td.innerHTML = '<span>' + get.translation(skills[i]) + '</span>';
                    td.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                      if (_status.dragged) return;
                      if (_status.justdragged) return;
                      _status.tempNoButton = true;
                      setTimeout(function () {
                        _status.tempNoButton = false;
                      }, 500);
                      var link = this.link;
                      if (!this.classList.contains('bluebg')) {
                        if (rSkill.length >= event.num) return;
                        rSkill.add(link);
                        this.classList.add('bluebg');
                      }
                      else {
                        this.classList.remove('bluebg');
                        rSkill.remove(link);
                      }
                    });
                  }
                  dialog.content.appendChild(table);
                  dialog.add('　　');
                  dialog.open();

                  event.switchToAuto = function () {
                    event.dialog.close();
                    event.control.close();
                    game.resume();
                    _status.imchoosing = false;
                  };
                  event.control = ui.create.control('ok', function (link) {
                    event.dialog.close();
                    event.control.close();
                    game.resume();
                    _status.imchoosing = false;
                  });
                  for (var i = 0; i < event.dialog.buttons.length; i++) {
                    event.dialog.buttons[i].classList.add('selectable');
                  }
                  game.pause();
                  game.countChoose();
                };
                if (event.isMine()) {
                  chooseButton(list, skills);
                }
                else if (event.isOnline()) {
                  event.player.send(chooseButton, list, skills);
                  event.player.wait();
                  game.pause();
                }
                else {
                  switchToAuto();
                }
                'step 1'
                var map = event.result || result;
                if (map && map.skills && map.skills.length) {
                  for (var i of player.storage.jlsg_qianhuan_fenpei) {
                    if (!map.skills.contains(i) && player.hasSkill(i)) {
                      player.removeSkill(i);
                    }
                  }
                  for (var i of map.skills) {
                    if (!player.hasSkill(i)) {
                      player.addSkillLog(i);
                    }
                  }
                  player.storage.jlsg_qianhuan_fenpei = map.skills;
                }
              },
              ai: {
                threaten: 2.5,
              },
              group: ['jlsg_qianhuan2'],
            },
            jlsg_qianhuan2: { // remove the other avatar
              trigger: { global: 'phaseBefore' },
              forced: true,
              priority: 100,
              unique: true,
              popup: false,
              silent: true,
              filter: function (event, player) {
                return game.phaseNumber == 0 && get.config('double_character'); // || lib.config.mode == 'guozhan';
              },
              content: function () {
                "step 0"
                if (lib.config.mode == 'guozhan' && get.config('guozhan_mode') != 'mingjiang') player.showCharacter(2);
                player.uninit();
                player.style.transform = '';
                player.node.avatar.style.transform = '';
                player.node.avatar2.style.transform = '';
                player.classList.remove('fullskin2');
                player.node.avatar2.setBackground = '';
                player.node.avatar2.hide();
                // player.node.name.style.display = 'none';
                player.node.name2.style.display = 'none';
                "step 1"
                player.init('jlsgsk_zuoci');
                if (!player.ai.shown) {
                  player.ai.shown = 0;
                }
              },
            },
            jlsg_jinglun: {
              audio: "ext:极略:2",
              usable: 1,
              trigger: { global: ['respond', 'useCard'] },
              filter: function (event, player) {
                if (!event.respondTo) return false;
                if (event.player == player && player != event.respondTo[0]) {
                  var cards = [];
                  if (get.itemtype(event.respondTo[1]) == 'card') cards.push(event.respondTo[1]);
                  else if (event.respondTo[1].cards) cards.addArray(event.respondTo[1].cards);
                  return cards.filterInD('od').length != 0;
                }
                if (event.player != player && player == event.respondTo[0]) {
                  return event.cards.filterInD('od').length > 0;
                }
                return false;
              },
              check: function (event, player) {
                return true;
                // return get.value(event.cards.filterInD('od'), player) > 0;
              },
              logTarget: 'player',
              content: function () {
                var cards = [];
                if (trigger.player == player && player != trigger.respondTo[0]) {
                  if (get.itemtype(trigger.respondTo[1]) == 'card') cards.push(trigger.respondTo[1]);
                  else if (trigger.respondTo[1].cards) cards.addArray(trigger.respondTo[1].cards);
                } else {
                  cards = trigger.cards;
                }
                cards = cards.filterInD('od');
                player.gain(cards, 'log', 'gain2');
              },
            },
            jlsg_ruzong: {
              audio: "ext:极略:1",
              group: ['jlsg_ruzong_wuxie', 'jlsg_ruzong_shan'],
              subSkill: {
                wuxie: { // 闪当无懈
                  audio: 'jlsg_ruzong',
                  position: "hs",
                  enable: ['chooseToUse', 'chooseToRespond'],
                  filterCard: { name: 'shan' },
                  viewAsFilter: function (player) {
                    return player.countCards('hs', 'shan') != 0;
                  },
                  viewAs: {
                    name: "wuxie",
                  },
                  prompt: "将一张闪当无懈可击使用",
                  check: function (card) { return 8 - get.value(card); },
                },
                shan: {
                  audio: 'jlsg_ruzong',
                  position: "hs",
                  enable: ['chooseToUse', 'chooseToRespond'],
                  filterCard: { name: 'wuxie' },
                  viewAsFilter: function (player) {
                    return player.countCards('hs', 'wuxie') != 0;
                  },
                  viewAs: {
                    name: "shan",
                  },
                  prompt: "将一张无懈可击当闪使用或打出",
                  check: function (card) { return 1; },
                  ai: {
                    respondShan: true,
                    skillTagFilter: function (player) {
                      if (!player.countCards('hs', 'wuxie')) return false;
                    },
                  },
                },
              },
            },
            jlsg_leiji: {
              audio: "ext:极略:1",
              trigger: { global: "useCard", },
              mark: true,
              marktext: "祭",
              // intro: {
              //   mark: function (dialog, content, player) {
              //     var num = Array.from(ui.cardPile.childNodes).filter(card => get.name(card) == 'shandian').length;
              //     num += Array.from(ui.discardPile.childNodes).filter(card => get.name(card) == 'shandian').length;
              //     return `剩余${get.cnNumber(num)}张闪电`;
              //   },
              //   markcount: function (storage, player) {
              //     var num = Array.from(ui.cardPile.childNodes).filter(card => get.name(card) == 'shandian').length;
              //     return num + Array.from(ui.discardPile.childNodes).filter(card => get.name(card) == 'shandian').length;
              //   },
              // },
              filter: function (event, player) {
                return event.card.name == 'shan' && event.player != player;
              },
              direct: true,
              content: function () {
                'step 0'
                var card = get.cardPile(function (card) {
                  return card.name == 'shandian';
                });
                if (card) {
                  event.card = card;
                  player.chooseTarget(get.prompt('jlsg_leiji'), function (card, player, target) {
                    return lib.filter.targetEnabled({ name: 'shandian' }, target, target);
                  }).ai = function (target) {
                    var now = _status.currentPhase.next;
                    for (var i = 0; i < 10; i++) {
                      if (get.attitude(player, now) < 0) return target == now;
                      else {
                        now = now.next;
                      }
                    }
                    return false;
                  }
                } else {
                  event.finish();
                }
                'step 1'
                if (result.bool) {
                  player.logSkill('jlsg_leiji', result.targets[0]);
                  result.targets[0].$gain(event.card);
                  player.line(result.targets[0], 'thunder');
                  result.targets[0].addJudge(event.card);
                }
              }
            },
            jlsg_shanxi: {
              audio: "ext:极略:1",
              trigger: { global: 'judgeEnd' },
              forced: true,
              filter: function (event, player) {
                return get.position(event.result.card, true) == 'o' &&
                  event.card && event.card.name == 'shandian' && event.player != player;
              },
              content: function () {
                player.gain(trigger.result.card, 'gain2');
              },
              mod: {
                targetEnabled: function (card) {
                  if (card.name == 'shandian') return false;
                }
              }
            },
            jlsg_guhuo: {
              audio: "ext:极略:3",
              trigger: { global: 'phaseBegin' },
              filter: function (event, player) {
                return player.canCompare(event.player); // && !event.player.hasSkill("jlsg_chanyuan");
              },
              check: function (event, player) {
                var cards = player.get('h');
                for (var i = 0; i < cards.length; i++) {
                  if (cards[i].number > 11 && get.value(cards[i]) < 7) {
                    return get.attitude(player, event.player) < 0;
                  }
                }
                if (get.attitude(player, event.player) < 0 && player.countCards('h') > 2) return 1;
                return 0;
              },
              logTarget: 'player',
              content: function () {
                'step 0'
                player.chooseToCompare(trigger.player);
                'step 1'
                var target = trigger.player;
                if (result.bool) {
                  var list = [];
                  for (var name of lib.inpile) {
                    var type = get.type(name);
                    if (!['basic', 'trick'].contains(type)) {
                      continue;
                    }
                    if (lib.filter.cardEnabled({ name: name }, player)) {
                      list.push([type, '', name]);
                    }
                    if (name == 'sha') {
                      for (var j of lib.inpile_nature) {
                        if (lib.filter.cardEnabled({ name: name, nature: j }, player))
                          list.push([type, '', name, j]);
                      }
                    }
                  }
                  var dialog = ui.create.dialog('蛊惑', [list, 'vcard']);
                  var next = player.chooseButton(dialog);
                  var choice, value = 0;
                  for (let [_, __, cardName, nature] of list) { // choose button ai
                    let card = { name: cardName, nature: nature }
                    let newV = player.getUseValue(card);
                    if (newV > value) {
                      choice = [cardName, nature];
                      value = newV;
                    }
                  }
                  next.filterButton = function (button, player) {
                    return true;
                  }
                  next.ai = function (button) {
                    return button.link[2] === _status.event.choice[0] &&
                      (button.link[3] || true) === (_status.event.choice[1] || true);
                  }
                  next.choice = choice;
                } else {
                  player.damage(target);
                  event.finish();
                }
                'step 2'
                if (!result.bool) {
                  event.finish();
                  return;
                }
                var target = trigger.player;
                event.card = { name: result.links[0][2], nature: result.links[0][3] };
                player.chooseUseTarget(event.card, true);
              },
              ai: {
                expose: 0.1,
                order: 8,
                result: {
                  player: function (player) {
                    if (player.storage.jlsg_tianqi != undefined) return 1;
                    if (player.hp > 2 && player.storage.jlsg_tianqi == undefined) return -10;
                    if (Math.random() < 0.67) return 0.5;
                    return -1;
                  },
                },
                threaten: 4,
              }
            },
            jlsg_fulu: {
              audio: "ext:极略:3",
              init: function (player) {
                player.storage.jlsg_fulu1 = player.storage.jlsg_fulu1 || [];
                player.storage.jlsg_fulu2 = player.storage.jlsg_fulu2 || [];
              },
              trigger: { player: 'damageEnd' },
              filter: function (event, player) {
                return event.num > 0;
              },
              direct: true,
              content: function () {
                'step 0'
                if (trigger.source) {
                  player.storage.jlsg_fulu1.remove(trigger.source);
                  player.storage.jlsg_fulu1.unshift(trigger.source);
                  player.storage.jlsg_fulu1.splice(3);
                }
                event.cnt = trigger.num;
                'step 1'
                --event.cnt;
                if (player.storage.jlsg_fulu1.every(p => !p.countCards('he'))
                  && !player.storage.jlsg_fulu2.length) {
                  event.finish();
                  return;
                }
                let v = 0;
                for (let p of player.storage.jlsg_fulu1) {
                  v += get.attitude(player, p) > 0 ? -1 : 1;
                }
                for (let p of player.storage.jlsg_fulu2) {
                  v += get.attitude(player, p) > 0 ? 1 : -1;
                }
                player.chooseBool(get.prompt2(event.name), v >= 0);
                'step 2'
                if (!result.bool) {
                  event.finish();
                  return;
                }
                player.logSkill(event.name);
                player.storage.jlsg_fulu1.slice().sortBySeat().forEach(
                  p => p.randomDiscard(false)
                );
                game.asyncDraw(player.storage.jlsg_fulu2.slice().sortBySeat());
                'step 3'
                if (event.cnt) {
                  event.goto(1);
                }
              },
              group: ['jlsg_fulu_recover'],
              subSkill: {
                recover: {
                  trigger: { player: 'recoverEnd' },
                  silent: true,
                  filter: function (event, player) {
                    return event.source;
                  },
                  content: function () {
                    // player.storage.jlsg_fulu2.remove(trigger.source);
                    player.storage.jlsg_fulu2.unshift(trigger.source);
                    player.storage.jlsg_fulu2.splice(3);
                  }
                },
              }
            },
            jlsg_guixiu: {
              audio: "ext:极略:1",
              trigger: { player: 'phaseDiscardBefore' },
              frequent: true,
              filter: function (event, player) {
                return !player.getStat('damage');
              },
              content: function () {
                trigger.cancel();
                player.draw();
              },
            },
            jlsg_cunsi: {
              audio: "ext:极略:1",
              trigger: { player: 'die' },
              skillAnimation: true,
              animationColor: 'orange',
              direct: true,
              forceDie: true,
              content: function () {
                'step 0'
                let prompt = `###${get.prompt(event.name)}###将区域中所有牌移出游戏，然后令一名角色获得〖勇决〗`;
                player.chooseTarget(prompt, lib.filter.notMe).set('ai', function (target) {
                  return get.attitude(_status.event.player, target);
                });
                'step 1'
                if (!result.bool) {
                  event.finish();
                  return;
                }
                event.target = result.targets[0];
                var target = result.targets[0];
                player.logSkill(event.name, target);
                target.addSkill('jlsg_yongjue');
                'step 2'
                var target = result.targets[0];
                if (player.countCards('hej')) {
                  let cards = player.getCards('hej');
                  player.$give(cards, target, false);
                  player.lose(cards, ui.special, 'toStorage');
                  if (!target.storage.jlsg_yongjue2) {
                    target.storage.jlsg_yongjue2 = [];
                  }
                  target.storage.jlsg_yongjue2.push(...cards);
                  target.markSkill('jlsg_yongjue2');
                }
              },
              derivation: 'jlsg_yongjue',
            },
            jlsg_yongjue: {
              trigger: { source: 'damageBegin1' },
              filter: function (event) {
                return event.card && event.card.name == 'sha' && event.notLink();
              },
              forced: true,
              direct: true,
              content: function () {
                {
                  let gender = player.sex;
                  if (!['male', 'female'].contains(gender)) {
                    let gender = ['male', 'female'].randomGet();
                  }
                  if (gender === 'male') player.logSkill('jlsg_yongjue11');
                  else player.logSkill('jlsg_yongjue12');
                }
                trigger.num++;
              },
              ai: {
                damageBonus: true,
              },
              group: 'jlsg_yongjue2',
            },
            jlsg_yongjue2: {
              audio: "ext:极略:2",
              marktext: "嗣",
              intro: {
                name: "存嗣",
                content: 'cards',
              },
              trigger: {
                source: 'dieAfter',
              },
              filter: function (event, player, name) {
                return player.storage.jlsg_yongjue2 && player.storage.jlsg_yongjue2.length;
              },
              skillAnimation: true,
              animationColor: 'orange',
              locked: true,
              direct: true,
              content: function () {
                'step 0'
                {
                  let gender = player.sex;
                  if (!['male', 'female'].contains(gender)) {
                    let gender = ['male', 'female'].randomGet();
                  }
                  if (gender === 'male') player.logSkill('jlsg_yongjue21');
                  else player.logSkill('jlsg_yongjue22');
                }
                'step 1'
                player.$draw(player.storage.jlsg_yongjue2);
                player.gain(player.storage.jlsg_yongjue2, 'log', 'fromStorage');
                player.unmarkSkill('jlsg_yongjue2');
                delete player.storage.jlsg_yongjue2;
              },
            },
            jlsg_yongjue11: {
              inherit: 'jlsg_yongjue',
              audio: "ext:极略:true",
            },
            jlsg_yongjue12: {
              inherit: 'jlsg_yongjue',
              audio: "ext:极略:true",
            },
            jlsg_yongjue21: {
              inherit: 'jlsg_yongjue2',
              audio: "ext:极略:true",
            },
            jlsg_yongjue22: {
              inherit: 'jlsg_yongjue2',
              audio: "ext:极略:true",
            },
            jlsg_gongshen: {
              audio: "ext:极略:2",
              enable: 'phaseUse',
              filterCard: true,
              selectCard: 3,
              position: 'he',
              filter: function (event, player) {
                return player.countCards('he') > 2;
              },
              check: function (card, event) {
                if (jlsg.needKongcheng(_status.event.player)) return 10 - get.value(card)
                return 6 - get.value(card);
              },
              content: function () {
                'step 0'
                player.draw();
                'step 1'
                if (player.isDamaged()) {
                  if (!game.hasPlayer(function (target) {
                    return player.countCards('h') > target.countCards('h');
                  })) {
                    player.recover();
                  }
                }

              },
              ai: {
                order: 1,
                result: {
                  player: function (player) {
                    if (!player.isDamaged()) return -2;
                    var less = !game.hasPlayer(function (target) {
                      return player.countCards('h') - 2 > target.countCards('h');
                    });
                    if (less) return 1;
                    return 0;
                  }
                }
              }
            },
            jlsg_jianyue: {
              audio: "ext:极略:2",
              trigger: { global: 'phaseJieshuBegin' },
              filter: function (event, player) {
                if (ui.discardPile.hasChildNodes() == false) return false;
                return !game.hasPlayer(function (target) {
                  return event.player.countCards('h') > target.countCards('h');
                });
              },
              logTarget: 'player',
              frequent: function (event, player) {
                return event.player == player;
              },
              check: function (event, player) {
                if (jlsg.isFriend(player, event.player)) return !jlsg.needKongcheng(event.player, true);
                return get.attitude(player, event.player) > 0;
              },
              content: function () {
                'step 0'
                var isLess = !(ui.discardPile.hasChildNodes() == false) && !game.hasPlayer(function (target) {
                  return trigger.player.countCards('h') > target.countCards('h');
                });
                if (isLess) {
                  var card = jlsg.findCardInDiscardPile();
                  if (card) {
                    trigger.player.gain(card, 'gain2');
                    event.redo();
                  }
                }
              },
              ai: {
                threaten: 1.1
              }
            },
            jlsg_pengri: {
              audio: "ext:极略:2",
              enable: 'phaseUse',
              selectTarget: -1,
              usable: 1,
              line: 'fire',
              // filter: function (event, player) {
              //   return game.hasPlayer(function (target) {
              //     return player.inRangeOf(target) && player != target;
              //   });
              // },
              filterTarget: function (card, player, target) {
                return target && player != target && player.inRangeOf(target);
              },
              multitarget: true,
              multiline: true,
              precontent: function () {
                player.draw(2, 'nodelay');
              },
              content: function () {
                'step 0'
                event.target = event.targets.shift();
                if (!event.target) {
                  event.finish();
                  return;
                }
                event.target.chooseToUse('是否对' + get.translation(player) + '使用一张【杀】？', { name: 'sha' }, player, -1);
                'step 1'
                event.goto(0);
              },
              ai: {
                order: 9,
                result: {
                  player: function (player) {
                    var shotter = game.filterPlayer(p => p != player);
                    var sha = 0;
                    for (var shot of shotter) {
                      if (player.inRangeOf(shot) && !jlsg.isKongcheng(shot) && !jlsg.isFriend(shot, player)) {
                        sha++;
                      }
                    }
                    var shan = jlsg.getCardsNum('shan', player, player);
                    if (sha > 3 && player.hp <= 2) return -1;
                    if (shan >= sha) return 1;
                    if (sha == 0) return 2;
                    return 0;
                  }
                }
              }
            },
            jlsg_danmou: {
              audio: "ext:极略:2",
              trigger: { player: 'damageEnd' },
              filter: function (event, player) {
                return event.source && event.source.isAlive() && event.source != player
                  && (event.source.countCards('h') || player.countCards('h'));
              },
              check: function (event, player) {
                if (get.attitude(player, event.source) <= 0) {
                  var cardlength = player.countCards('h');
                  for (var i = 0; i < player.getCards('h').length; i++) {
                    if (get.value(player.getCards('h')[i]) > 7) {
                      cardlength--;
                    }
                  }
                  if (Math.random < 0.5 && cardlength == event.source.countCards('h')) cardlength--;
                  return cardlength < event.source.countCards('h');
                } else {
                  if (_status.currentPhase == event.source) {
                    if (event.source.countUsed('sha') <= 0) return false;
                    return event.source.needsToDiscard();
                  } else {
                    if (event.source.hp < player.hp) {
                      return player.countCards('h') - event.source.countCards('h');
                    }
                  }
                }
              },
              content: function () {
                player.swapHandcards(trigger.source);
              },
              ai: {
                effect: {
                  target: function (card, player, target) {
                    if (player.countCards('h') <= target.countCards('h')) return;
                    if (get.tag(card, 'damage') && get.attitude(player, target) < 0) return [1, player.countCards('h') - target.countCards('h') - 1];
                  },
                }
              }
            },
            jlsg_fushe: {
              audio: "ext:极略:2",
              trigger: { global: 'phaseUseBegin' },
              filter: function (event, player) {
                return event.player.inRangeOf(player) && event.player != player;
              },
              logTarget: 'player',
              check: function (event, player) {
                return get.attitude(event.player, player) < 0;
              },
              content: function () {
                'step 0'
                player.chooseControl('heart2', 'diamond2', 'club2', 'spade2').set('ai', function (event) {
                  var rand = Math.ceil(Math.random() * 6);
                  var suit = 'heart2';
                  if ([1, 4].contains(rand)) {
                    suit = 'diamond2';
                  } else if ([2, 5].contains(rand)) {
                    suit = 'club2';
                  } else if (rand == 3) {
                    suit = 'spade2';
                  } else {
                    suit = 'heart2';
                  }
                  return suit;
                });
                'step 1'
                var message = `<span style="color: ${['heart2', 'diamond2'].contains(result.control) ? "#631515" : "rgba(0,0,0,0.8)"}; font-size: 200%;">${get.translation(result.control.slice(0, -1))}</span>`;
                // can't really chat this due to ban words restrictions
                player.say(message);
                game.log(player, "选择了", result.control);
                trigger.player.storage.jlsg_fushe = result.control;
                trigger.player.storage.jlsg_fushe_source = player;
                trigger.player.addTempSkill('jlsg_fushe_scanning', 'phaseUseAfter');
              },
              subSkill: {
                scanning: {
                  mark: true,
                  intro: {
                    content: function (storage, player) {
                      if (!player.storage.jlsg_fushe) return null;
                      if (player.hasSkill("jlsg_fushe_debuff")) {
                        return `阶段结束时受到来自${get.translation(player.storage.jlsg_fushe_source)}的一点伤害`;
                      }
                      return `出牌阶段${get.translation(player.storage.jlsg_fushe)}牌进入弃牌堆时，\
此阶段结束时受到来自${get.translation(player.storage.jlsg_fushe_source)}的1点伤害'`;
                    }
                  },
                  audio: false,
                  popup: false,
                  forced: true,
                  silent: true,
                  trigger: { global: ["loseAfter", "cardsDiscardAfter"] },
                  filter: function (event, player) {
                    /* actually, all cards that entered discard counts */
                    // var p;
                    // if (event.player) {
                    //   if (event.player != player) return false;
                    // } else {
                    //   var evt =event.getParent();
                    //   if(!(evt.name == 'orderingDiscard' && evt.relatedEvent && evt.relatedEvent.player === player)) { // && ['useCard','respond'].contains(evt.relatedEvent.name)
                    //     return false;
                    //   }
                    // }
                    return !player.hasSkill('jlsg_fushe_debuff') && event.cards.some(c => get.position(c, true) == 'd' &&
                      get.suit(c) + '2' === player.storage.jlsg_fushe);
                  },
                  content: function () {
                    'step 0'
                    player.unmarkSkill("jlsg_fushe_scanning");
                    player.addTempSkill('jlsg_fushe_debuff', 'phaseUseAfter');
                    'step 1'
                    // animate appear again
                    player.markSkill("jlsg_fushe_scanning");
                  },
                  ai: {
                    effect: {
                      player: function (card, player, target) {
                        var zhangren = player.storage.jlsg_fushe_source;
                        if (get.damageEffect(player, zhangren, player) > 0) return;
                        if (!player.storage.jlsg_fushe) return;
                        if ((get.suit(card) + '2') != player.storage.jlsg_fushe) return;
                        if (!player.needsToDiscard() && !player.hasSkill('jlsg_fushe_debuff')) {
                          var type = get.type(card);
                          if (type == 'basic') {
                            return [1, -1.5];
                          } else if (type == 'trick' && !get.tag(card, 'damage')) {
                            return [1, -1.5];
                          }
                        }
                      },
                    }
                  },
                },
                debuff: {
                  trigger: { player: 'phaseUseEnd' },
                  forced: true,
                  popup: false,
                  filter: function (event, player) {
                    return player.storage.jlsg_fushe_source && player.storage.jlsg_fushe_source.isAlive();
                  },
                  content: function () {
                    "step 0"
                    var zhangren = jlsg.findPlayerBySkillName('jlsg_fushe');
                    zhangren.logSkill('jlsg_fushe', player);
                    player.damage(zhangren);
                    zhangren.draw();
                    "step 1"
                    player.removeSkill("jlsg_fushe_buff");
                  }
                }
              },
              ai: {
                threaten: function (player, target) {
                  if (target.inRangeOf(player)) {
                    return 2.5;
                  }
                  return 1.3;
                },
              }
            },
            jlsg_ziguo: {
              audio: "ext:极略:2",
              enable: 'phaseUse',
              usable: 1,
              filter: function (event, player) {
                return game.hasPlayer(function (cur) {
                  return cur.isDamaged() && cur != player;
                });
              },
              filterTarget: function (card, player, target) {
                return target.isDamaged();
              },
              content: function () {
                target.draw(2);
                player.addTempSkill('jlsg_ziguo_debuff');
              },
              subSkill: {
                debuff: {
                  mod: {
                    maxHandcard: function (player, num) {
                      return num - 2;
                    }
                  }
                }
              },
              ai: {
                order: 4,
                result: {
                  target: function (player, target) {
                    if (player.getHandcardLimit() <= 2) {
                      if (!player.hasSkill('jlsg_shangdao')) return 0;
                    }
                    var lastedCard = Math.min(player.getHandcardLimit() - 2, 0);
                    var currentLastCard = lastedCard;
                    if (lastedCard + game.countPlayer(function (cur) {
                      if (cur != player && cur.countCards('h') > currentLastCard && !cur.isTurnedOver()) {
                        currentLastCard++;
                        return true;
                      }
                      return false;
                    }) <= (player.maxHp - 2)) return 0;
                    if (get.attitude(player, target) <= 0) return 0;
                    var result = Math.max(5 - target.countCards('h'), 1.1)
                    if (player == target) return Math.max(result - 1, 1);
                    return result;
                  },
                }
              }
            },
            jlsg_shangdao: {
              audio: "ext:极略:2",
              trigger: { global: 'phaseZhunbeiBegin' },
              filter: function (event, player) {
                return event.player.countCards('h') > player.countCards('h');
              },
              forced: true,
              content: function () {
                var card = get.cards();
                player.showCards('商道', card);
                player.gain(card, 'gain2');
              }
            },
            jlsg_hengjiang: {
              audio: "ext:极略:2",
              trigger: { player: 'phaseDiscardBegin' },
              filter: function (event, player) {
                return player.countCards('h') >= player.maxHp;
              },
              check: function (event, player) {
                if (player.getHandcardLimit() - 1 >= player.countCards('h')) return false;
                return true;
              },
              content: function () {
                'step 0'
                player.chooseControl('手牌上限+1', '手牌上限-1').set('ai', function (event, player) {
                  if (jlsg.isWeak(player) && player.getHandcardLimit() < player.countCards('h')) return '手牌上限+1';
                  var friends = jlsg.getFriends(player);
                  var needToThrowJudge = false;
                  for (var i = 0; i < friends.length; i++) {
                    if (friends[i].num('j') && !friends[i].num('j', 'shandian')) {
                      needToThrowJudge = true;
                      break;
                    } else if (friends[i].num('j', 'shandian')) {
                      var rejudge = game.hasPlayer(function (target) {
                        return target.hasSkills(jlsg.ai.skill.rejudge) && jlsg.isEnemy(player, target);
                      });
                      if (rejudge) {
                        needToThrowJudge = true;
                        break;
                      }
                    }
                  }
                  if (needToThrowJudge && !jlsg.isWeak(player)) return '手牌上限-1';
                  var diren = jlsg.getEnemies(player);
                  var needToThrowEquip = false;
                  for (var i = 0; i < diren.length; i++) {
                    if (diren[i].num('e')) {
                      needToThrowEquip = true;
                      break;
                    } else if (diren[i].num('j', 'shandian')) {
                      var rejudge = game.hasPlayer(function (target) {
                        return target.hasSkills(jlsg.ai.skill.rejudge) && jlsg.isEnemy(player, target);
                      });
                      if (rejudge) {
                        needToThrowEquip = true;
                        break;
                      }
                    }
                  }
                  if (needToThrowEquip && !jlsg.isWeak(player)) return '手牌上限-1';
                  return '手牌上限+1';
                });
                'step 1'
                if (result.control == '手牌上限+1') {
                  player.addTempSkill('jlsg_hengjiang_buff', 'phaseAfter');
                } else {
                  player.addTempSkill('jlsg_hengjiang_debuff', 'phaseAfter');
                }
                player.addTempSkill('jlsg_hengjiang_effect', 'phaseAfter');
              },
              subSkill: {
                effect: {
                  audio: false,
                  trigger: { player: 'phaseDiscardEnd' },
                  forced: true,
                  popup: false,
                  filter: function (event) {
                    return event.cards && event.cards.length > 0;
                  },
                  content: function () {
                    'step 0'
                    event.count = trigger.cards.length;
                    'step 1'
                    if (event.count > 0) {
                      player.chooseTarget(get.prompt('jlsg_hengjiang'), function (card, player, target) {
                        return target.countCards('ej');
                      }).set('ai', function (target) {
                        if (jlsg.isFriend(player, target)) {
                          if (target.countCards('j') && !target.countCards('j', 'shandian')) return 8;
                          var rejudge = game.hasPlayer(function (target1) {
                            return target1.hasSkills(jlsg.ai.skill.rejudge) && jlsg.isEnemy(player, target1);
                          });
                          if (target.countCards('j', 'shandian') && rejudge) return 10;
                          return 0;
                        }
                        if (jlsg.isEnemy(player, target)) {
                          var rejudge = game.hasPlayer(function (target1) {
                            return target1.hasSkills(jlsg.ai.skill.rejudge) && jlsg.isEnemy(player, target1);
                          });
                          if (rejudge && target.countCards('j', 'shandian')) return 7;
                          if (target.countCards('e') && !target.hasSkills(jlsg.ai.skill.lose_equip)) return 6;
                          return 0;
                        }
                        return 0;
                      });
                    } else {
                      event.finish();
                    }
                    'step 2'
                    if (result.targets) {
                      var att = get.attitude(player, result.targets[0]);
                      player.line(result.targets[0], 'water');
                      player.discardPlayerCard(result.targets[0], 'ej', [1, event.count], function (button) {
                        if (att > 0) return get.type(button.link) == 'delay';
                        return get.buttonValue(button);
                      });
                    } else {
                      event.finish();
                    }
                    'step 3'
                    if (result.bool) {
                      event.count -= result.links.length;
                    }
                    if (event.count > 0) event.goto(1);

                  }
                },
                buff: {
                  mod: {
                    maxHandcard: function (player, num) {
                      return num + 1;
                    }
                  }
                },
                debuff: {
                  mod: {
                    maxHandcard: function (player, num) {
                      return num - 1;
                    }
                  }
                },
              },
            },
            jlsg_zhuanshan: {
              audio: "ext:极略:2",
              trigger: { player: ['phaseZhunbeiBegin', 'phaseJieshuEnd'] },
              direct: true,
              content: function () {
                'step 0'
                player.chooseTarget(get.prompt('jlsg_zhuanshan')).ai = function (target) {
                  if (target == player) {
                    if (target.countCards('j')) {
                      if (target.countCards('j', 'shandian') == 0) {
                        if (event.triggername == 'phaseZhunbeiBegin') {
                          return 5;
                        } else {
                          if (jlsg.isFriend(target, target.next)) {
                            return 5;
                          }
                          return -5;
                        }
                      } else {
                        var bool = game.hasPlayer(function (target) {
                          return target.hasSkills(jlsg.ai.skill.rejudge);
                        });
                        if (bool) {
                          return 5;
                        }
                        return 0;
                      }
                    } else if (target.hasSkills(jlsg.ai.skill.lose_equip) && target.countCards('e')) {
                      return 5;
                    } else {
                      return -1;
                    }
                  } else {
                    var att = get.attitude(player, target);
                    if (att > 0 && target.countCards('j')) {
                      if (event.triggername == 'phaseZhunbeiBegin') {
                        return 6;
                      } else {
                        if (jlsg.isFriend(player, player.next)) {
                          return 6;
                        }
                        return -1;
                      }
                    } else {
                      if (target.countCards('e')) {
                        return 4;
                      }
                      return -1;
                    }
                    return -1;
                  }
                };
                'step 1'
                if (result.bool) {
                  player.logSkill('jlsg_zhuanshan', event.target);
                  event.target = result.targets[0];
                  event.target.draw();
                  player.choosePlayerCard(event.target, 'hej', true);
                } else {
                  event.finish();
                }
                'step 2'
                event.card = result.links[0];

                event.target.lose(result.cards, ui.cardPile, 'insert');
                game.log(player, '将', (get.position(event.card) == 'h' ? '一张牌' : event.card), '置于牌堆顶');
                event.target.$throw(1, 1000);
              }
            },
            jlsg_zhenlie: {
              audio: "ext:极略:1",
              trigger: { target: 'useCardToTargeted' },
              filter: function (event, player) {
                return event.player != player && event.card && (event.card.name == 'sha' || get.type(event.card, 'trick') == 'trick');
              },
              check: function (event, player) {
                if (event.getParent().excluded.contains(player)) return false;
                if (get.attitude(player, event.player) > 0) {
                  return false;
                }
                if (get.tag(event.card, 'respondSha')) {
                  if (player.countCards('h', { name: 'sha' }) == 0) {
                    return true;
                  }
                } else if (get.tag(event.card, 'respondShan')) {
                  if (player.countCards('h', { name: 'shan' }) == 0) {
                    return true;
                  }
                } else if (get.tag(event.card, 'damage')) {
                  if (player.countCards('h') < 2) return true;
                } else if (event.card.name == 'shunshou' && player.hp > 2) {
                  return true;
                }
                return false;
              },
              priority: 10,
              content: function () {
                "step 0"
                player.loseHp();
                "step 1"
                trigger.getParent().excluded.add(player);
                "step 2"
                if (player.countCards('he')) {
                  player.chooseToDiscard('你可以弃置一张牌，令' + get.translation(trigger.player) + '展示所有手牌并弃置与之花色相同的牌，若不如此做，其失去1点体力', 'he').set('ai', function (card) {
                    if (jlsg.isFriend(player, trigger.player)) return false;
                    if (jlsg.isWeak(player)) return false;
                    if (jlsg.isWeak(trigger.player)) return 10 - get.value(card);
                    return 6 - get.value(card);
                  });
                } else {
                  event.finish();
                }
                "step 3"
                if (result.bool) {
                  if (trigger.player.countCards('h') > 0) {
                    trigger.player.showHandcards();
                    if (trigger.player.countCards('h', { suit: get.suit(result.cards[0]) })) {
                      event.suit1 = get.suit(result.cards[0]);
                      trigger.player.chooseBool('是否弃置所有' + get.translation(get.suit(result.cards[0])) + '花色的手牌，否则失去1点体力').ai = function () {
                        if (jlsg.isWeak(trigger.player)) return true;
                        if (trigger.player.countCards('h', { suit: get.suit(result.cards[0]) }) > 1) return false;
                        return true;
                      };
                    } else {
                      trigger.player.loseHp();
                      event.finish();
                    }
                  } else {
                    event.finish();
                  }
                }
                "step 4"
                if (!result.bool) {
                  trigger.player.loseHp();
                } else {
                  trigger.player.discard(trigger.player.get('h', { suit: event.suit1 }));
                }
              },
              ai: {
                expose: 0.3,

              }
            },
            jlsg_miji: {
              audio: "ext:极略:1",
              trigger: { player: ['phaseZhunbeiBegin', 'phaseJieshuBegin'] },
              filter: function (event, player, name) {
                if (name == 'phaseZhunbeiBegin') {
                  return player.isDamaged();
                }
                if (name == 'phaseJieshuBegin') {
                  return !game.hasPlayer(function (target) {
                    return target.hp < player.hp;
                  });
                }
              },
              frequent: true,
              content: function () {
                'step 0'
                player.chooseControl('basic', 'equip', 'trick').set('ai', function () {
                  var basic = player.countCards('he', 'basic');
                  var equip = player.countCards('he', 'equip');
                  var trick = player.countCards('he', 'trick');
                  var theLess = Math.min(basic, equip, trick);
                  switch (theLess) {
                    case basic:
                      return 'basic';
                    case equip:
                      return 'equip';
                    case trick:
                      return 'trick';
                    default: {
                      if (Math.random() < 0.5) return 'basic';
                      if (Math.random() < 0.5) return 'equip';
                      if (Math.random() < 2 / 3) return 'trick';
                      return 'basic';
                    }
                      ;
                  }
                });
                'step 1'
                var card = jlsg.findCardInCardPile(function (card) {
                  return get.type(card) == result.control;
                });
                if (card) {
                  event.card1 = card;
                  player.showCards('秘计', event.card1);
                  player.chooseTarget('将' + get.translation(card) + '交给一名角色').set('ai', function (target) {
                    var att = get.attitude(_status.event.player, target);
                    if (_status.event.du) return -att;
                    return att;
                  }, true).set('du', card.name == 'du');
                } else {
                  game.log('没有找到该类型卡牌，请重新选择');
                  event.cantSelect = result.control;
                  event.goto(0);
                }
                'step 2'
                result.targets[0].gain(event.card1, 'gain');
              }
            },
            jlsg_yongji: {
              audio: "ext:极略:2",
              trigger: { source: 'damageSource' },
              forced: true,
              filter: function (event, player) {
                var phase = event.getParent('phaseUse');
                return event.card && event.card.name == 'sha' && phase && phase.player == player;
              },
              content: function () {
                var num = Math.min(3, player.getDamagedHp());
                player.draw(num);
                // player.getStat().card.sha--;
                if (!player.hasSkill('jlsg_yongjiBuff')) {
                  player.storage.jlsg_yongjiBuff = 1;
                  player.addTempSkill('jlsg_yongjiBuff'); // 'phaseUseAfter'
                } else {
                  ++player.storage.jlsg_yongjiBuff;
                }
              }
            },
            jlsg_yongjiBuff: {
              // audio: "ext:极略:1",
              // trigger:{player:'useCard1'},
              // forced:true,
              // filter:function(event,player){
              //   return !event.audioed&&event.card.name=='sha'&&player.countUsed('sha',true)>1&&player.storage.jlsg_yongjiBuff;
              // },
              // content:function(){
              //   trigger.audioed=true;
              // },
              mod: {
                cardUsable: function (card, player, num) {
                  if (card.name == 'sha' && player.storage.jlsg_yongjiBuff) {
                    return num + player.storage.jlsg_yongjiBuff;
                  }
                }
              },
            },
            jlsg_wuzhi: {
              audio: "ext:极略:1",
              forced: true,
              trigger: { player: 'phaseDiscardEnd' },
              filter: function (event, player) {
                let shaFulfilled = () => {
                  var shaTemplate = { name: 'sha', iscard: true };
                  var num = lib.card['sha'].usable;
                  if (!num) return true;
                  num = game.checkMod(shaTemplate, player, num, 'cardUsable', player);
                  var numUsed = player.getHistory('useCard', event => get.name(event.card) == 'sha'
                  ).length;
                  return !num || num <= numUsed;
                };
                return !shaFulfilled();
              },
              content: function () {
                'step 0'
                player.loseHp(1);
                'step 1'
                var card = get.cardPile2('sha');
                if (card) player.gain(card, 'gain2', 'log');
              }
            },
            // 真有你的啊 用别人的字做技能名
            jlsg_yidu: {
              audio: "ext:极略:2",
              trigger: {
                player: 'loseAfter',
                global: ['equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter'],
              },
              usable: 1,
              // frequent: true,
              filter: function (event, player) {
                var currPlayer = _status.currentPhase;
                if (!currPlayer || currPlayer == player || !currPlayer.countCards('h')) return false;
                var evt = event.getl(player);
                return evt && evt.hs && evt.hs.length > 0;
              },
              check(event, player) {
                return true;
              },
              content: function () {
                var suits = trigger.getl(player).hs.map(card => get.suit(card));
                var num = _status.currentPhase.countCards('h',
                  (card) => suits.contains(get.suit(card))
                );
                player.draw(num);
              },
              ai: {
                threaten: 0.5,
                effect: {
                  target: function (card, player, target, result2, islink) {
                    if (_status.currentPhase == target) return;
                    if (card.name == 'guohe' || card.name == 'liuxinghuoyu') return 1 - 0.1 * _status.currentPhase.countCards('h');
                  }
                },
                noh: true,
                skillTagFilter: function (player, tag) {
                  if (tag == 'noh') {
                    if (_status.currentPhase == player) return false;
                    return _status.currentPhase.countCards('h') > 4;
                  }
                }
              }
            },
            jlsg_zhubao: {
              group: 'jlsg_zhubao_phase',
              audio: "ext:极略:1",
              direct: true,
              trigger: {
                global: ['loseAfter', 'equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter'],
              },
              filter: function (event, player) {
                if (_status.currentPhase != player || !player.countCards('h')) return false;
                if (!player.storage.jlsg_zhubao) {
                  player.storage.jlsg_zhubao = [];
                }
                return game.hasPlayer(p => {
                  if (p == player) return false;
                  if (player.storage.jlsg_zhubao.contains(p)) return false;
                  var evt = event.getl(p);
                  return evt && evt.hs && evt.hs.length > 0;
                });
              },
              direct: true,
              content: function () {
                'step 0'
                if (!player.storage.jlsg_zhubao) {
                  player.storage.jlsg_zhubao = [];
                }
                event.suitMap = [];
                game.filterPlayer(p => p != player && !player.storage.jlsg_zhubao.contains(p)).forEach(p => {
                  var evt = trigger.getl(p);
                  if (evt && evt.hs) {
                    var suits = [...new Set(evt.hs.map(card => get.suit(card)))];
                    event.suitMap.push([p, suits]);
                  }
                });
                'step 1'
                if (!event.suitMap.length) {
                  event.finish();
                  return;
                }
                [event.target, event.suits] = event.suitMap.shift();
                event.num = player.countCards('h',
                  (card) => event.suits.contains(get.suit(card))
                );
                if (event.num == 0) {
                  event.redo();
                  return;
                }
                var prompt = `###${get.prompt(event.name, event.target)}###你可以摸${get.cnNumber(event.num)}张牌`;
                player.chooseBool(prompt);
                'step 2'
                if (result.bool) {
                  player.storage.jlsg_zhubao.push(event.target);
                  player.logSkill(event.name, event.target);
                  var num = player.countCards('h',
                    (card) => event.suits.contains(get.suit(card))
                  );
                  player.draw(event.num);
                }
                event.goto(1);
              },
              contentx: function () {
                if (!player.storage.jlsg_zhubao) {
                  player.storage.jlsg_zhubao = [];
                }
                var suits = [];
                game.filterPlayer(p => p != player).forEach(p => {
                  var evt = trigger.getl(p);
                  if (evt && evt.hs) {
                    suits.addArray(evt.hs.map(card => get.suit(card)));
                  }
                });
                var num = player.countCards('h',
                  (card) => suits.contains(get.suit(card))
                );
                if (num > 10) num = 10;
                player.draw(num);
              },
              subSkill: {
                phase: {
                  silent: true,
                  forced: true,
                  trigger: { player: 'phaseBegin' },
                  content: function () {
                    player.storage.jlsg_zhubao = [];
                  },
                },
              },
            },
            jlsg_buqu: {
              audio: "ext:极略:2",
              inherit: 'buqu',
            },
            jlsg_fenji: {
              audio: "ext:极略:1",
              trigger: {
                global: 'shaBegin',
              },
              filter: function (event, player) {
                return event.card.name == 'sha';
              },
              logTarget: 'target',
              check: function (event, player) {
                return get.attitude(player, event.target) > 2;
              },
              content: function () {
                'step 0'
                player.loseHp();
                'step 1'
                trigger.target.draw(2);
              }
            },
            jlsg_jiaomei: {
              audio: "ext:极略:1",
              usable: 1,
              trigger: {
                player: 'useCardToPlayered',
              },
              logTarget: 'target',
              filter: function (event, player) {
                // if (event.target == player) return false;
                if (!player.isPhaseUsing()) return false;
                return get.type(event.card) == 'trick' || event.card.name == 'sha';
              },
              check: function (event, player) {
                if (event.card.name == 'tiesuo') return false;
                var target = event.target;
                var effect = 0.5 * get.effect(target, { name: 'tiesuo' }, player, player);
                if (player.hasSkill('jlsg_huoshui')) {
                  effect += (target.isLinked() ? -0.8 : 0.8) *
                    get.effect(target, { name: 'shunshou' }, player, player);
                  effect += (target.isLinked() ? 1 : 0.2) *
                    get.damageEffect(target, player, player);
                }
                if (target.isLinked() && !target.hasSkillTag('noturn')) {
                  effect += get.attitude(player, target) * (
                    target.isTurnedOver() ? 8 : -8
                  );
                }
                return effect > 0;
              },
              prompt2: function (event, player) {
                return `令${get.translation(event.target)}${event.target.isLinked() ? '重置并翻面' : '横置'}`;
              },
              content: function () {
                if (trigger.target.isLinked()) {
                  trigger.target.link();
                  trigger.target.turnOver();
                } else {
                  trigger.target.link();
                }
              },
            },
            jlsg_huoshui: {
              audio: "ext:极略:1",
              trigger: {
                player: 'phaseJieshuBegin',
              },
              filter: function (event, player) {
                return game.hasPlayer(p => p != player && (p.isTurnedOver() || p.isLinked()));
              },
              check: function (event, player) {
                var effect = 0;
                for (var p of game.filterPlayer(p => p != player)) {
                  if (p.isLinked()) {
                    effect += get.effect(p, { name: 'shunshou' }, player, player);
                  }
                  if (p.isTurnedOver()) {
                    effect += get.damageEffect(p, player, player);
                  }
                }
                return effect > 0;
              },
              content: function () {
                'step 0'
                event.targets = game.filterPlayer(p => p.isLinked());
                player.line(event.targets, 'green');
                'step 1'
                if (event.targets.length == 0) {
                  event.goto(2);
                  return;
                }
                event.target = event.targets.shift();
                if (event.target.countGainableCards(player, 'he') != 0) {
                  player.gainPlayerCard(event.target, true);
                }
                event.redo();
                'step 2'
                event.targets = game.filterPlayer(p => p.isTurnedOver());
                player.line(event.targets, 'green');
                'step 3'
                if (event.targets.length == 0) {
                  event.finish();
                  return;
                }
                event.target = event.targets.shift();
                event.target.damage(player);
                event.redo();
              },
            },
            jlsg_hubu: {
              audio: "ext:极略:1",
              trigger: { player: 'damageEnd', source: 'damageEnd' },
              filter: function (event) {
                return event.card && event.card.name == 'sha'; // && event.notLink();
              },
              direct: true,
              content: function () {
                'step 0'
                player.chooseTarget(get.prompt(event.name), function (card, player, target) {
                  return player != target && player.canUse('juedou', target);
                }).ai = function (target) {
                  return get.effect(target, { name: 'juedou' }, player, target);
                }
                'step 1'
                if (result.bool) {
                  event.target = result.targets[0];
                  player.logSkill(event.name, event.target);
                  event.target.judge(function (card) {
                    if (get.suit(card) == 'spade') return 1;
                    return -0.5;
                  }).judge2 = result => !result.bool;
                }
                else {
                  event.finish();
                }
                'step 2'
                if (!result.bool) {
                  player.useCard({ name: 'juedou' }, event.target, 'nowuxie');
                }
                else {
                  event.finish();
                }
              }
            },
            jlsg_yuhua: {
              audio: "ext:极略:2",
              trigger: { source: 'damageBegin2', player: 'damageBegin4' },
              intro: {
                content: '已发动过#次',
              },
              filter: function (event, player) {
                return event.card && get.type(event.card, 'trick') == 'trick';
              },
              logTarget: function (event, player) {
                return player == event.player ? event.source : event.player;
              },
              check: function (event, player) {
                _status.jlsg_yuhua_judging = true;
                if (player == event.player) {
                  return true;
                }
                if (get.attitude(player, event.player) > 0) return true;
                if (get.damageEffect(event.player, player, player, event.nature) <= 0) return true;
                delete _status.jlsg_yuhua_judging;
                return false;
              },
              content: function () {
                'step 0'
                trigger.cancel();
                player.draw();
                'step 1'
                player.storage.jlsg_yuhua = player.storage.jlsg_yuhua || 0;
                ++player.storage.jlsg_yuhua;
                player.markSkill('jlsg_yuhua');
              },
              mod: {
                maxHandcard: function (player, num) {
                  if (player.storage.jlsg_yuhua) {
                    return num - player.storage.jlsg_yuhua;
                  }
                }
              },
              ai: {
                notrick: true,
                notricksource: true,
                skillTagFilter(player, tag, arg) {
                  if (tag == 'notrick') return true;
                  return !!((get.attitude(player, _status.event.player) >= 0) ^ (Math.random() > 0.8));
                },
              },
            },
            jlsg_dengxian: {
              audio: "ext:极略:2",
              skillAnimation: true,
              animationColor: 'orange',
              unique: true,
              juexingji: true,
              trigger: { player: 'phaseZhunbeiBegin' },
              forced: true,
              filter: function (event, player) {
                return player.getHandcardLimit() == 0;
              },
              content: function () {
                'step 0'
                player.awakenSkill('jlsg_dengxian');
                // player.storage.jlsg_dengxian = true;
                'step 1'
                player.addSkill('jlsg_dengxian2');
                player.markSkill('jlsg_dengxian');
                player.chooseControl('额外摸牌阶段', '额外出牌阶段', [0, 1].randomGet())
                  .set('prompt', `###请选择一项###${lib.translate.jlsg_dengxian_info}`)
                'step 2'
                if (result.index === 0) {
                  game.log(player, '选择替换为摸牌阶段');
                } else {
                  game.log(player, '选择替换为出牌阶段');
                }
                player.storage.jlsg_dengxian = result.index;
              },
              intro: {
                nocount: true,
                content(content, player, skill) {
                  var str = '跳过弃牌阶段';
                  if (content === 0) {
                    str += ',并替换为摸牌阶段';
                  }
                  else if (content === 1) {
                    str += ',并替换为出牌阶段';
                  }
                  return str;
                },
              },
            },
            jlsg_dengxian2: {
              audio: 'jlsg_dengxian',
              unique: true,
              forced: true,
              trigger: { player: 'phaseDiscardBefore' },
              content: function () {
                trigger.cancel();
                var phase = ['phaseDraw', 'phaseUse'][player.storage.jlsg_dengxian];
                if (!phase) return;
                var next = player[phase]();
                event.next.remove(next);
                trigger.getParent().next.push(next);
              },
            },
            jlsg_tiance: {
              audio: "ext:极略:2",
              trigger: { player: 'phaseZhunbeiBegin' },
              direct: true,
              content: function () {
                'step 0'
                if (event.target) return;
                player.chooseTarget(get.prompt2('jlsg_tiance'));
                'step 1'
                if (!event.target) {
                  if (!result.bool) {
                    event.finish();
                    return;
                  }
                  event.target = result.targets[0];
                  player.logSkill('jlsg_tiance', result.targets[0]);
                }
                event.target.judge();
                'step 2'
                event.result = result;
                if (!result.suit) return;
                player.chooseControl('牌堆', '弃牌堆', '角色').set('ai', function () {
                  return Math.floor(Math.random() * 3);
                }).set('prompt', `请选择${get.translation(event.target)}获得牌的区域`);
                'step 3'
                game.log(player, '选择了', result.control);
                if (result.control == '弃牌堆') {
                  var validCards = Array.from(ui.discardPile.childNodes).filter(c => c.suit === event.result.suit);
                  if (validCards.length) {
                    var cards = validCards.randomGets(2);
                    event.target.gain(cards, 'gain2');
                  }
                }
                else if (result.control == '角色') {
                  var target = game.filterPlayer(
                    p => p != event.target && p.countCards('he', c => get.suit(c) == event.result.suit)
                  ).randomGet();
                  if (target) {
                    var cards = target.getCards('he', c => get.suit(c) == event.result.suit).randomGets(2);
                    event.target.gain(target, cards, 'give');
                  }
                } else {
                  var validCards = Array.from(ui.cardPile.childNodes).filter(c => c.suit === event.result.suit);
                  if (validCards.length) {
                    var cards = validCards.randomGets(2);
                    event.target.gain(cards, 'gain2');
                  }
                }
              }
            },
            jlsg_jiexin: {
              audio: "ext:极略:2",
              trigger: { player: 'damageEnd' },
              direct: true,
              content: function () {
                'step 0'
                player.chooseTarget(get.prompt2(event.name));
                'step 1'
                if (!result.bool) {
                  event.finish();
                  return;
                }
                var target = result.targets[0];
                player.logSkill(event.name, target);
                var next = game.createEvent('jlsg_jiexin_tiance');
                next.player = player;
                next.target = target;
                next.setContent(lib.skill.jlsg_tiance.content);
                'step 2'
                if (result.color && trigger.card && result.color === get.color(trigger.card)) {
                  player.chooseTarget('是否再次发动【天策】？');
                } else {
                  event.finish();
                }
                'step 3'
                if (!result.bool) {
                  event.finish();
                  return;
                }
                var target = result.targets[0];
                // player.logSkill(event.name, target);
                var next = game.createEvent('jlsg_jiexin_tiance');
                next.player = player;
                next.target = target;
                next.setContent(lib.skill.jlsg_tiance.content);
              },
              ai: {
                maixie: true,
                maixie_hp: true,
                effect: {
                  target: function (card, player, target) {
                    if (get.tag(card, 'damage')) {
                      if (player.hasSkillTag('jueqing', false, target)) return [1, -2];
                      if (!target.hasFriend()) return;
                      if (target.hp >= 4) return [1, get.tag(card, 'damage') * 1.5];
                      if (target.hp == 3) return [1, get.tag(card, 'damage') * 1];
                      if (target.hp == 2) return [1, get.tag(card, 'damage') * 0.5];
                    }
                  }
                }
              }
            },
            jlsg_zhengnan: { // 征南
              audio: "ext:极略:2",
              enable: "phaseUse",
              usable: 1,
              filterTarget: function (card, player, target) {
                return target.countCards('he');
              },
              content: function () {
                'step 0'
                player.discardPlayerCard(target, 'hej', forced).set('ai', (button, buttons) => {
                  var target = _status.event.getParent().target;
                  var val = get.buttonValue(button); // get.effect(target, {name: 'nanman'}, get.owner(buttons.randomGet().link), _status.event.player) 
                  if (get.attitude(_status.event.player, get.owner(button.link)) > 0) val = -val;
                  if (button.name && get.type(button.link) != 'basic') val += 6;
                  return val;
                })
                'step 1'
                if (!result.bool || get.type(result.links[0]) == 'basic') {
                  event.finish();
                  return;
                }
                target.chooseUseTarget({ name: 'nanman' }, true).set('oncard', (card, player) => {
                  _status.event.skill = 'jlsg_zhengnan';
                });
              },
              group: "jlsg_zhengnan2",
              ai: {
                result: {
                  target: function (player, target) {
                    var ratio = target.countCards('hej', c => get.type(c) != 'basic') / target.countCards('hej');
                    if (get.attitude(player, target) < 0) return 1 - ratio;
                    return ratio;
                  },
                  player: 1,
                },
                order: function (item, player) {
                  return get.order({ name: 'nanman' }, player) + 0.5;
                },
                threaten: 0.5,
              },
            },
            jlsg_zhengnan2: {
              audio: "jlsg_zhengnan",
              frequent: true,
              trigger: { global: 'damageEnd' },
              filter: function (event, player) {
                var evt = event.getParent('useCard');
                return event.card && event.card.name == 'nanman' && evt && evt.skill === 'jlsg_zhengnan';
              },
              content: function () {
                player.draw();
              },
            },
            jlsg_tongxin: {
              audio: false,
              unique: true,
              limited: true,
              enable: 'chooseToUse',
              filter: function (event, player) {
                return event.type == 'dying' && event.dying === player;
              },
              precontent: function () {
                var audioS = 'jlsg_tongxin_';
                if ([player.name, player.name1, player.name2].contains("jlsgsk_baosanniang")) {
                  audioS += 'f';
                }
                else if ([player.name, player.name1, player.name2].contains("jlsgsk_guansuo")) {
                  audioS += 'm';
                }
                else if ('mf'.includes(player.sex[0])) {
                  audioS += player.sex[0];
                } else {
                  audioS += ['m', 'f'].randomGet();
                }
                game.trySkillAudio(audioS, player);
              },
              content: function () {
                'step 0'
                player.awakenSkill(event.name);
                'step 1'
                var num = 2 - player.hp;
                if (num > 0) player.recover(num);
                'step 2'
                var list = [
                  'jlsgsk_guansuo',
                  'jlsgsk_baosanniang',
                ]
                var players = game.players.concat(game.dead);
                for (var i = 0; i < players.length; i++) {
                  [
                    players[i].name,
                    players[i].name1,
                    players[i].name2,
                  ].forEach(n => {
                    if (n && n.endsWith('guansuo')) list.remove('jlsgsk_guansuo');
                    if (n && n.endsWith('baosanniang')) list.remove('jlsgsk_baosanniang');
                  })
                }
                if (!list.length) {
                  event.finish();
                  return;
                }
                player.chooseButton().set('ai', function (button) {
                  return Math.random();
                }).set('createDialog', ['是否替换武将牌？', [list, 'character']]);
                'step 3'
                if (result.bool) {
                  var name = player.name;
                  if (player.name2) {
                    if (!lib.character[player.name][3].contains(event.name)) {
                      if (lib.character[player.name2][3].contains(event.name)) {
                        name = player.name2;
                      }
                    }
                  }
                  player.reinit(name, result.links[0]);
                }
              },
              ai: {
                skillTagFilter: function (player) {
                  if (!_status.event.dying || _status.event.dying != player || player.storage.jlsg_tongxin) return false;
                },
                save: true,
                order: 6,
                result: {
                  player: 1
                },
              },
            },
            jlsg_tongxin_f: {
              audio: "ext:极略:2",
            },
            jlsg_tongxin_m: {
              audio: "ext:极略:2",
            },
            jlsg_jianwu: {
              audio: "ext:极略:2",
              trigger: { player: 'useCard' },
              forced: true,
              silent: true,
              filter: function (event, player) {
                return get.type(event.card) == 'basic';
              },
              content: function () {
                player.addSkill('jlsg_jianwu2');
              },
            },
            jlsg_jianwu2: {
              trigger: { player: 'useCard1' },
              // audio: "jlsg_jianwu",
              direct: true,
              firstDo: true,
              charlotte: true,
              content: function () {
                player.removeSkill('jlsg_jianwu2');
                if (trigger.card.name == 'sha') {
                  player.logSkill('jlsg_jianwu');
                }
                if (get.type(trigger.card) != 'basic') {
                  player.removeSkill('jlsg_jianwu2');
                }
              },
              mod: {
                cardUsable: function (card) {
                  if (card.name == 'sha') return Infinity;
                },
                targetInRange: function (card) {
                  if (card.name == 'sha') return true;
                },
                selectTarget: function (card, player, range) {
                  if (card.name != 'sha') return;
                  if (range[1] == -1) return;
                  range[1] += 1;
                }
              },
              mark: true,
              intro: {
                content: '使用【杀】无距离和次数限制且目标上限+1',
              },
            },
            jlsg_zhennan: { // 镇南
              audio: "ext:极略:2",
              usable: 1,
              trigger: { global: 'useCardToTargeted' },
              filter: function (event, player) {
                return event.isFirstTarget && (event.card.name == 'sha' || get.type(event.card) == 'trick') &&
                  event.targets.length > 1;
              },
              direct: true,
              content: function () {
                'step 0'
                var targets = trigger.targets;
                var choice, effect = 0;
                for (target of targets) {
                  var thisEffect = get.damageEffect(target, player, player);
                  if (thisEffect > effect) {
                    choice = target;
                    effect = thisEffect;
                  }
                }
                player.chooseTarget(get.prompt2(event.name)).set('filterTarget', function (card, player, target) {
                  return _status.event.targets.contains(target);
                }).set('ai', function (target) {
                  return target == _status.event.choice ? 1 : -1;
                }).set('targets', targets).set('choice', choice);
                'step 1'
                if (result.bool) {
                  player.logSkill(event.name, result.targets[0]);
                  result.targets[0].damage();
                }
              }
            },
            jlsg_shemi: {
              audio: "ext:极略:2",
              trigger: { player: 'chooseToDiscardBegin' },
              direct: true,
              intro: {
                content: function (content, player, skill) {
                  var str = "弃牌阶段记录弃牌数：" + content;
                  if (player.storage.jlsg_shemi_draw) {
                    str = `摸牌阶段额外摸${get.cnNumber(player.storage.jlsg_shemi_draw)}张牌 <br>` + str;
                  }
                  return str;
                },
                markcount: function (storage, player) {
                  return player.storage.jlsg_shemi_draw || 0;
                }
              },
              filter: function (event, player) {
                return event.getParent().name == 'phaseDiscard' && event.selectCard;
              },
              content: function () {
                trigger.selectCard[1] = Infinity;
                if (player.countMark("jlsg_shemi") == trigger.selectCard[0]) { // buff ai
                  var cards = player.getDiscardableCards(player, 'h');
                  if (cards.length > trigger.selectCard[0]) {
                    var card = cards.map((c, i) => [trigger.ai(c), i])
                      .sort((pair1, pair2) => pair1[0] - pair2[0])[1];
                    trigger.set('card', cards[card])
                      .set('ai', function (card) {
                        return (card === _status.event.card ? 5 : 0) - get.useful(card);
                      });
                  }
                }
              },
              subSkill: {
                draw: {
                  audio: "jlsg_shemi",
                  trigger: { player: 'phaseDrawBegin2' },
                  forced: true,
                  charlotte: true,
                  filter: function (event, player) {
                    return !event.numFixed && player.countMark('jlsg_shemi_draw');
                  },
                  content: function () {
                    trigger.num += player.countMark('jlsg_shemi_draw');
                  },
                },
                record: { // to avoid disable
                  trigger: {
                    player: 'phaseDiscardAfter',
                  },
                  charlotte: true,
                  silent: true,
                  init: function (player) {
                    player.storage["jlsg_shemi"] = 0;
                  },
                  content: function () {
                    var cntC = 0;
                    player.getHistory('lose', function (evt) {
                      if (evt && evt.type == 'discard' && evt.getParent('phaseDiscard') == trigger && evt.hs) {
                        cntC += evt.hs.length;
                      }
                    });
                    player.storage["jlsg_shemi"] = cntC;
                    player.markSkill("jlsg_shemi");
                  },
                },
                force: {
                  trigger: {
                    player: 'phaseDiscardEnd',
                  },
                  firstDo: true,
                  direct: true,
                  filter: function (event, player) {
                    return !event.cards;
                  },
                  content: function () {
                    'step 0'
                    var evt = player.chooseToDiscard([1, Infinity], `###${get.prompt(event.name)}###你可以多弃置任意张牌`);
                    if (player.countMark("jlsg_shemi") == 0) {
                      var cards = player.getDiscardableCards(player, 'h');
                      if (cards.length) {
                        var card = cards.map((c, i) => [get.useful(c), i])
                          .reduce((pair1, pair2) => pair1[0] < pair2[0] ? pair1 : pair2)[1];
                        evt.set('card', cards[card])
                          .set('ai', function (card) {
                            return (card === _status.event.card ? 5 : 0) - get.useful(card);
                          });
                      }
                    }
                    'step 1'
                    if (result.bool) {
                      trigger.cards = result.cards;
                    }
                  },
                }
              },
              group: ["jlsg_shemi2", "jlsg_shemi_draw", "jlsg_shemi_record", "jlsg_shemi_force"],
            },
            jlsg_shemi2: {
              audio: "jlsg_shemi",
              trigger: {
                player: 'phaseDiscardEnd',
              },
              forced: true,
              filter: function (event, player) {
                var cntC = 0;
                player.getHistory('lose', function (evt) {
                  if (evt && evt.type == 'discard' && evt.getParent('phaseDiscard') == event && evt.hs) {
                    cntC += evt.hs.length;
                  }
                });
                return cntC > player.countMark("jlsg_shemi");
              },
              content: function () {
                player.storage.jlsg_shemi_draw = player.storage.jlsg_shemi_draw || 0;
                player.storage.jlsg_shemi_draw += 1;
                if (player.isHealthy()) {
                  player.gainMaxHp();
                }
              },
              ai: {
                threaten:1,
              },
            },
            jlsg_jiaohui: {
              audio: "ext:极略:2",
              trigger: { player: 'damageBegin2' },
              frequent: true,
              direct: true,
              content: function () {
                'step 0'
                if (player.countDiscardableCards(player, 'he')) {
                  var next = player.chooseToDiscard(get.prompt2(event.name)).set('logSkill', event.name);
                  if (player.countCards('h') - 1 === player.hp) {
                    next.set('ai', function (card) {
                      return _status.event.gain - get.value(card);
                    }).set('gain', -get.damageEffect(player, trigger.source, player, trigger.nature) / 1.5);
                  }
                }
                'step 1'
                if (result.bool) {
                  event.goto(3);
                } else {
                  player.chooseBool("###是否摸一张牌?###" + get.skillInfoTranslation(event.name)).set('frequentSkill', event.name);
                }
                'step 2'
                if (result.bool) {
                  player.logSkill(event.name);
                  player.draw();
                } else {
                  event.finish();
                }
                'step 3'
                if (player.countCards('h') === player.hp) {
                  --trigger.num;
                }
              },
              ai: {
                maixie: true,
                maixie_defend: true,
              },
            },
            jlsg_wengua: {
              global: 'jlsg_wengua2',
              audio: "ext:极略:2",
            },
            jlsg_wengua2: {
              sub: true,
              trigger: { player: "phaseZhunbeiBegin" },
              filter: function (event, player) {
                return game.hasPlayer(c => c.hasSkill('jlsg_wengua'));
              },
              unique: true,
              direct: true,
              content: function () {
                'step 0'
                var list = game.filterPlayer(function (current) {
                  return current.hasSkill('jlsg_wengua');
                });
                if (list.length == 1 && list[0] == player) {
                  event.target = player;
                  event.goto(2);
                  return;
                }
                player.chooseCardTarget({
                  prompt2: '交给' + get.translation(list) + '一张牌',
                  prompt: get.prompt(event.name),
                  filterCard: true,
                  position: 'he',
                  filterTarget: function (card, player, target) {
                    return _status.event.list.contains(target);
                  },
                  list: list,
                  selectTarget: list.length > 1 ? 1 : -1,
                  goon: function () {
                    for (var i of list) {
                      if (get.attitude(player, i) > 0) return 1;
                      return -1;
                    }
                  }(),
                  ai1: function (card) {
                    if (_status.event.goon > 0) return 7 - get.value(card);
                    return 0.01 - get.value(card);
                  },
                  ai2: function (target) {
                    var card = ui.selected.cards[0];
                    var black = get.color(card) == 'black' ? 3 : 0;
                    if (!target.hasSkill('jlsg_fuzhu')) black = 0;
                    return (black + get.value(card, target)) * get.attitude(_status.event.player, target);
                  },
                });
                'step 1'
                if (result.bool && result.cards.length && result.targets.length) {
                  var target = result.targets[0];
                  event.target = target;
                  player.logSkill('jlsg_wengua', target);
                  player.line(target, 'green');
                  target.gain(result.cards, player, 'giveAuto');
                } else {
                  event.finish();
                }
                'step 2'
                var prompt2 = `将一张牌置于牌堆底，然后${event.target == player ? '' : `和${get.translation(player)}`}摸一张牌`;
                event.target.chooseCard(`###${get.prompt('jlsg_wengua')}###${prompt2}`, 'he').set('ai', function (card) {
                  var value = -get.value(card);
                  if (get.attitude(_status.event.player, _status.event.target) > 0) {
                    value += 8;
                  }
                  if (_status.event.player.hasSkill('jlsg_fuzhu')) {
                    value += get.color(card) == 'black' ? 3 : -1;
                  }
                }).set('target', player);
                'step 3'
                if (result.bool) {
                  if (player == event.target) {
                    player.logSkill('jlsg_wengua');
                  }
                  var next = event.target.lose(result.cards, ui.cardPile);
                  game.log(event.target, '将一张牌置于牌堆底');
                  game.broadcastAll(function (player) {
                    var cardx = ui.create.card();
                    cardx.classList.add('infohidden');
                    cardx.classList.add('infoflip');
                    player.$throw(cardx, 1000, 'nobroadcast');
                  }, event.target);
                } else {
                  event.finish();
                }
                'step 4'
                game.delayx();
                'step 5'
                if (player == event.target) {
                  player.draw();
                }
                else {
                  game.asyncDraw([player, target], null, null);
                }
              },
            },
            jlsg_fuzhu: {
              audio: "ext:极略:2",
              enable: 'phaseUse',
              limited: true,
              skillAnimation: true,
              animationColor: 'wood',
              filterTarget: function (card, player, target) {
                return player != target;
              },
              content: function () {
                'step 0'
                player.awakenSkill(event.name);
                'step 1'
                if (!ui.cardPile.lastChild) {
                  event.finish();
                }
                player.showCards(ui.cardPile.lastChild);
                'step 2'
                var card = ui.cardPile.lastChild;
                if (get.color(card) == 'black') {
                  card.remove();
                  game.updateRoundNumber();
                  player.useCard({
                    name: 'sha',
                    cards: [card],
                  }, target, false);
                  event.goto(1);
                }
              },
              result: {
                target: function (player, target) {
                  return -game.roundNumber;
                }
              },
            },
          },
          translate: {
            jlsg_sk: "SK武将",
            jlsg_tiangang: "天罡包",
            jlsg_disha: "地煞包",
            jlsg_renjie: "人杰包",
            jlsg_pojun: "破军包",
            jlsg_yinyang: "阴阳包",
            jlsg_tanlang: "贪狼包",
            jlsg_jiangxing: "将星包",
            jlsg_sp: "特别包",
            jlsgsk_dengzhi: 'SK邓芝',
            jlsgsk_xuyou: 'SK许攸',
            jlsgsk_zhangbu: 'SK张布',
            jlsgsk_miheng: 'SK祢衡',
            jlsgsk_zumao: 'SK祖茂',
            jlsgsk_huaxiong: 'SK华雄',
            jlsgsk_sunce: 'SK孙策',
            jlsgsk_caoren: 'SK曹仁',
            jlsgsk_gongsunzan: 'SK公孙瓒',
            jlsgsk_sunqian: 'SK孙乾',
            jlsgsk_maliang: 'SK马良',
            jlsgsk_buzhi: 'SK步骘',
            jlsgsk_wangping: 'SK王平',
            jlsgsk_huangyueying: 'SK黄月英',
            jlsgsk_dongzhuo: 'SK董卓',
            jlsgsk_chendao: 'SK陈到',
            jlsgsk_dingfeng: 'SK丁奉',
            jlsgsk_wenchou: 'SK文丑',
            jlsgsk_yanliang: 'SK颜良',
            jlsgsk_zhuran: 'SK朱然',
            jlsgsk_lukang: 'SK陆抗',
            jlsgsk_lvlingqi: 'SK吕玲绮',
            jlsgsk_zhoucang: 'SK周仓',
            jlsgsk_kongrong: 'SK孔融',
            jlsgsk_caochong: 'SK曹冲',
            jlsgsk_zhanglu: 'SK张鲁',
            jlsgsk_guanlu: 'SK管辂',
            jlsgsk_simazhao: 'SK司马昭',
            jlsgsk_yangxiu: 'SK杨修',
            jlsgsk_liyan: 'SK李严',
            jlsgsk_jiping: 'SK吉平',
            jlsgsk_sunhao: 'SK孙皓',
            jlsgsk_zhugejin: 'SK诸葛瑾',
            jlsgsk_zhangxiu: 'SK张绣',
            jlsgsk_sunluyu: 'SK孙鲁育',
            jlsgsk_zuoci: 'SK左慈',
            jlsgsk_luzhi: 'SK卢植',
            jlsgsk_zhangning: 'SK张宁',
            jlsgsk_yuji: 'SK于吉',
            jlsgsk_mifuren: 'SK糜夫人',
            jlsgsk_guonvwang: 'SK郭女王',
            jlsgsk_chengyu: 'SK程昱',
            jlsgsk_zhangren: 'SK张任',
            jlsgsk_mizhu: 'SK糜竺',
            jlsgsk_zangba: 'SK臧霸',
            jlsgsk_hejin: 'SK何进',
            jlsgsk_wangyi: 'SK王异',
            jlsgsk_guanyu: '☆SK关羽',
            jlsgsk_machao: 'SP马超',
            jlsgsk_caiwenji: 'SP蔡文姬',
            jlsgsk_zhangbao: 'SK张宝',
            jlsgsk_guanxing: 'SK关兴',
            jlsgsk_kuaiyue: 'SK蒯越',
            jlsgsk_zhoutai: 'SK周泰',
            jlsgsk_zoushi: 'SK邹氏',
            jlsgsk_zhugeguo: 'SK诸葛果',
            jlsgsk_xizhicai: 'SK戏志才',
            jlsgsk_guansuo: 'SK关索',
            jlsgsk_baosanniang: 'SK鲍三娘',
            jlsgsk_dongbai: 'SK董白',
            jlsgsk_xushi: 'SK徐氏',

            jlsg_hemeng: '和盟',
            jlsg_sujian: '素检',
            jlsg_yexi: '夜袭',
            jlsg_kuangyan: '狂言',
            jlsg_kuangyan1: '狂言',
            jlsg_kuangyan2: '狂言',
            jlsg_chaochen: '朝臣',
            jlsg_chaochen2: '朝臣',
            jlsg_quanzheng: '全政',
            jlsg_shejian: '舌剑',
            jlsg_kuangao: '狂傲',
            jlsg_yinbing: '引兵',
            jlsg_yinbing2: '引兵',
            jlsg_fenwei: '奋威',
            jlsg_shiyong: '恃勇',
            jlsg_angyang: '昂扬',
            jlsg_angyang2: '昂扬',
            jlsg_weifeng: '威风',
            jlsg_xieli: '协力',
            jlsg_jushou: '据守',
            jlsg_yicong: '义从',
            jlsg_muma: '募马',
            jlsg_suiji: '随骥',
            jlsg_fengyi: '凤仪',
            jlsg_yalv: '雅虑',
            jlsg_xiemu: '协穆',
            jlsg_xiemu2: '协穆',
            jlsg_zhejie: '折节',
            jlsg_fengya: '风雅',
            jlsg_yijian: '义谏',
            jlsg_feijun: '飞军',
            jlsg_muniu: '木牛',
            jlsg_muniu2: '木牛',
            jlsg_liuma: '流马',
            jlsg_baozheng: '暴征',
            jlsg_lingnu: '凌怒',
            jlsg_zhongyong: '忠勇',
            jlsg_bozhan: '搏战',
            jlsg_qingxi: '轻袭',


            jlsg_danshou: '胆守',
            jlsg_yonglie: '勇烈',
            jlsg_hengshi: '衡势',
            jlsg_zhijiao: '至交',
            jlsg_zhijiao2: '至交',
            jlsg_jiwux: '戟舞',
            jlsg_daoshi: '刀侍',
            jlsg_lirang: '礼让',
            jlsg_lirang2: '礼让',
            jlsg_lirang2_backup: '礼让',
            jlsg_xianshi: '贤士',
            jlsg_chengxiang: '称象',
            jlsg_renxin: '仁心',
            jlsg_midao: '米道',
            jlsg_yishe: '义舍',
            jlsg_pudu: '普渡',
            jlsg_zongqing: '纵情',
            jlsg_bugua: '卜卦',
            jlsg_zhaoxin: '昭心',
            jlsg_zhihe: '制合',
            jlsg_caijie: '才捷',
            jlsg_jilei: '鸡肋',
            jlsg_yanliang: '延粮',
            jlsg_duzhi: '毒治',
            jlsg_duzhi2: '毒治',
            jlsg_lieyi: '烈医',
            jlsg_lieyi1: '烈医',
            jlsg_baoli: '暴戾',
            jlsg_huanbing: '缓兵',
            jlsg_huanbing2: '缓兵',
            jlsg_hongyuan: '弘援',
            jlsg_huaqiang: '花枪',
            jlsg_chaohuang: '朝凰',
            jlsg_huilian: '慧敛',
            jlsg_wenliang: '温良',
            jlsg_qianhuan: '千幻',
            jlsg_jinglun: '经纶',
            jlsg_ruzong: '儒宗',
            jlsg_ruzong_wuxie: '儒宗',
            jlsg_ruzong_shan: '儒宗',
            jlsg_leiji: '雷祭',
            jlsg_shanxi: '闪戏',
            jlsg_guhuo: '蛊惑',
            jlsg_fulu: '符箓',
            jlsg_guixiu: '闺秀',
            jlsg_cunsi: '存嗣',
            jlsg_yongjue: '勇决',
            jlsg_yongjue2: '勇决',
            jlsg_gongshen: '恭慎',
            jlsg_jianyue: '俭约',
            jlsg_pengri: '捧日',
            jlsg_danmou: '胆谋',
            jlsg_fushe: '伏射',
            jlsg_ziguo: '资国',
            jlsg_shangdao: '商道',
            jlsg_hengjiang: '横江',
            jlsg_zhuanshan: '专擅',
            jlsg_zhenlie: '贞烈',
            jlsg_miji: '秘计',
            jlsg_danqi: '单骑',
            jlsg_tuodao: '拖刀',
            jlsg_wusheng: '武圣',
            jlsg_zhuiji: '追击',
            jlsg_xionglie: '雄烈',
            jlsg_chenqing: '陈情',
            jlsg_mozhi: '默识',
            jlsg_zhoufu: '咒缚',
            jlsg_zhoufu2: '咒缚',
            jlsg_yingbing: '影兵',
            jlsg_yongji: '勇继',
            jlsg_yongjiBuff: '勇继',
            jlsg_wuzhi: '武志',
            jlsg_wuzhi2: '武志',
            jlsg_yidu: '异度',
            jlsg_zhubao: '诛暴',
            jlsg_fenji: '奋激',
            jlsg_jiaomei: '娇媚',
            jlsg_huoshui: '祸水',

            jlsg_yuhua: '羽化',
            jlsg_yuhua_info: '当你使用锦囊牌造成伤害时，或当你受到锦囊牌造成的伤害时，你可以摸一张牌并防止之。若如此做，你的手牌上限-1',
            jlsg_dengxian: '登仙',
            jlsg_dengxian2: '登仙',
            jlsg_dengxian_info: '觉醒技，回合开始阶段，若你的手牌上限为0，你移除弃牌阶段并选择一项：1.替换为摸牌阶段；2.替换为出牌阶段。',
            jlsg_tiance: '天策',
            jlsg_tiance_info: '回合开始阶段，你可以令一名角色进行判定，然后你选择并令其从牌堆或弃牌堆或除其以外的随机一名角色处获得两张与判定结果花色相同的牌',
            jlsg_jiexin: '竭心',
            jlsg_jiexin_info: '当你受到伤害后，你可以发动一次〖天策〗，然后若判定结果与对你造成伤害牌的颜色相同，你额外再发动一次〖天策〗。',
            jlsg_jiexin_tiance: '竭心',
            jlsg_tongxin: '同心',
            jlsg_tongxin_info: '限定技，当你处于濒死状态时，你可以回复体力至2点，然后若关索或鲍三娘不在场，你可以将武将牌替换为其中之一。',
            jlsg_zhengnan: '征南',
            jlsg_zhengnan2: '征南',
            jlsg_zhengnan_info: '出牌阶段限一次，你可以弃置一名角色区域里的一张牌，若以此法弃置的牌为非基本牌，视为其使用一张【南蛮入侵】；以此法使用的【南蛮入侵】造成伤害时，你摸一张牌。',
            jlsg_jianwu: '剑舞',
            jlsg_jianwu2: '剑舞',
            jlsg_jianwu_info: '锁定技，若你使用的上一张牌为基本牌，你使用【杀】时无距离和次数限制，且目标上限+1',
            jlsg_zhennan: '镇南',
            jlsg_zhennan_info: '每回合限一次，当一张【杀】或普通锦囊指定目标后，若目标数大于一，你可以对其中一个目标造成一点伤害。',
            jlsg_shemi: '奢靡',
            jlsg_shemi2: '奢靡',
            jlsg_shemi_draw: '奢靡',
            jlsg_shemi_info: '锁定技，弃牌阶段，你可以多弃置任意张牌，若你于此阶段内弃置牌的数量大于你的上一个弃牌阶段，你的摸牌阶段摸牌数+1，若你未受伤，你加一点体力上限。',
            jlsg_jiaohui: '狡慧',
            jlsg_jiaohui_info: '当你受到伤害时，你可以摸一张牌或弃置一张牌，然后若你的手牌数等于体力值，你令此伤害-1。',
            jlsg_wengua: '问卦',
            jlsg_wengua2: '问卦',
            jlsg_wengua_info: '一名角色的回合开始阶段，其可以交给你一张牌，然后你可以将一张牌置于牌堆底，再与其各摸一张牌。',
            jlsg_fuzhu: '伏诛',
            jlsg_fuzhu_info: '限定技，出牌阶段，你可以选择一名其他角色，然后展示牌堆底牌，若此牌为黑色，你将此牌当【杀】对其使用，然后重复此流程。',

            jlsg_jiaomei_info: '出牌阶段限一次，当你使用【杀】或非延时锦囊牌指定目标后，你可以令其横置。若其已横置，改为令其重置并翻面。',
            jlsg_huoshui_info: '回合结束阶段，你可以依次获得已横置角色的一张牌，然后对所有武将牌背面向上的角色造成1点伤害。',
            jlsg_fenji_info: '当一名角色成为【杀】的目标后，你可以失去1点体力，然后令该角色摸两张牌。',
            jlsg_yidu_info: '你的回合外，当你失去手牌后，你可以摸X张牌（X为当前回合角色手牌中花色与这些牌相同的数量）。每回合限一次。',
            jlsg_zhubao_info: '你的回合内，当其他角色失去手牌后，你可以摸X张牌（X为你手牌中花色与这些牌相同的数量）。每回合对每名其他角色限触发一次。',
            // jlsg_zhubao_append: '<span style="font-family: yuanli">每次至多摸十张。</span>',
            jlsg_yongji_info: '锁定技，当你于出牌阶段使用【杀】造成伤害后，你摸X张牌（X为你已损失的体力值且至多为3），且本回合可额外使用一张【杀】。',
            jlsg_wuzhi_info: '锁定技，弃牌阶段结束后，若你本回合内【杀】的使用次数未达到上限，你失去1点体力并从牌堆中获得一张【杀】',
            jlsg_wusheng_info: '你可以将一张红色牌当【杀】使用或打出。',
            jlsg_zhoufu_info: '其他角色的回合开始时，你可以弃置一张手牌，令其判定，若结果为黑桃，你令其所有非锁定技失效直到回合结束；若结果为梅花，其弃置两张牌。',
            jlsg_yingbing_info: '每回合限一次，当一名其他角色的黑色判定牌生效后，你可以视为对其使用一张【杀】。',
            jlsg_tuodao_info: '每当你用【闪】抵消了一次【杀】的效果时，若使用者在你的攻击范围内，你可以立刻对其使用一张【杀】，此【杀】无视防具且不可被【闪】响应',
            jlsg_zhuiji_info: '锁定技，你对其他角色造成伤害后，你令你与其的距离-1',
            jlsg_xionglie_info: '当你使用【杀】指定目标后，你可以选择一项：1.令此【杀】不能被【闪】响应；2.令此【杀】伤害+1。若你与所有其他角色的距离为1，则改为依次执行两项',
            jlsg_chenqing_info: '每回合限一次，当一名角色进入濒死状态时，你可以令另一名其他角色摸四张牌，然后其弃置X张牌。若其以此法弃置的牌花色各不相同，则视为该角色对濒死的角色使用一张【桃】。(X为此技能发动过的次数)',
            jlsg_mozhi_info: '一名角色的结束阶段开始时，你可以将一张手牌当作其此回合内使用的最后一张基本或普通锦囊牌使用。',
            jlsg_mozhi_append: '<span style="font-family: yuanli">你不能通过此技能使用【酒】</span>',
            jlsg_danqi_info: '觉醒技，回合开始阶段，若你的手牌数大于你的体力值，你失去1点体力上限，恢复2点体力，并获得技能〖拖刀〗。',
            jlsg_zhenlie_info: '当你成为其他角色使用的【杀】或非延时锦囊牌的目标时，你可以失去1点体力，令此牌对你无效，然后你可以弃置一张牌，令该角色展示所有手牌并弃置与之花色相同的牌，若不如此做，其失去1点体力。',
            jlsg_miji_info: '回合开始阶段开始时，若你已受伤，你可以声明一种牌的类别，然后从牌堆随机亮出一张此类别的牌，将之交给一名角色。回合结束阶段开始时，若你的体力为全场最少（或之一），你亦可以如此做。',
            jlsg_pengri_info: '出牌阶段限一次，你可以摸两张牌，然后攻击范围内含有你的其他角色可依次对你使用一张【杀】',
            jlsg_danmou_info: '当你受到伤害后，你可以与伤害来源交换手牌。',
            jlsg_fushe_info: '其他角色的出牌阶段开始时，若其在你的攻击范围内，你可以选择一种花色。若如此做，此阶段结束时，若有此花色的牌进入弃牌堆，你对其造成1点伤害，然后摸一张牌。',
            jlsg_ziguo_info: '出牌阶段限一次，你可以令一名已受伤的角色摸两张牌，若如此做，本回合你的手牌上限-2。',
            jlsg_shangdao_info: '锁定技，一名其他角色的准备阶段开始时，若其手牌数大于你，你展示牌堆顶牌并获得之。',
            jlsg_hengjiang_info: '弃牌阶段开始时，你可以令你的手牌上限+1或-1，若如此做，此阶段结束时，你可以弃置场上的至多X张牌（X为此阶段你弃置的牌数）。',
            jlsg_zhuanshan_info: '回合开始/结束阶段开始时，你可以令一名角色摸一张牌，然后将该角色的一张牌置于牌堆顶。',
            jlsg_hemeng_info: '出牌阶段，若你有手牌，可令一名其他角色观看你的手牌并获得其中一张，然后你观看该角色的手牌并获得其一张牌。每阶段限X+1次，X为你此阶段开始时已损失的体力值。',
            jlsg_sujian_info: '每当你从其他角色处获得一次牌时，可令一名其他角色弃置你一张牌，然后你弃置其一张牌。',
            jlsg_yexi_info: '回合结束阶段，你可以多弃一张手牌， 然后指定你以外的一名角色选择一项:1.使用黑色【杀】时无视防具。2.使用红色【杀】时无视距离。该角色在他的下个出牌阶段中得到此效果。',
            jlsg_kuangyan_info: '锁定技，你受到1点无属性伤害时，该伤害对你无效，你受到两点或以上伤害时，该伤害+1。',
            jlsg_chaochen_info: '出牌阶段限一次，你可以将至少一张手牌交给一名其他角色，若如此做，该角色的下个回合开始阶段开始时，若其手牌数大于体力值，你对其造成1点伤害。',
            jlsg_quanzheng_info: '当你成为其他角色使用的【杀】或非延时类锦囊牌的目标后，若其手牌或装备区的牌数大于你对应的区域，你可以摸一张牌。',
            jlsg_shejian_info: '出牌阶段对每名其他角色限一次，若你未装备防具，你可以弃置一名其他角色的一张牌，然后该角色可以视为对你使用一张【杀】。',
            jlsg_kuangao_info: '当一张对你使用的【杀】结算后，你可以选择一项：弃置所有牌（至少一张），然后该【杀】的使用者弃置所有牌；或令该【杀】的使用者将手牌补至其体力上限的张数（至多5张）。',
            jlsg_yinbing_info: '你攻击范围内的一名其他角色成为【杀】的目标时，你可以获得其装备区的一张牌，然后将该【杀】转移给你（你不得是此【杀】的使用者）；当你成为【杀】的目标时，你可以弃置一张牌，然后摸X张牌（X为你已损失的体力值）。',
            jlsg_fenwei_info: '当你使用【杀】对目标角色造成伤害时，你可以展示该角色的一张手牌：若为【桃】或【酒】，则你获得之；若不为基本牌，你弃掉该牌并令该伤害+1。',
            jlsg_shiyong_info: '锁定技，当你受到一次红色【杀】或【酒】【杀】造成的伤害后，须减1点体力上限。',
            jlsg_angyang_info: '每当你使用（指定目标后）或被使用（成为目标后）一张【决斗】或红色的【杀】时，你可以摸一张牌，若对方判定区内有牌，你改为摸两张。',
            jlsg_weifeng_info: '回合开始阶段，若你的手牌数小于你的体力值，你可以与一名角色拼点，赢的角色摸两张牌。',
            jlsg_xieli_info: '主公技，当你需要打出一张拼点牌时，你可请场上吴将帮你出，所有吴将给出牌后，你必须从中挑选一张作为拼点牌并弃掉其余。',
            jlsg_jushou_info: '回合结束阶段，你可以摸(X+1)张牌，最多5张。若如此做，将你的武将牌翻面。X为仅计算攻击范围和距离时，场上可以攻击到你的人数。',
            jlsg_yicong_info: '锁定技，只要你的体力值大于2点，你计算与其他角色的距离时，始终-1；只要你的体力值为2点或更低，其他角色计算与你的距离时，始终+1。',
            jlsg_muma_info: '锁定技，你的回合外，若你没有装备+1/-1马，则其他角色的+1/-1马从装备区失去时，你获得之。',
            jlsg_suiji_info: '其他角色的弃牌阶段开始时，你可以交给其至少一张手牌，然后其将超出其体力值数量的手牌交给你。',
            jlsg_fengyi_info: '当你成为非延时类锦囊牌的唯一目标后，你可以摸一张牌。',
            jlsg_yalv_info: '当你受到伤害后，或出牌阶段开始时，你可以观看牌堆顶两张牌并以任意顺序置于牌堆顶，然后你可以摸一张牌。',
            jlsg_xiemu_info: '一名角色的回合开始阶段开始时，你可以将一张牌置于牌堆顶，若如此做，该角色回合结束阶段开始时，你可以令其摸一张牌。',
            jlsg_zhejie_info: '其他角色的弃牌阶段结束时，你可以弃置一张手牌，令其弃置一张牌，若该角色弃置的牌为装备牌，你将之交给除该角色外的一名角色。',
            jlsg_fengya_info: '每当你受到一次伤害时，你可以摸一张牌，然后伤害来源可以摸一张牌并令此伤害-1。',
            jlsg_yijian_info: '你可以跳过你的出牌阶段并令一名其他角色摸一张牌，然后若该角色的手牌数不小于你的手牌数，你恢复1点体力。',
            jlsg_feijun_info: '锁定技，出牌阶段开始时，若你的手牌数不小于你的体力值，本阶段你的攻击范围+X且可以额外使用一张【杀】（X为你当前体力值）；若你的手牌数小于你的体力值，你不能使用【杀】直到回合结束。',
            jlsg_muniu_info: '你的回合内，当任意角色装备区的牌发生一次变动时，你可以选择一名角色并选择一项： 弃置其一张手牌，或令其摸一张牌。',
            jlsg_liuma_info: '出牌阶段限一次，你可以弃置一张基本牌，然后令至多两名装备区有牌的其他角色依次选择一项：将其装备区的一张牌交给一名其他角色，或令你获得其一张手牌。',
            jlsg_baozheng_info: '锁定技，回合结束阶段开始时，你令其他有手牌的角色依次选择一项：交给你一张手牌；或弃置两张牌，然后对你造成1点伤害。',
            jlsg_lingnu_info: '锁定技，回合结束时，若你于此回合受到2点或更多的伤害，你减1点体力上限，然后从其他角色处依次获得一张牌。',
            jlsg_zhongyong_info: '回合开始阶段开始时，你可以失去1点体力，若如此做，本回合的摸牌阶段，你可以额外摸X张牌（X为你已损失的体力值）；本回合的出牌阶段，你与其他角色的距离为1；本回合的弃牌阶段结束时，你可以令一名其他角色获得你本阶段弃置的牌。',
            jlsg_bozhan_info: '当你使用或被使用一张【杀】并完成结算后，若此【杀】未造成伤害，则此【杀】的目标或你可以对你或此【杀】的使用者使用一张【杀】(无距离限制）。',
            jlsg_qingxi_info: '锁定技，当你使用【杀】指定一名其他角色为目标后，若你装备区的牌数少于该角色，其不能使用【闪】响应此【杀】。',

            jlsg_danshou_info: '锁定技，当一名角色使用【杀】指定你为目标后，若你与其均有手牌，你与该角色拼点，若你赢，你摸两张牌，然后弃置其一张牌；若你没赢，此【杀】不可被【闪】响应。',
            jlsg_yonglie_info: '当你攻击范围内的一名角色受到【杀】造成的伤害后，你可以失去1点体力，然后对伤害来源造成1点伤害。',
            jlsg_hengshi_info: '弃牌阶段开始时，你可以摸等同于手牌数的牌。',
            jlsg_zhijiao_info: '限定技，回合结束阶段开始时，你可以令一名其他角色获得你的本回合因弃置而进入弃牌堆的牌。',
            // jlsg_jiwux_info: '出牌阶段开始时，你可以展示一张【杀】，令其获得以下效果之一（离开手牌区后失效）：1、此【杀】不计入次数限制，且此杀被【闪】响应时你从牌堆中获得一张【杀】；2、此【杀】无距离限制且可以额外指定1个目标；，若此【杀】未造成伤害，你令你手牌中所有【杀】获得随机一项【戟舞】效果；3、此【杀】的伤害值+1,且你使用此【杀】指定目标后，可以弃置一张【杀】令此【杀】结算时视为拥有其余两项【戟舞】效果。',
            jlsg_jiwux_info: '出牌阶段开始时，你可以展示一张【杀】，令其获得以下效果之一（离开手牌区后失效）：1、此【杀】不计入次数限制；2、此【杀】无距离限制，且可以额外指定1个目标；3、此【杀】的伤害值+1。',
            jlsg_daoshi_info: '一名角色的回合结束阶段开始时，若其装备区有牌，其可以摸一张牌，然后将其装备区的一张牌交给你。',
            jlsg_lirang_info: '一名角色的回合开始阶段结束时，其可以将一张与所有「礼」花色均不同的手牌置于你的武将牌上作为「礼」，然后摸一张牌。你可以将两张「礼」当【桃】使用。',
            jlsg_xianshi_info: '每当你受到一次伤害时，可以令伤害来源选择一项：展示所有手牌并弃置其中一张；或令此伤害-1.',
            jlsg_chengxiang_info: '每当你受到伤害后，你可以亮出牌顶堆的4张牌，然后获得其中的至少一张点数和不大于13的牌，将其余的牌置入弃牌堆。',
            jlsg_renxin_info: '每当一名其他角色处于濒死状态时，你可以翻面并将所有手牌交给该角色，令其恢复1点体力。',
            jlsg_midao_info: '出牌阶段限一次，你可以令手牌数大于你的其他角色依次交给你一张牌，然后若你的手牌数为全场最多，你失去1点体力。',
            jlsg_yishe_info: '出牌阶段限一次，你可以与一名手牌数不大于你的其他角色交换手牌。',
            jlsg_pudu_info: '限定技，出牌阶段，你可以获得所有其他角色的手牌，然后依次交给其他角色一张牌，直到你的手牌数不为全场最多。',
            jlsg_zongqing_info: '摸牌阶段开始时，你可以进行一次判定，若如此做，此阶段摸牌后你须展示之，然后弃置其中与该判定牌颜色不同的牌。若以此法弃置的牌为黑色，视为你使用一张【酒】；若以此法弃置的牌为红色，视为你使用一张【桃】。',
            jlsg_bugua_info: '当一名角色将要进行判定时，你可以展示牌堆顶的一张牌，然后选择一项：1.将一张手牌置于牌堆顶，或令其将一张手牌置于牌堆顶。当一名角色的判定牌为红色且生效后，你可以令其摸一张牌：当一名角色的判定牌为黑色且生效后，你可以令其弃一张牌。',
            jlsg_zhaoxin_info: '当你受到伤害后，你可以展示所有手牌，然后摸X张牌（X为缺少的花色数）。',
            jlsg_zhihe_info: '出牌阶段限一次，你可以展示所有手牌，并将其中每种花色的牌弃置至一张，然后将手牌数翻倍。',
            jlsg_caijie_info: '其他角色的回合开始阶段开始时，若其手牌数不小于你，你可以与其拼点，若你赢，你摸两张牌；若你没赢，视为其对你使用一张【杀】。',
            jlsg_jilei_info: '当你受到伤害后，你可以令伤害来源展示所有手牌并弃置其中类别相同且最多（或之一）的所有牌。',
            jlsg_yanliang_info: '一名角色的回合开始阶段开始时，你可以弃置一张红色牌，令其本回合的摸牌阶段改为在出牌阶段后进行；或弃置一张黑色牌，令其本回合的摸牌阶段改为在弃牌阶段后进行。',
            jlsg_duzhi_info: '当你恢复体力后，你可以令一名其他角色失去X点体力，然后该角色可以对你使用一张【杀】；当你使用红色【杀】造成伤害后，你可以令至多X名其他角色失去1点体力，然后这些角色可以依次对你使用一张【杀】（X为当前体力的改变值）。',
            jlsg_lieyi_info: '锁定技，你的【桃】均视为【杀】；你的【闪】均视为【酒】。',
            jlsg_baoli_info: '出牌阶段限一次，你可以对一名装备区没有牌或判定区有牌的其他角色造成1点伤害。',
            jlsg_huanbing_info: '锁定技，当你成为【杀】的目标时，终止此【杀】的结算，改为将之置于你的武将牌上。回合开始阶段开始时，你须为你武将牌上的每一张【杀】进行一次判定：若结果为红色，你摸一张牌；若结果为黑色，你须失去1点体力。然后将【杀】收入手牌。',
            // jlsg_hongyuan_info: '出牌阶段限一次，你可以弃置两张手牌，将一名角色装备区的牌移动到另一名其他角色对应的区域（不可覆盖）。',
            jlsg_hongyuan_info: '出牌阶段限一次，你可以弃置至多X张手牌，然后选择一名角色获得场上的X张牌（X为你已损失的体力值）。',
            jlsg_huaqiang_info: '出牌阶段限一次，你可以弃置X种不同花色的手牌，然后对一名其他角色造成1点伤害（X为你的体力值且至多为4）。',
            // jlsg_chaohuang_info: '出牌阶段限一次，你可以失去1点体力，然后视为对你攻击范围内的任意名角色依次使用一张【杀】（不计入出牌阶段的使用限制）。',
            jlsg_chaohuang_info: '出牌阶段限一次，你可以失去1点体力视为使用一张【杀】，（不计入出牌阶段的使用限制）指定你攻击范围内的任意名角色为目标。',
            jlsg_huilian_info: '出牌阶段限一次，你可以令一名其他角色进行一次判定并获得生效后的判定牌。若结果为红桃，该角色恢复1点体力。',
            jlsg_wenliang_info: '一名角色的红色判定牌生效后，你可以摸一张牌。',
            jlsg_qianhuan_info: '锁定技，你的每个回合开始时，随机展示3张未上场且你拥有的武将，你获得其中的2个技能（主公技，限定技，觉醒技，隐匿技，使命技，带有Charlotte标签的技能除外），直到你的下个回合开始。若该局游戏为双将模式，则移除你的另一名武将，将“2个”改为“4个”。',
            jlsg_jinglun_info: '你响应其他角色的牌，或其他角色响应你的牌时，你可以获得其使用或响应的牌。每回合限一次。',
            jlsg_ruzong_info: '你可以将【闪】/【无懈可击】当【无懈可击】/【闪】使用或打出。',
            jlsg_leiji_info: '当其他角色使用【闪】时，你可以将牌堆或弃牌堆里的一张【闪电】置入一名角色的判定区。',
            jlsg_shanxi_info: '锁定技，你不能成为【闪电】的目标，其他角色的【闪电】的判定牌生效后，你获得之。',
            jlsg_guhuo_info: '其他角色的回合开始时，你可以与其拼点：若你赢，你视为使用一张基本牌或非延时锦囊牌；若你没赢，其对你造成1点伤害。',
            jlsg_fulu_info: '当你受到一点伤害后，你可以令最近三名对你造成伤害的角色随机弃置一张牌，你最近三次回复体力的来源（若有）各摸一张牌。',
            jlsg_guixiu_info: '若你于此回合内未造成过伤害，你可以跳过弃牌阶段并摸一张牌。',
            jlsg_cunsi_info: '当你死亡时，你可以将区域内的所有牌移出游戏，然后令一名角色获得〖勇决〗',
            jlsg_yongjue_info: '锁定技，你使用【杀】造成的伤害+1；你杀死一名角色后，你获得所有〖存嗣〗移出游戏的牌。',
            jlsg_gongshen_info: '出牌阶段，你可以弃置3张牌，然后摸一张牌，若此时你的手牌数为最少（或之一），你恢复1点体力。',
            jlsg_jianyue_info: '一名角色的回合结束阶段开始时，若该角色的手牌数为最少（或之一），你可以令其从弃牌堆随机获得牌直到其手牌数不为最少（或之一）。',
            jlsgsk_simashi: "SK司马师",
            jlsgsk_xianglang: "SK向朗",
            jlsgsk_luji: "SK陆绩",
            jlsgsk_bianfuren: "SK卞夫人",
            jlsgsk_heqi: "SK贺齐",
            jlsgsk_mateng: "SK马腾",
            jlsgsk_tianfeng: "SK田丰",
            jlsgsk_feiyi: "SK费祎",
            jlsgsk_jiangqin: "SK蒋钦",
            jlsgsk_dongyun: "SK董允",
            jlsgsk_dongxi: "SK董袭",
            jlsgsk_quancong: "SK全琮",
            jlsgsk_yujin: "SK于禁",
            jlsgsk_panfeng: "SK潘凤",
            jlsg_quanlue: "权略",
            jlsg_quanlue_info: "出牌阶段开始时，你可以展示所有手牌并选择其中一种花色的手牌，然后摸与之等量的牌。若如此做，此阶段结束时，你须展示手牌并弃置所有此花色的手牌。",
            jlsg_huaiju: "怀橘",
            jlsg_huntian: "浑天",
            jlsg_huaiju_info: "你的一个阶段结束时，若你的手牌数为3，你可以摸一张牌或弃置两张牌。",
            jlsg_huntian_info: "当你的牌因弃置而进入弃牌堆时，你可将其中任意张置于牌堆顶，然后从牌堆随机获得一张与这些牌类别均不同的牌。",
            jlsg_cangshu: "藏书",
            jlsg_kanwu: "勘误",
            jlsg_kanwu_shan: "勘误",

            jlsg_cangshu_info: "当其他角色使用非延时类锦囊牌时，你可以交给其一张基本牌，然后获得此牌并令其无效。每回合限一次。",
            jlsg_kanwu_info: "当你于回合外需要使用或打出一张基本牌时，你可以弃置一张锦囊牌，视为使用或打出之。",
            jlsg_huage: "化戈",
            jlsg_muyi: "母仪",
            jlsg_huage_info: "出牌阶段限一次，你可以令所有角色依次弃置至少一张牌，目标角色每弃置一张【杀】则摸一张牌。",
            jlsg_muyi_info: "其他角色的回合开始阶段开始时，其可以交给你一至两张牌，然后此回合结束时，你交给其等量的牌。",
            jlsg_diezhang: "迭嶂",
            jlsg_diezhang2: "迭嶂",
            jlsg_diezhang3: "迭嶂",
            jlsg_diezhang_info: "出牌阶段，当你使用牌时，若此牌的点数大于本回合你上一张使用的牌，你可以摸一张牌。",
            jlsg_xiongyi: "雄异",
            jlsg_xiongyi_info: "锁定技，准备阶段，若你的体力值为1，你恢复1点体力；若你没有手牌，你摸两张牌。",
            jlsg_sijian: "死谏",
            jlsg_gangzhi: "刚直",
            jlsg_gangzhi2: "刚直",
            jlsg_sijian_info: "当你失去所有手牌后，你可以弃置一名其他角色的X张牌(X为你的体力值)。",
            jlsg_gangzhi_info: "当你受到伤害时，若你有手牌，你可以弃置所有手牌，然后防止此伤害，若你没有手牌，你可以将武将牌翻面，然后将手牌数补至体力上限。",
            jlsg_yanxi: "衍息",
            jlsg_zhige: "止戈",
            jlsg_zhige_3: "止戈·闪",
            jlsg_zhige_4: "止戈·杀",
            jlsg_yanxi_info: "回合开始阶段开始时或回合结束阶段开始时，若你的装备区内没有牌，你可以摸一张牌。",
            jlsg_zhige_info: "你可以弃置你装备区内的所有牌(至少一张)，视为使用一张【杀】或【闪】。",
            jlsg_shangyi: "尚义",
            jlsg_wangsi: "忘私",
            jlsg_shangyi_info: "出牌阶段限一次，你可以令一名其他角色观看你的手牌，然后你选择一项：观看其手牌，并可以弃置其中一张黑色牌；或观看其身份牌。",
            jlsg_wangsi_info: "当你受到伤害后，你可以观看伤害来源的手牌，并可以弃置其中一张红色牌。",
            jlsg_bibu: "裨补",
            jlsg_bibu1: "裨补",
            jlsg_kuangzheng: "匡正",
            jlsg_bibu_info: "其他角色的结束阶段，若你的手牌数大于体力值，你可以将一张手牌交给一名其他角色；否则你可以摸一张牌。",
            jlsg_kuangzheng_info: "你的回合结束时，你可以将一名角色的武将牌恢复至游戏开始时的状态（即将其武将牌翻转至正面朝上并重置之）。",
            jlsg_duanlan: "断缆",
            jlsg_duanlan_info: "出牌阶段限一次，你可以弃置其他角色区域内的1至3张牌，然后选择一项： 1、失去1点体力;2、弃置一张大于这些牌点数之和的牌。",
            jlsg_yaoming: "邀名",
            jlsg_yaoming_1: "邀名",
            jlsg_yaoming_2: "邀名",
            jlsg_yaoming_3: "邀名",
            jlsg_yaoming_4: "邀名",
            jlsg_yaoming_info: "出牌阶段，当你使用或打出一张花色与本阶段皆不相同的牌时：第一种，你可以摸一张牌；第二种，你可以弃置一名其他角色的一张牌；第三种，你可以将场上一张牌移至另一位置；第四种，你可以对一名其他角色造成一点伤害。",
            jlsg_yaoming_3_info: "你可以移动场上的一张牌",
            jlsg_zhengyi: "整毅",
            jlsg_zhengyi_shan: "整毅",
            jlsg_zhengyi_info: "你出牌阶段出牌时，若你的手牌数等于你的体力值+1，你可以视为使用任意一张基本牌，然后弃一张牌；你的回合外，当你需要使用或打出一张基本牌时，若你的手牌数等于你的体力值-1，则你可以摸一张牌并视为使用或打出了此牌。",
            jlsg_kuangfu: "狂斧",
            jlsg_kuangfu_info: "当你使用【杀】对目标角色造成伤害后，你可以获得其装备区里的一张牌。",
            jlsg_hubu: "虎步",
            jlsg_hubu_info: '你每使用【杀】造成一次伤害后或受到一次其他角色使用【杀】造成的伤害后，可以令除你外的任意角色进行一次判定；若结果不为黑桃，则视为你对其使用一张【决斗】（此【决斗】不能被【无懈可击】响应）。',
          },
        };
        if (lib.device || lib.node) {
          for (var i in jlsg_sk.character) {
            jlsg_sk.character[i][4].push('ext:极略/' + i + '.jpg');
          }
        } else {
          for (var i in jlsg_sk.character) {
            jlsg_sk.character[i][4].push('db:extension-极略:' + i + '.jpg');
          }
        }
        return jlsg_sk;
      });
      game.import('character', function () { // SR
        var jlsg_sr = {
          name: 'jlsg_sr',
          connect: true,
          character: {
            jlsgsr_zhangliao: ['male', 'wei', 4, ['jlsg_wuwei', 'jlsg_yansha'], []],
            jlsgsr_xiahoudun: ['male', 'wei', 4, ['jlsg_zhonghou', 'jlsg_ganglie'], []],
            // jlsgsr_zhenji: ['female', 'wei', 3, ['jlsg_liuyun', 'jlsg_lingbo', 'jlsg_qingcheng_zhu'], []],
            jlsgsr_zhenji: ['female', 'wei', 3, ['jlsg_liuyun', 'jlsg_lingbo', 'jlsg_qingcheng'], []],
            jlsgsr_xuzhu: ['male', 'wei', 4, ['jlsg_aozhan', 'jlsg_huxiao'], []],
            jlsgsr_simayi: ['male', 'wei', 3, ['jlsg_guicai', 'jlsg_langgu', 'jlsg_zhuizun'], []],
            jlsgsr_guojia: ['male', 'wei', 3, ['jlsg_tianshang', 'jlsg_yiji', 'jlsg_huiqu'], []],
            jlsgsr_caocao: ['male', 'wei', 4, ['jlsg_zhaoxiang', 'jlsg_zhishi', 'jlsg_jianxiong'], ['zhu',]],
            jlsgsr_zhaoyun: ['male', 'shu', 4, ['jlsg_jiuzhu', 'jlsg_tuwei'], []],
            jlsgsr_zhangfei: ['male', 'shu', 4, ['jlsg_xujin', 'jlsg_paoxiao'], []],
            jlsgsr_machao: ['male', 'shu', 4, ['jlsg_benxi', 'jlsg_yaozhan'], []],
            jlsgsr_guanyu: ['male', 'shu', 4, ['jlsg_wenjiu', 'jlsg_shuixi'], []],
            jlsgsr_zhugeliang: ['male', 'shu', 3, ['jlsg_sanfen', 'jlsg_guanxing', 'jlsg_weiwo'], []],
            jlsgsr_huangyueying: ['female', 'shu', 3, ['jlsg_shouji', 'jlsg_hemou', 'jlsg_qicai'], []],
            jlsgsr_liubei: ['male', 'shu', 4, ['jlsg_rende', 'jlsg_chouxi', 'jlsg_yongbing'], ['zhu',]],
            jlsgsr_sunshangxiang: ['female', 'wu', 3, ['jlsg_yinmeng', 'jlsg_xiwu', 'jlsg_juelie'], []],
            jlsgsr_daqiao: ['female', 'wu', 3, ['jlsg_fangxin', 'jlsg_xiyu', 'jlsg_wanrou'], []],
            jlsgsr_huanggai: ['male', 'wu', 4, ['jlsg_zhouyan', 'jlsg_zhaxiang'], []],
            jlsgsr_lvmeng: ['male', 'wu', 4, ['jlsg_shixue', 'jlsg_guoshi'], []],
            jlsgsr_zhouyu: ['male', 'wu', 3, ['jlsg_yingcai', 'jlsg_weibao', 'jlsg_choulve'], []],
            jlsgsr_ganning: ['male', 'wu', 4, ['jlsg_jiexi', 'jlsg_youxia'], []],
            jlsgsr_luxun: ['male', 'wu', 3, ['jlsg_dailao', 'jlsg_youdi', 'jlsg_ruya'], []],
            jlsgsr_sunquan: ['male', 'wu', 4, ['jlsg_quanheng', 'jlsg_xionglve', 'jlsg_fuzheng'], ['zhu',]],
            jlsgsr_lvbu: ['male', 'qun', 4, ['jlsg_jiwu', 'jlsg_sheji'], []],
            jlsgsr_huatuo: ['male', 'qun', 3, ['jlsg_xingyi', 'jlsg_guagu', 'jlsg_wuqin'], []],
            jlsgsr_diaochan: ['female', 'qun', 3, ['jlsg_lijian', 'jlsg_manwu', 'jlsg_baiyue'], []],
          },
          characterIntro: {},
          skill: {

            _jlsgsr_choice: {
              // mode: ["boss", "brawl", "chess", "connect", "doudizhu", "guozhan", "identity", "realtime", "single", "stone", "tafang", "versus"],
              trigger: {
                global: "gameStart",
                player: "enterGame",
              },
              forced: true,
              popup: false,
              unique: true,
              silent: true,
              filter: function (event, player) {
                // if (player == game.me) return false;
                if (!lib.config.extension_极略_srlose) return false;

                if (get.itemtype(player) != 'player') return false;
                var names = [];
                if (player.name) names.add(player.name);
                if (player.name1) names.add(player.name1);
                if (player.name2) names.add(player.name2);
                for (var i = 0; i < names.length; i++) {
                  if (names[i].indexOf('jlsgsr_') == 0) return true;
                }
                return false;
              },
              createList: function (name) {
                var list = [];
                var info = lib.character[name];
                if (info) {
                  var skills = info[3];
                  for (var j = 0; j < skills.length; j++) {
                    if (lib.translate[skills[j] + '_info'] && lib.skill[skills[j]] && lib.skill[skills[j]].srlose) {
                      list.push(skills[j]);
                    }
                  }
                }
                return list;
              },
              content: function () {
                'step 0'
                event.names = [];
                if (player.name) event.names.add(player.name);
                if (player.name1) event.names.add(player.name1);
                if (player.name2) event.names.add(player.name2);
                'step 1'
                for (var i = 0; i < event.names.length; i++) {
                  if (event.names[i].indexOf('jlsgsr_') == 0) {
                    event.deleting = event.names[i];
                    event.names.remove(event.deleting);
                    var list = lib.skill._jlsgsr_choice.createList(event.deleting);
                    var str = '';
                    for (i = 0; i < list.length; i++) {
                      str += '<div class="text" style="width:90%;display:inline-block"><div class="skill"><font color="#FFFF00"><span style="font-size:20px">【' +
                        get.translation(list[i]) + '】</font></span></div><div><font color="#9AFF02"><span style="font-size:17px">' + lib.translate[list[i] + '_info'] + '</font></span></div></div><br><br><br>';
                    }
                    player.chooseControl(list, function (event, player) {
                      return list.randomGet();
                    }).prompt = '选择' + get.translation(event.deleting) + '禁用1个技能<br><br>' + str;
                    event.goto(2);
                  }
                }
                'step 2'
                player.removeSkill(result.control);
                if (get.mode() == 'guozhan') {
                  lib.character[event.deleting][3].remove(result.control);
                  player.hiddenSkills.remove(result.control);
                  player.removeSkillTrigger(result.control);
                }
                player.checkMarks();
                'step 3'
                for (var i = 0; i < event.names.length; i++) {
                  if (event.names[i].indexOf('jlsgsr_') == 0) {
                    event.deleting = event.names[i];
                    event.names.remove(event.deleting);
                    var list = lib.skill._jlsgsr_choice.createList(event.deleting);
                    var str = '';
                    for (i = 0; i < list.length; i++) {
                      str += '<div class="text" style="width:90%;display:inline-block"><div class="skill"><font color="#FFFF00"><span style="font-size:20px">【' +
                        get.translation(list[i]) + '】</font></span></div><div><font color="#9AFF02"><span style="font-size:17px">' + lib.translate[list[i] + '_info'] + '</font></span></div></div><br><br><br>';
                    }
                    player.chooseControl(list, function (event, player) {
                      return list.randomGet();
                    }).prompt = '选择' + get.translation(event.deleting) + '禁用1个技能<br><br>' + str;
                    event.goto(2);
                  }
                }
              },
            },
            jlsg_wuwei: {
              audio: "ext:极略:1",
              srlose: true,
              trigger: { player: 'phaseDrawBegin' },
              priority: -1,
              check: function (event) {
                return event.num <= 3;
              },
              // prompt: '是否发动技能【无畏】，展示牌中每有一张基本牌便可视为对一名角色使用一张【杀】（每名角色限一次）',
              content: function () {
                'step 0'
                trigger.cancel();
                event.cards = game.cardsGotoOrdering(get.cards(3)).cards;
                player.showCards(event.cards);
                'step 1'
                event.lose = 0;
                for (var i = 0; i < event.cards.length; i++) {
                  if (get.type(event.cards[i], 'trick') == 'basic') {
                    event.lose++;
                  }
                }
                if (event.lose > 0 && game.hasPlayer(function (cur) {
                  return lib.filter.targetEnabled({ name: 'sha' }, player, cur);
                })) {
                  var next = player.chooseCardButton('请选择无畏视为使用【杀】弃置的牌', event.cards);
                  next.ai = function (button) {
                    if (jlsg.isWeak(player)) {
                      return button.link.name != 'du' || button.link.name != 'tao';
                    }
                    return 8 - get.value(button.link);
                  }
                  next.filterButton = function (button) {
                    return get.type(button.link) == 'basic';
                  }
                } else {
                  player.gain(event.cards, 'gain2');
                  event.finish();
                }
                'step 2'
                if (result.bool) {
                  event.cards1 = result.links[0];
                  player.chooseTarget('请选择无畏的目标', function (card, player, target) {
                    return lib.filter.targetEnabled({ name: 'sha' }, player, target);
                  }).set('ai', function (target) {
                    if (jlsg.isEnemy(player, target)) {
                      return 10 - jlsg.getDefenseSha(target, player);
                    }
                    return false;
                  });
                } else {
                  player.gain(event.cards, 'gain2');
                  event.finish();
                }
                'step 3'
                if (result.bool) {
                  player.useCard({ name: 'sha', suit: 'none', number: null }, result.targets, [event.cards1], false);
                  event.cards.remove(event.cards1);
                  event.goto(1);
                } else {
                  player.gain(event.cards, 'gain2');
                  event.finish();
                }
              },
              ai: {
                threaten: 1.5,
                // expose: 0.2,
              }
            },
            jlsg_yansha: {
              audio: "ext:极略:true",
              srlose: true,
              trigger: { player: 'phaseDrawBefore' },
              check: function (event, player) {
                if (Math.min(3, player.hp) < player.countCards('h') && player.skipList.contains('phaseUse') && !player.skipList.contains('phaseDiscard')) return true;
                return (3 - player.storage.jlsg_yansha2.length) && player.countCards('h') > 1;
              },
              content: function () {
                trigger.num--;
                player.addTempSkill('jlsg_yansha_cards', 'phaseAfter');
              },
              init: function (player) {
                player.storage.jlsg_yansha2 = [];
              },
              group: ['jlsg_yansha2'],
              subSkill: {
                cards: {
                  trigger: { player: 'phaseDiscardBegin' },
                  filter: function (event, player) {
                    return player.countCards('h') > 0;
                  },
                  direct: true,
                  content: function () {
                    'step 0'
                    var next = player.chooseCard('选择一张牌置于武将牌上作为「掩」', 'h');
                    next.ai = function (card) {
                      return 7 - get.value(card);
                    };
                    'step 1'
                    if (result.bool) {
                      player.logSkill('jlsg_yansha');
                      player.lose(result.cards, ui.special);
                      player.$give(result.cards, player);
                      player.storage.jlsg_yansha2 = player.storage.jlsg_yansha2.concat(result.cards);
                      player.syncStorage('jlsg_yansha2');
                      player.markSkill('jlsg_yansha2');
                    }
                  }
                }
              }
            },
            jlsg_yansha2: {
              audio: "ext:极略:true",
              trigger: { global: 'shaBegin' },
              filter: function (event, player) {
                return player.storage.jlsg_yansha2.length > 0 && event.player.countCards('he') > 0;
              },
              check: function (event, player) {
                if (event.player.countCards('he') > 1 && get.attitude(player, event.player) < 0) return 2;
                if (get.attitude(player, event.target) > 0) {
                  if (event.target.isDamaged() && event.target.getEquip('baiyin')) return 2;
                  if (!event.target.countCards('h') && event.player.countCards('he') > 0) return 1;
                }
                if (get.attitude(player, event.player) < 0) {
                  if (!player.get('e', '1') && event.player.get('e', '1')) return 1;
                  if (!player.get('e', '2') && event.player.get('e', '2')) return 1;
                  if (!player.get('e', '3') && event.player.get('e', '3')) return 1;
                  if (!player.get('e', '4') && event.player.get('e', '4')) return 1;
                  if (!player.get('e', '5') && event.player.get('e', '5')) return 3;
                }
                return 0;
              },
              content: function () {
                "step 0"
                var att = get.attitude(player, trigger.player);
                player.chooseCardButton('掩杀', player.storage.jlsg_yansha2, true);
                "step 1"
                if (result.bool) {
                  var card = result.buttons[0].link;
                  player.storage.jlsg_yansha2.remove(card);
                  player.syncStorage('jlsg_yansha2');
                  player.discard(card);
                  if (!player.storage.jlsg_yansha2.length) {
                    player.unmarkSkill('jlsg_yansha2');
                  }
                  if (trigger.player.countCards('he')) {
                    player.gainPlayerCard(trigger.player, 2, 'he', true);
                  }
                }
              },
              intro: {
                content: 'cards'
              }
            },
            jlsg_liuyun: {
              audio: "ext:极略:1",
              srlose: true,
              enable: 'phaseUse',
              usable: 1,
              filterCard: function (card) {
                return get.color(card) == 'black';
              },
              position: 'he',
              filter: function (event, player) {
                return player.num('he', { color: 'black' }) > 0 && !player.isLinked();
              },
              check: function (card) {
                return 8 - ai.get.value(card)
              },
              prompt: '弃置一张黑色牌，令一名角色选择一项：回复一点体力或摸两张牌',
              filterTarget: true,
              content: function () {
                'step 0'
                player.link();
                event.target = target;
                if (target.hp == target.maxHp) {
                  target.draw(2);
                  event.finish();
                }
                else {
                  var controls = ['draw_card'];
                  if (target.hp < target.maxHp) {
                    controls.push('recover_hp');
                  }
                  target.chooseControl(controls).ai = function () {
                    if (target.hp == 1 && target.maxHp > 2) {
                      return 'recover_hp';
                    }
                    else if (target.hp == 2 && target.maxHp > 2 && target.num('h') > 1) {
                      return 'recover_hp';
                    }
                    else {
                      return 'draw_card';
                    }
                  }
                }
                "step 1"
                event.control = result.control;
                switch (event.control) {
                  case 'recover_hp': event.target.recover(); event.finish(); break;
                  case 'draw_card': event.target.draw(2); event.finish(); break;
                }
              },
              ai: {
                expose: 0.2,
                order: 9,
                result: {
                  player: function (player) {
                    if (player.num('h') > player.hp) return 1;
                    if (jlsg.hasLoseHandcardEffective(player)) return 2;
                    return -1;
                  },
                  target: function (player, target) {
                    if (jlsg.isWeak(target)) return 5;
                    return 2;
                  }
                },
                threaten: 1.5
              }
            },
            // jlsg_lingbo: {
            //   audio: "ext:极略:1",
            //   srlose: true,
            //   trigger: { global: 'phaseBegin' },
            //   check: function (event, player) {
            //     if (ai.get.attitude(player, event.player) > 0) return event.player.num('j');
            //     if (ai.get.attitude(player, event.player) < 0) return event.player.num('e');
            //     return 0;
            //   },
            //   filter: function (event, player) {
            //     var num = 0;
            //     for (var i = 0; i < game.players.length; i++) {
            //       num += game.players[i].num('ej');
            //     }
            //     return (player.isLinked() || player.isTurnedOver()) && num > 0;
            //   },
            //   content: function () {
            //     'step 0'
            //     if (player.isLinked()) player.link();
            //     if (player.isTurnedOver()) player.turnOver();
            //     player.chooseTarget('将场上的一张牌置于牌堆顶', function (card, player, target) {
            //       return target.num('ej') > 0;
            //     }).ai = function (target) {
            //       if (ai.get.attitude(player, target) > 0) return target.num('j');
            //       if (ai.get.attitude(player, target) < 0) return target.num('e');
            //       return 0;
            //     }
            //     'step 1'
            //     if (result.bool) {
            //       event.target = result.targets[0];
            //       player.choosePlayerCard('将目标的一张牌置于牌堆顶', event.target, 'ej', true);
            //     }
            //     else {
            //       event.finish();
            //     }
            //     'step 2'
            //     if (result.bool) {
            //       event.card = result.links[0];
            //       event.target.lose(event.card, ui.special);
            //       game.broadcastAll(function (player) {
            //         var cardx = ui.create.card();
            //         cardx.classList.add('infohidden');
            //         cardx.classList.add('infoflip');
            //         player.$throw(cardx, 1000, 'nobroadcast');
            //       }, event.target);
            //       game.log(player, '将', event.target, '的', event.card, '置于牌堆顶');
            //     }
            //     else {
            //       event.card = null;
            //     }
            //     'step 3'
            //     if (event.target == game.me) game.delay(0.5);
            //     'step 4'
            //     if (event.card) {
            //       event.card.fix();
            //       ui.cardPile.insertBefore(event.card, ui.cardPile.firstChild);
            //     }
            //   },
            //   ai: {
            //     effect: {
            //       target: function (card) {
            //         if (card.name == 'tiesuo') return 0.5;
            //       }
            //     }
            //   }
            // },
            jlsg_lingbo: {
              audio: "ext:极略:1",
              srlose: true,
              trigger: { global: 'phaseBegin' },
              // check: function (event, player) {
              //   if (ai.get.attitude(player, event.player) > 0) return event.player.num('j');
              //   if (ai.get.attitude(player, event.player) < 0) return event.player.num('e');
              //   return 0;
              // },
              direct: true,
              filter: function (event, player) {
                if (!player.isLinked()) return false;
                var num = 0;
                for (var i = 0; i < game.players.length; i++) {
                  num += game.players[i].num('ej');
                }
                return num > 0;
              },
              content: function () {
                'step 0'
                player.chooseTarget('###是否发动【凌波】？###将场上的一张牌置于牌堆顶', function (card, player, target) {
                  return target.num('ej') > 0;
                }).set("ai", function (target) {
                  if (ai.get.attitude(player, target) > 0) return target.num('j');
                  if (ai.get.attitude(player, target) < 0) return target.num('e');
                  return 0;
                })
                'step 1'
                if (result.bool) {
                  player.logSkill('jlsg_lingbo');
                  if (player.isLinked()) player.link();
                  event.target = result.targets[0];
                }
                else {
                  event.finish();
                }
                'step 2'
                player.choosePlayerCard('将目标的一张牌置于牌堆顶', event.target, 'ej', true);
                'step 3'
                event.card = result.links[0];
                if (!event.card) {
                  event.finish(); return;
                }
                event.target.lose(event.card, ui.cardPile, 'insert', 'visible');
                event.target.$throw(1, 1000);
                game.log(player, '将', event.card, '置于牌堆顶');
                'step 4'
                if (event.target == game.me) game.delay(0.5);
                if (event.card) {
                  event.card.fix();
                  ui.cardPile.insertBefore(event.card, ui.cardPile.firstChild);
                }
              },
              ai: {
                effect: {
                  target: function (card) {
                    if (card.name == 'tiesuo') return 0.5;
                  }
                }
              }
            },
            jlsg_qingcheng: {
              audio: "ext:极略:1",
              srlose: true,
              enable: ['chooseToUse', 'chooseToRespond'],
              filterCard: function () { return false; },
              selectCard: -1,
              viewAs: { name: 'sha' },
              viewAsFilter: function (player) {
                return !player.isLinked();
              },
              prompt: '横置你的武将牌，视为打出一张杀',
              check: () => 1,
              onuse: function (result, player) {
                player.link();
              },
              onrespond: function (result, player) {
                if (!player.isLinked()) player.link();
              },
              ai: {
                skillTagFilter: function (player) {
                  return !player.isLinked();
                },
                respondSha: true,
              },
              group: ['jlsg_qingcheng2']
            },
            jlsg_qingcheng2: {
              audio: "ext:极略:1",
              enable: ['chooseToUse', 'chooseToRespond'],
              filterCard: function () { return false; },
              selectCard: -1,
              viewAs: { name: 'shan' },
              viewAsFilter: function (player) {
                return player.isLinked();
              },
              prompt: '重置你的武将牌，视为打出一张闪',
              check: () => 1,
              onrespond: function (result, player) {
                if (player.isLinked()) player.link(false);
              },
              onuse: function (result, player) {
                return this.onrespond.apply(this, arguments);
              },
              ai: {
                skillTagFilter: function (player) {
                  return player.isLinked();
                },
                respondShan: true,
              }
            },
            // jlsg_lingbo: {
            //   audio: "ext:极略:1",
            //   srlose: true,
            //   group: ['jlsg_lingbo1', 'jlsg_lingbo2'],
            // },
            // jlsg_lingbo1: {
            //   trigger: {
            //     global: "phaseEnd",
            //   },
            //   filter: function (event, player) {
            //     return player.countCards('e') > 0 && event.player != player && player.isLinked();
            //   },
            //   check: function (event, player) {
            //     return get.attitude(player, event.player) > 0;
            //   },
            //   content: function () {
            //     'step 0'
            //     player.chooseCard('e', 1, true).set('ai', function (card) {
            //       var sub = get.subtype(card);
            //       if (_status.event.player.isEmpty(sub)) return -10;
            //       return get.unuseful(card);
            //     });
            //     'step 1'
            //     if (result.bool) {
            //       trigger.player.equip(result.cards[0]);
            //       player.$give(result.cards, trigger.player);
            //     }
            //     'step 2'
            //     if (player.isLinked()) player.link();
            //   },
            // },
            // jlsg_lingbo2: {
            //   trigger: {
            //     global: "phaseBegin",
            //   },
            //   filter: function (event, player) {
            //     var card = ui.selected.cards[0];
            //     if (!card) return false;
            //     if (get.position(card) == 'e' && !target.isEmpty(get.subtype(card))) return false;
            //     return event.player != player && event.player.countCards('ej') > 0 && !player.isLinked();
            //   },
            //   check: function (event, player) {
            //     return get.attitude(player, event.player) > 0;
            //   },
            //   content: function () {
            //     "step 0"
            //     var List = [];
            //     List.push(trigger.player.getCards('ej'));
            //     player.chooseButton(List, 1, true).set('ai', function (button) {
            //       //if(get.attitude(player,trigger.player)<=0){
            //       //if(get.type(button.link)=='equip')  return 10;
            //       //return 0;
            //       //}
            //       //else if(get.attitude(player,trigger.player)>=3){
            //       //if(get.type(button.link)=='delay')  return 10;
            //       //return 0;
            //       //}
            //       if (get.attitude(player, trigger.player) > 0 && trigger.player.hasJudge('lebu') && get.type(button.link) == 'equip') return get.suit(card) == 'heart';
            //       if (get.attitude(player, trigger.player) > 0 && trigger.player.hasJudge('bingliang') && get.type(button.link) == 'equip') return get.suit(card) == 'club';
            //       if (get.attitude(player, trigger.player) > 0 && trigger.player.hasJudge('shandian') && get.type(button.link) == 'equip') return (get.suit(card) != 'spade' || (card.number < 2 || card.number > 9));
            //       if (get.attitude(player, trigger.player) < 0 && trigger.player.hasJudge('lebu') && get.type(button.link) == 'equip') return get.suit(card) != 'heart';
            //       if (get.attitude(player, trigger.player) < 0 && trigger.player.hasJudge('bingliang') && get.type(button.link) == 'equip') return get.suit(card) != 'club';
            //       if (get.attitude(player, trigger.player) < 0 && trigger.player.hasJudge('shandian') && get.type(button.link) == 'equip') return (get.suit(card) == 'spade' && card.number >= 2 && card.number <= 9);
            //       return 0;
            //     });
            //     "step 1"
            //     if (result.bool) {
            //       ui.cardPile.insertBefore(result.links[0], ui.cardPile.firstChild);
            //     }
            //     "step 2"
            //     if (!player.isLinked()) player.link();
            //   },
            // },
            // jlsg_liuyun: {
            //   audio: "ext:极略:2",
            //   srlose: true,
            //   enable: 'phaseUse',
            //   usable: 1,
            //   filterCard: function (card) {
            //     return get.color(card) == 'black';
            //   },
            //   position: 'he',
            //   filter: function (event, player) {
            //     return player.countCards('he', { color: 'black' }) > 0 && !player.isLinked();
            //   },
            //   check: function (card) {
            //     return 8 - get.value(card)
            //   },
            //   prompt: '弃置一张黑色牌，令一名角色选择一项：恢复1点体力或摸两张牌',
            //   filterTarget: true,
            //   content: function () {
            //     player.link();
            //     target.chooseDrawRecover(2, true);
            //   },
            //   ai: {
            //     expose: 0.2,
            //     order: 9,
            //     result: {
            //       player: function (player) {
            //         if (player.countCards('h', function (card) {
            //           return get.color(card) == 'black';
            //         }) > player.hp) return 1;
            //         return -1;
            //       },
            //       target: function (player, target) {
            //         var result = 2;
            //         if (target.isTurnedOver()) result += 3;
            //         if (target.hp == 1) result += 3;
            //         return result;
            //       }
            //     },
            //     threaten: 1.5
            //   }
            // },
            // jlsg_qingcheng_zhu: {
            //   srlose: true,
            //   trigger: { global: "gameDrawEnd" },
            //   forced: true,
            //   content: function () {
            //     if (player.hasSkill('jlsg_liuyun')) {
            //       player.addSkill('jlsg_qingcheng_yin');
            //       player.removeSkill('jlsg_qingcheng_zhu');
            //     } else {
            //       player.addSkill('jlsg_qingcheng_yang');
            //       player.removeSkill('jlsg_qingcheng_zhu');
            //     }
            //   },
            // },
            // jlsg_qingcheng_yang: {
            //   audio: "ext:极略:1",
            //   group: ['jlsg_qingcheng_yang1', 'jlsg_qingcheng_yang2'],
            // },
            // jlsg_qingcheng_yang1: {
            //   audio: "ext:极略:true",
            //   enable: ['chooseToUse', 'chooseToRespond'],
            //   filterCard: function () {
            //     return false;
            //   },
            //   selectCard: -1,
            //   viewAs: { name: 'sha' },
            //   viewAsFilter: function (player) {
            //     return !player.isLinked();
            //   },
            //   prompt: '横置你的武将牌，视为打出一张【杀】',
            //   check: function () {
            //     return 1
            //   },
            //   onuse: function (result, player) {
            //     if (!player.isLinked()) player.link();
            //   },
            //   onrespond: function (result, player) {
            //     if (!player.isLinked()) player.link();
            //   },
            //   ai: {
            //     skillTagFilter: function (player) {
            //       return !player.isLinked();
            //     },
            //     respondSha: true,
            //     basic: {
            //       useful: [5, 1],
            //       value: [5, 1],
            //     },
            //     order: function () {
            //       if (_status.event.player.hasSkillTag('presha', true, null, true)) return 10;
            //       return 3;
            //     },


            //     result: {
            //       target: function (player, target) {
            //         if (player.hasSkill('jiu') && !target.getEquip('baiyin')) {
            //           if (get.attitude(player, target) > 0) {
            //             return -6;
            //           } else {
            //             return -3;
            //           }
            //         }
            //         return -1.5;
            //       },
            //     },
            //     tag: {
            //       respond: 1,
            //       respondShan: 1,
            //       damage: function (card) {
            //         if (card.nature == 'poison') return;
            //         return 1;
            //       },
            //       natureDamage: function (card) {
            //         if (card.nature) return 1;
            //       },
            //       fireDamage: function (card, nature) {
            //         if (card.nature == 'fire') return 1;
            //       },
            //       thunderDamage: function (card, nature) {
            //         if (card.nature == 'thunder') return 1;
            //       },
            //       poisonDamage: function (card, nature) {
            //         if (card.nature == 'poison') return 1;
            //       },
            //     },

            //   },

            // },
            // jlsg_qingcheng_yang2: {
            //   audio: "ext:极略:true",
            //   enable: ["chooseToUse", "chooseToRespond"],
            //   filterCard: function () {
            //     return false;
            //   },
            //   selectCard: -1,
            //   viewAs: { name: 'shan' },
            //   viewAsFilter: function (player) {
            //     return player.isLinked();
            //   },
            //   prompt: '重置你的武将牌，视为打出一张【闪】',
            //   check: function () {
            //     return 1
            //   },
            //   onuse: function (result, player) {
            //     if (player.isLinked()) player.link();
            //   },
            //   onrespond: function (result, player) {
            //     if (player.isLinked()) player.link();
            //   },
            //   ai: {
            //     skillTagFilter: function (player) {
            //       return player.isLinked();
            //     },
            //     respondShan: true,
            //     basic: {
            //       useful: [7, 2],
            //       value: [7, 2],
            //     },
            //   }
            // },
            // jlsg_qingcheng_yin: {
            //   audio: "ext:极略:1",
            //   group: ['jlsg_qingcheng_yin1', 'jlsg_qingcheng_yin2'],
            // },
            // jlsg_qingcheng_yin1: {
            //   audio: "ext:极略:true",
            //   enable: ['chooseToUse', 'chooseToRespond'],
            //   filterCard: function () {
            //     return false;
            //   },
            //   selectCard: -1,
            //   viewAs: { name: 'sha' },
            //   viewAsFilter: function (player) {
            //     return player.isLinked();
            //   },
            //   prompt: '重置你的武将牌，视为打出一张【杀】',
            //   check: function () {
            //     return 1
            //   },
            //   onuse: function (result, player) {
            //     if (player.isLinked()) player.link();
            //   },
            //   onrespond: function (result, player) {
            //     if (player.isLinked()) player.link();
            //   },
            //   ai: {
            //     skillTagFilter: function (player) {
            //       return !player.isLinked();
            //     },
            //     respondSha: true,
            //     basic: {
            //       useful: [5, 1],
            //       value: [5, 1],
            //     },
            //     order: function () {
            //       if (_status.event.player.hasSkillTag('presha', true, null, true)) return 10;
            //       return 3;
            //     },


            //     result: {
            //       target: function (player, target) {
            //         if (player.hasSkill('jiu') && !target.getEquip('baiyin')) {
            //           if (get.attitude(player, target) > 0) {
            //             return -6;
            //           } else {
            //             return -3;
            //           }
            //         }
            //         return -1.5;
            //       },
            //     },
            //     tag: {
            //       respond: 1,
            //       respondShan: 1,
            //       damage: function (card) {
            //         if (card.nature == 'poison') return;
            //         return 1;
            //       },
            //       natureDamage: function (card) {
            //         if (card.nature) return 1;
            //       },
            //       fireDamage: function (card, nature) {
            //         if (card.nature == 'fire') return 1;
            //       },
            //       thunderDamage: function (card, nature) {
            //         if (card.nature == 'thunder') return 1;
            //       },
            //       poisonDamage: function (card, nature) {
            //         if (card.nature == 'poison') return 1;
            //       },
            //     },

            //   },

            // },
            // jlsg_qingcheng_yin2: {
            //   audio: "ext:极略:true",
            //   enable: ["chooseToUse", "chooseToRespond"],
            //   filterCard: function () {
            //     return false;
            //   },
            //   selectCard: -1,
            //   viewAs: { name: 'shan' },
            //   viewAsFilter: function (player) {
            //     return !player.isLinked();
            //   },
            //   prompt: '横置你的武将牌，视为打出一张【闪】',
            //   check: function () {
            //     return 1
            //   },
            //   onuse: function (result, player) {
            //     if (!player.isLinked()) player.link();
            //   },
            //   onrespond: function (result, player) {
            //     if (!player.isLinked()) player.link();
            //   },
            //   ai: {
            //     skillTagFilter: function (player) {
            //       return player.isLinked();
            //     },
            //     respondShan: true,
            //     basic: {
            //       useful: [7, 2],
            //       value: [7, 2],
            //     },
            //   }
            // },
            jlsg_aozhan: {
              audio: "ext:极略:true",
              srlose: true,
              marktext: '战',
              frequent: true,
              trigger: { player: 'damageEnd', source: 'damageEnd' },
              filter: function (event, player) {
                if (event.num <= 0) return false;
                return event.card && (event.card.name == 'sha' || event.card.name == 'juedou') && event.notLink();
              },
              init: function (player) {
                player.storage.jlsg_aozhan = [];
              },
              content: function () {
                var cards = get.cards(trigger.num);
                player.storage.jlsg_aozhan = player.storage.jlsg_aozhan.concat(cards);
                player.$gain2(cards);
                game.log(player, '将' + get.cnNumber(cards.length) + '张牌置于武将牌上');
                player.syncStorage('jlsg_aozhan');
                player.markSkill('jlsg_aozhan');
              },
              intro: {
                content: 'cards'
              },
              group: ['jlsg_aozhan2']
            },
            jlsg_aozhan2: {
              audio: "ext:极略:true",
              enable: 'phaseUse',
              usable: 1,
              filter: function (event, player) {
                return player.storage.jlsg_aozhan.length;
              },
              content: function () {
                'step 0'
                player.chooseControl('收入手牌', '置入弃牌堆', ui.create.dialog('战', player.storage.jlsg_aozhan)).ai = function (event, player) {
                  var value = 0, i;
                  var cards = player.storage.jlsg_aozhan;
                  for (i = 0; i < cards.length; i++) {
                    value += get.value(cards[i]);
                    if (jlsg.isWeak(player) && get.tag(cards[i], 'save')) value += get.value(cards[i]);
                  }
                  value /= player.storage.jlsg_aozhan.length;
                  if (value > 4) return '收入手牌';
                  return '置入弃牌堆';
                }
                'step 1'
                var cards = [];
                while (player.storage.jlsg_aozhan.length) {
                  cards = cards.concat(player.storage.jlsg_aozhan.shift());
                }
                if (result.control == '置入弃牌堆') {
                  player.discard(cards);
                  player.draw(cards.length);
                } else {
                  game.log(player, '获得了', cards);
                  player.gain(cards, 'gain2');
                }
                player.syncStorage('jlsg_aozhan');
                if (!player.storage.jlsg_aozhan.length) {
                  player.unmarkSkill('jlsg_aozhan');
                }
              },
              ai: {
                order: 1,
                result: {
                  player: function (player) {
                    if (player.storage.jlsg_aozhan.length >= 2) return 1;
                    if (player.hp + player.countCards('h') <= 3) return 0.5;
                    return 0;
                  }
                }
              }
            },
            jlsg_huxiao: {
              audio: "ext:极略:true",
              srlose: true,
              trigger: { source: 'damageBegin1' },
              filter: function (event, player) {
                return !player.isTurnedOver() && player.isPhaseUsing() && event.card && event.card.name == 'sha'; // && event.notLink();
              },
              priority: 10,
              check: function (event, player) {
                if (!event.player) return -1;
                if (get.attitude(player, event.player) > 0) return false;
                if (event.player.hasSkillTag('filterDamage')) return false;
                if (event.player.hasSkillTag('filterDamage', null, {
                  player: player,
                  card: event.card,
                })) {
                  return -10;
                }
                var e2 = event.player.get('e', '2');
                if (e2) {
                  if (e2.name == 'tengjia') {
                    if (event.nature == 'fire') return 10;
                  }
                }
                if (event.player.hasSkill('kuangfeng2') && event.nature == 'fire') return 10;
                //game.log(get.damageEffect(event.player,player,player,event.nature));
                return get.damageEffect(event.player, player, player, event.nature);
              },
              content: function () {
                trigger.num++;
                player.draw();
                player.addTempSkill('jlsg_huxiao2', 'shaAfter');
              }
            },
            jlsg_old_huxiao: {
              audio: "ext:极略:true",
              srlose: true,
              trigger: { source: 'damageBegin1' },
              filter: function (event, player) {
                return !player.isTurnedOver() && player.isPhaseUsing() && event.card && event.card.name == 'sha';
              },
              priority: 10,
              check: function (event, player) {
                if (!event.player) return -1;
                if (get.attitude(player, event.player) > 0) return false;
                if (event.player.hasSkillTag('filterDamage', null, {
                  player: player,
                  card: event.card,
                })) {
                  return -10;
                }
                var e2 = event.player.get('e', '2');
                if (e2) {
                  if (e2.name == 'tengjia') {
                    if (event.nature == 'fire') return 10;
                  }
                }
                if (event.player.hasSkill('kuangfeng2') && event.nature == 'fire') return 10;
                //game.log(get.damageEffect(event.player,player,player,event.nature));
                return get.damageEffect(event.player, player, player, event.nature);
              },
              content: function () {
                trigger.num++;
                player.draw(3);
                player.addTempSkill('jlsg_huxiao2', 'shaAfter');
              }
            },
            jlsg_huxiao2: {
              audio: false,
              trigger: { player: 'shaEnd' },
              forced: true,
              popup: false,
              content: function () {
                var evt = _status.event;
                for (var i = 0; i < 10; i++) {
                  if (evt && evt.getParent) {
                    evt = evt.getParent();
                  }
                  if (evt.name == 'phaseUse') {
                    evt.skipped = true;
                    break;
                  }
                }
                player.turnOver();
                player.skip('phaseDiscard');
              }
            },
            jlsg_guicai: {
              audio: "ext:极略:1",
              srlose: true,
              trigger: { global: 'judge' },
              check: function (event, player) {
                var judge = event.judge(event.player.judging[0]);
                if (get.attitude(player, event.player) < 0) return judge > 0;
                if (get.attitude(player, event.player) > 0) return judge < 0;
                return 0;
              },
              content: function () {
                "step 0"
                player.chooseCard(get.translation(trigger.player) + '的' + (trigger.judgestr || '') + '判定为' +
                  get.translation(trigger.player.judging[0]) + '，打出一张手牌代替之或亮出牌顶的一张牌代替之').set('ai', function (card) {
                    var trigger = _status.event.getParent()._trigger;
                    var player = _status.event.player;
                    var judging = _status.event.judging;
                    var result = trigger.judge(card) - trigger.judge(judging);
                    var attitude = get.attitude(player, trigger.player);
                    if (attitude == 0 || result == 0) return 0;
                    if (attitude > 0) {
                      return result - get.value(card) / 2;
                    } else {
                      return -result - get.value(card) / 2;
                    }
                  }).set('judging', trigger.player.judging[0]);
                "step 1"
                if (result.bool) {
                  event.cards = result.cards;
                } else {
                  event.cards = get.cards();
                  game.log(get.translation(player) + '亮出了牌堆顶的' + get.translation(event.cards));
                  player.showCards(event.cards);
                  // game.cardsGotoOrdering(event.cards).relatedEvent=trigger;
                }
                trigger.orderingCards.addArray(event.cards);
                player.respond(event.cards, 'highlight', 'noOrdering');
                "step 2"
                if (result.bool) {
                  if (trigger.player.judging[0].clone) {
                    trigger.player.judging[0].clone.classList.remove('thrownhighlight');
                    game.addVideo('deletenode', player, get.cardsInfo([trigger.player.judging[0].clone]));
                  }
                  // ui.discardPile.appendChild(trigger.player.judging[0]);
                  trigger.player.judging[0] = result.cards[0];
                  // if (!get.owner(result.cards[0], 'judge')) {
                  //   trigger.position.appendChild(result.cards[0]);
                  // }
                  // game.log(trigger.player, '的判定牌改为', result.cards[0]);
                  game.delayx(2);
                } else {
                  if (trigger.player.judging[0].clone) {
                    trigger.player.judging[0].clone.classList.remove('thrownhighlight');
                    game.addVideo('deletenode', player, get.cardsInfo([trigger.player.judging[0].clone]));
                  }
                  // ui.discardPile.appendChild(trigger.player.judging[0]);
                  trigger.player.judging[0] = event.cards[0];
                  // if (!get.owner(event.cards[0], 'judge')) {
                  //   trigger.position.appendChild(event.cards[0]);
                  // }
                  // game.log(trigger.player, '的判定牌改为', event.cards[0]);
                }
              },
              ai: {
                tag: {
                  rejudge: 1,
                }
              }
            },
            jlsg_langgu: {
              audio: "ext:极略:true",
              srlose: true,
              trigger: { player: 'damageEnd' },
              check: function (event, player) {
                return event.source && get.attitude(player, event.source) <= 0;
              },
              filter: function (event, player) {
                return event.source != undefined && event.source.countCards("he") > 0;
              },
              logTarget: 'source',
              content: function () {
                "step 0"
                player.judge(function (card) {
                  if (get.color(card) == 'black') return 2;
                  return -2;
                }).judge2 = result => result.bool;
                "step 1"
                if (result.bool && trigger.source.countCards('he')) {
                  player.gainPlayerCard(trigger.source, 'he', true);
                }
              },
              ai: {
                expose: 0.2,
                effect: {
                  target: function (card, player, target) {
                    if (player.hasSkill('jueqing')) return [1, -1.5];
                    if (get.tag(card, 'damage') && Math.random() < 0.5) {
                      if (get.attitude(target, player) < 0) return [1, 0, 0, -1.5];
                    }
                  }
                }
              },
              group: ['jlsg_langgu2']
            },
            jlsg_langgu2: {
              audio: "ext:极略:true",
              trigger: { source: 'damageEnd' },
              check: function (event, player) {
                return get.attitude(player, event.player) <= 0;
              },
              filter: function (event, player) {
                return event.player != undefined && event.player.countCards("he") > 0;
              },
              prompt: function (event, player) {
                var str = '';
                str += '是否对' + get.translation(event.player) + '发动【狼顾】？';
                return str;
              },
              content: function () {
                "step 0"
                player.judge(function (card) {
                  if (get.color(card) == 'black') return 2;
                  return -2;
                }).judge2 = result => result.bool;
                "step 1"
                if (result.bool && trigger.player.countCards('he')) {
                  player.gainPlayerCard(trigger.player, 'he', true);
                }
              },
              ai: {
                expose: 0.2,
                effect: {
                  target: function (card, player, target) {
                    if (player.hasSkill('jueqing')) return [1, -1.5];
                    if (get.tag(card, 'damage') && Math.random() < 0.5) {
                      if (get.attitude(target, player) < 0) return [1, 0, 0, -1.5];
                    }
                  }
                }
              },
            },
            jlsg_zhuizun: {
              audio: "ext:极略:true",
              srlose: true,
              enable: 'chooseToUse',
              mark: true,
              unique: true,
              limited: true,
              skillAnimation: true,
              animationStr: '追尊',
              animationColor: 'water',
              init: function (player) {
                player.storage.jlsg_zhuizun = false;
              },
              filter: function (event, player) {
                if (event.type != 'dying') return false;
                if (player != event.dying) return false;
                if (player.storage.jlsg_zhuizun) return false;
                return true;
              },
              content: function () {
                'step 0'
                player.awakenSkill('jlsg_zhuizun');
                player.storage.jlsg_zhuizun = true;
                player.addSkill('jlsg_zhuizun2');
                if (player.hp < 1) {
                  player.recover(1 - player.hp);
                }
                'step 1'
                var targets = game.players.slice(0);
                targets.remove(player);
                targets.sort(lib.sort.seat);
                event.targets = targets;
                'step 2'
                if (event.targets.length) {
                  event.target = event.targets.shift();
                } else {
                  event.finish();
                }
                'step 3'
                if (event.target.countCards('h')) {
                  event.target.chooseCard('选择一张手牌交给' + get.translation(player), true).ai = function (card) {
                    return -get.value(card);
                  }
                } else {
                  event.goto(2);
                }
                'step 4'
                if (result.bool) {
                  player.gain(result.cards[0]);
                  target.$give(1, player);
                }
                event.goto(2);
              },
              ai: {
                order: 1,
                skillTagFilter: function (player) {
                  if (player.storage.jlsg_zhuizun) return false;
                  if (player.hp > 0) return false;
                },
                save: true,
                result: {
                  player: 10
                },
                threaten: function (player, target) {
                  if (!target.storage.jlsg_zhuizun) return 0.6;
                }
              },
              intro: {
                content: 'limited'
              }
            },
            jlsg_zhuizun2: {
              trigger: { global: 'phaseAfter' },
              forced: true,
              audio: false,
              content: function () {
                player.removeSkill('jlsg_zhuizun2');
                player.phase();
              }
            },
            jlsg_tianshang: {
              audio: "ext:极略:true",
              srlose: true,
              unique: true,
              trigger: { player: 'die' },
              forceDie: true,
              direct: true,
              limited: true,
              skillAnimation: true,
              animationColor: 'thunder',
              content: function () {
                "step 0"
                player.chooseTarget('是否发动【天殇】？', function (card, player, target) {
                  return player != target;
                }).ai = function (target) {
                  var num = get.attitude(player, target);
                  if (num > 0) {
                    if (target.isDamaged() && target.hasSkills(jlsg.ai.skill.need_maxhp)) return 5;
                    if (jlsg.isWeak(target)) return 3;
                    if (target.isDamaged()) return 2;
                    return 1;
                  }
                  return 0;
                };
                "step 1"
                if (!result.bool) {
                  event.finish(); return;
                }
                player.line(target, 'green');
                event.target = result.targets[0];
                player.logSkill('jlsg_tianshang', event.target);
                if (player.hasSkill('jlsg_huiqu')) {
                  event.target.addSkill('jlsg_huiqu');
                }
                if (player.hasSkill('jlsg_old_yiji')) {
                  event.target.addSkill('jlsg_old_yiji');
                }
                if (player.hasSkill('jlsg_yiji')) {
                  event.target.addSkill('jlsg_yiji');
                }
                "step 2"
                event.target.gainMaxHp();
                event.target.recover();
              },
              ai: {
                expose: 0.5,
              },
            },
            jlsg_yiji: {
              audio: "ext:极略:true",
              srlose: true,
              inherit: 'yiji'
            },
            jlsg_old_yiji: {
              audio: "ext:极略:true",
              srlose: true,
              trigger: {
                player: "damageEnd",
              },
              filter: function (event) {
                return (event.num > 0);
              },
              content: function () {
                "step 0"
                event.num = trigger.num;
                event.targets = [];
                "step 1"
                if (event.num > 0) {
                  event.num--;
                  event.cards = get.cards(2);
                } else {
                  event.finish();
                }
                "step 2"
                if (event.cards.length > 1) {
                  player.chooseCardButton('将［遗计］牌分配给任意角色', true, event.cards, [1, event.cards.length]);
                } else if (event.cards.length == 1) {
                  event._result = { links: event.cards.slice(0), bool: true };
                } else {
                  event.goto(5);
                  return;
                }
                "step 3"
                if (result.bool) {
                  for (var i = 0; i < result.links.length; i++) {
                    event.cards.remove(result.links[i]);
                  }
                  event.togive = result.links.slice(0);
                  player.chooseTarget('将' + get.translation(result.links) + '交给一名角色', true);
                }
                "step 4"
                if (result.targets.length) {
                  if (!event.targets.contains(result.targets[0])) {
                    event.targets.add(result.targets[0]);
                  }
                  result.targets[0].gain(event.togive, 'draw');
                  player.line(result.targets[0], 'green');
                  game.log(result.targets[0], '获得了' + get.cnNumber(event.togive.length) + '张牌');
                  event.goto(2);
                }
                "step 5"
                if (event.targets.length == 1) {
                  event.goto(6);
                  return;
                } else {
                  if (event.num > 0) {
                    event.goto(1);
                  } else {
                    event.finish();
                  }
                }
                "step 6"
                player.judge(function (card) {
                  if (get.suit(card) == 'heart') return 2;
                  return -2;
                }).judge2 = result => result.bool;
                "step 7"
                if (result.bool) {
                  player.recover();
                }
              },
              ai: {
                maixie: true,
                "maixie_hp": true,
                effect: {
                  target: function (card, player, target) {
                    if (get.tag(card, 'damage')) {
                      if (player.hasSkillTag('jueqing', false, target)) return [1, -2];
                      if (!target.hasFriend()) return;
                      var num = 1;
                      if (get.attitude(player, target) > 0) {
                        if (player.needsToDiscard()) {
                          num = 0.7;
                        } else {
                          num = 0.5;
                        }
                      }
                      if (target.hp >= 4) return [1, num * 2];
                      if (target.hp == 3) return [1, num * 1.5];
                      if (target.hp == 2) return [1, num * 0.5];
                    }
                  },
                },
              },
            },
            jlsg_huiqu: {
              audio: "ext:极略:1",
              srlose: true,
              trigger: { player: 'phaseZhunbeiBegin' },
              filter: function (event, player) {
                return player.countDiscardableCards(player, 'h');
              },
              direct: true,
              content: function () {
                'step 0'
                var check = player.canMoveCard(true);
                var next = player.chooseToDiscard('是否弃置一张手牌发动【慧觑】？');
                next.set('ai', function (card) {
                  if (check) {
                    return 8 - get.value(card);
                  }
                  return 4 - get.value(card);
                });
                next.logSkill = 'jlsg_huiqu';
                'step 1'
                if (result.bool) {
                  player.judge(function (card) {
                    if (get.color(card) == 'red') return (player.canMoveCard(true)) ? 1.5 : 0;
                    return 1;
                  });
                } else {
                  event.finish();
                }
                'step 2'
                if (result.color) {
                  event.result = result.color;
                  if (result.color == 'red') {
                    player.moveCard();
                    event.finish();
                  } else {
                    player.chooseTarget('选择一名目标对其造成1点伤害，然后摸一张牌。', true).ai = function (target) {
                      return get.damageEffect(target, player, player) + 2;
                    }
                  }
                }
                'step 3'
                if (result.bool) {
                  player.line(result.targets[0]);
                  result.targets[0].damage(player);
                  player.draw();
                }
                // player.line2(result.targets);
                // event.targets = result.targets;
              },
            },
            jlsg_jiwu: {
              audio: "ext:极略:true",
              srlose: true,
              enable: 'phaseUse',
              usable: 1,
              // filter: function (event, player) {
              //   return player.countCards('h') != 1;
              // },
              filterCard: true,
              selectCard: function () {
                return Math.min(1, _status.event.player.countCards('h') - 1);
              },
              check: function (event) {
                var player = _status.event.player;
                if (player.countCards('h') > player.maxHp) return false;
                if (!player.hasSha()) return false;
                return game.hasPlayer(function (current) {
                  return get.attitude(player, current) < 0 && player.canUse('sha', current);
                });
              },
              discard: false,
              lose: false,
              prompt: "选择保留的手牌",
              content: function () {
                'step 0'
                if (cards[0]) {
                  player.discard(player.getCards('h').remove(cards[0]));
                } else if (player.countCards('h') == 0) {
                  player.draw();
                }
                'step 1'
                player.addSkill('jlsg_jiwu_buff1');
                player.addSkill('jlsg_jiwu_buff2');
                player.addTempSkill('jlsg_jiwu_buff3', 'phaseAfter');

              },
              mod: {
                selectTarget: function (card, player, range) {
                  if (card.name != 'sha') return;
                  if (range[1] == -1) return;
                  if (player.countCards('e') != 0) {
                    if (!card.cards || player.countCards('e', eCard => !card.cards.contains(eCard))) {
                      return;
                    }
                  }
                  range[1] += 2;
                }
              },
              subSkill: {
                buff1: {
                  audio: "ext:极略:true",
                  trigger: { source: 'damageBegin' },
                  filter: function (event) {
                    return event.card && event.card.name == 'sha' && event.notLink();
                  },
                  forced: true,
                  content: function () {
                    trigger.num++;
                  }
                },
                buff2: {
                  //audio:"ext:极略:true",
                  trigger: { player: 'useCardAfter', global: 'phaseAfter' },
                  priority: 2,
                  filter: function (event) {
                    if (event.name == 'useCard') return (event.card && (event.card.name == 'sha'));
                    return true;
                  },
                  forced: true,
                  popup: false,
                  content: function () {
                    player.removeSkill('jlsg_jiwu_buff1');
                    player.removeSkill('jlsg_jiwu_buff2');
                  },
                },
                buff3: {
                  mod: {
                    attackFrom: function () {
                      return -Infinity;
                    }
                  }
                }
              },
              ai: {
                order: function () {
                  return lib.card.sha.ai.order + 0.1;
                },
                result: {
                  player: function (player, target) {
                    if (player.countCards('h') == 0) return 1;
                    if (player.hasSkill('jiu') || player.hasSkill('tianxianjiu')) return 3;
                    return 4 - player.countCards('h');
                  }
                },
                effect: {
                  target: function (card, player, target) {
                    if (get.subtype(card) == 'equip1') {
                      var num = 0;
                      for (var i = 0; i < game.players.length; i++) {
                        if (get.attitude(player, game.players[i]) < 0) {
                          num++;
                          if (num > 1) return [0, 0, 0, 0];
                        }
                      }
                    }
                  }
                }
              }
            },
            jlsg_sheji: {
              audio: "ext:极略:true",
              srlose: true,
              trigger: { global: 'damageEnd' },
              filter: function (event, player) {
                return player.countDiscardableCards(player, 'he') &&
                  event.source && event.source.get('e', '1') &&
                  event.source != player;
              },
              check: function (event, player) {
                return get.attitude(player, event.source) <= 0;
              },
              direct: true,
              content: function () {
                'step 0'
                event.card = trigger.source.get('e', '1');
                if (!event.card) {
                  event.finish(); return;
                }
                var prompt = `###是否发动【射戟】？###弃置一张牌获得${get.translation(trigger.source)}的${get.translation(event.card)}`;
                var next = player.chooseToDiscard('he', prompt);
                next.logSkill = ['jlsg_sheji', trigger.source];
                next.set("ai", function (card) {
                  if (get.attitude(player, trigger.source) < 0) {
                    return 6 - get.value(card);
                  }
                  return 0;
                });
                'step 1'
                if (result.bool) {
                  trigger.source.$give(event.card, player);
                  player.gain(event.card);
                }
              },
              group: ['jlsg_sheji2', 'jlsg_sheji_wushuang'],
              subSkill: {
                wushuang: {
                  audio: false,
                  trigger: { player: 'useCardToPlayered' },
                  forced: true,
                  filter: function (event, player) {
                    return event.card.name == 'sha' && !event.getParent().directHit.contains(event.target) && event.parent.skill == 'jlsg_sheji2';
                  },
                  logTarget: 'target',
                  content: function () {
                    var id = trigger.target.playerid;
                    var map = trigger.getParent().customArgs;
                    if (!map[id]) map[id] = {};
                    if (typeof map[id].shanRequired == 'number') {
                      map[id].shanRequired++;
                    } else {
                      map[id].shanRequired = 2;
                    }
                  }
                }
              }
            },
            jlsg_sheji2: {
              audio: "ext:极略:true",
              enable: ['chooseToUse', 'chooseToRespond'],
              filterCard: { type: 'equip' },
              viewAs: { name: 'sha' },
              viewAsFilter: function (player) {
                return player.countCards('he', { type: 'equip' }) != 0;
              },
              position: 'he',
              prompt: '将一张装备牌当【杀】使用或打出',
              check: function (card) {
                if (get.subtype(card) == 'equip1') return 10 - get.value(card);
                return 7 - get.equipValue(card);
              },
              mod: {
                targetInRange: function (card) {
                  if (_status.event.skill == 'jlsg_sheji2') return true;
                }
              },
              ai: {
                order: function () {
                  return lib.card.sha.ai.order + 0.1;
                },
                respondSha: true,
                skillTagFilter: function (player) {
                  if (!player.countCards('he')) return false;
                }
              }
            },
            jlsg_xingyi: {
              audio: "ext:极略:1",
              enable: 'phaseUse',
              usable: 1,
              srlose: true,
              filterTarget: function (card, player, target) {
                return target.countCards('h') > 0 && player != target;
              },
              content: function () {
                if (target.countCards('h') > 0) {
                  player.gainPlayerCard(target, true, 'h');
                }
                target.recover();
              },
              ai: {
                order: 2,
                result: {
                  player: function (card, player, target) {
                    if (jlsg.needKongcheng(player, true)) return -1;
                    return 1;
                  },
                  target: function (player, target) {
                    if (jlsg.needKongcheng(target) && target.countCards('h') == 1) return 5;
                    if (target.countCards('h') > target.hp && target.isDamaged()) return 4;
                    if (jlsg.isWeak(target)) return 2;
                    if (target.isDamaged()) return 1;
                    if (!jlsg.hasLoseHandcardEffective(target) && target.isDamaged()) return 1;
                    if (target.hp == jlsg.getBestHp(target)) return -0.1;
                    if (!target.isDamaged() && jlsg.hasLoseHandcardEffective(target)) return -1;
                    return 0;
                  }
                },
                threaten: 2
              }
            },
            jlsg_guagu: {
              audio: "ext:极略:1",
              srlose: true,
              trigger: { global: 'dying' },
              priority: 6,
              filter: function (event, player) {
                return event.player.hp <= 0 && event.player.countCards('h') != 0;
              },
              logTarget: 'player',
              check: function (event, player) {
                var att = get.attitude(player, event.player);
                var num = event.player.countCards('h');
                if (att > 0 && event.player.hasSkillTag('nosave')) {
                  return false;
                }
                if (num < 3) {
                  return att > 0;
                }
                if (num > 4) {
                  return att < 0;
                }
                return [true, false].randomGet();
              },
              content: function () {
                "step 0"
                var cards = trigger.player.getCards('h');
                event.bool = cards.length >= 2;
                trigger.player.discard(cards);
                trigger.player.recover();
                "step 1"
                if (event.bool) {
                  trigger.player.draw();
                }
              },
              ai: {
                expose: 0.2,
                threaten: 1.5,
                // save:true,
                // skillTagFilter:function(player,tag,target){
                //   debugger;
                //   return target.countCards('h');
                // },
              }
            },
            jlsg_wuqin: {
              audio: "ext:极略:1",
              srlose: true,
              trigger: { player: 'phaseJieshuEnd' },
              filter: function (event, player) {
                return player.countCards('h', { type: 'basic' }) > 0;
              },
              direct: true,
              content: function () {
                'step 0'
                player.chooseToDiscard('是否发动【五禽】？', function (card) {
                  return get.type(card) == 'basic';
                }).ai = function (card) {
                  if (jlsg.needKongcheng(player) && player.countCards('h') == 1) return 10 - get.value(card);
                  return 5 - get.useful(card);
                }
                'step 1'
                if (result.bool) {
                  player.chooseControlList([
                    "摸两张牌",
                    "额外出牌阶段"
                  ], true).set('ai', function (event, player) {
                    if (player.num('h') > 2) return 1;
                    if (jlsg.needKongcheng(player, true)) return 1;
                    return 0;
                  });
                } else {
                  event.finish();
                }
                'step 2'
                player.logSkill("jlsg_wuqin");
                if (result.index == 0) {
                  player.draw(2);
                } else {
                  player.getStat().card = {};
                  player.getStat().skill = {};
                  player.phaseUse();
                }
              }
            },
            jlsg_lijian: {
              audio: "ext:极略:2",
              srlose: true,
              enable: 'phaseUse',
              usable: 1,
              filter: function (event, player) {
                return game.countPlayer(function (current) {
                  return current != player && current.hasSex('male');
                }) > 1;
              },
              check: function (card) {
                return 10 - get.value(card)
              },
              filterCard: true,
              position: 'he',
              filterTarget: function (card, player, target) {
                if (player == target) return false;
                if (!target.hasSex('male')) return false;
                if (ui.selected.targets.length == 1) {
                  return target.canUse({ name: 'juedou' }, ui.selected.targets[0]);
                }
                return true;
              },
              targetprompt: ['先出杀', '后出杀'],
              selectTarget: 2,
              multitarget: true,
              content: function () {
                targets[1].useCard({
                  name: 'juedou',
                  isCard: true
                }, 'nowuxie', targets[0], 'noai').animate = false;
                game.delay(0.5);
              },
              ai: {
                order: 8,
                result: {
                  target: function (player, target) {
                    if (ui.selected.targets.length == 0) {
                      return -3;
                    } else {
                      return get.effect(target, { name: 'juedou' }, ui.selected.targets[0], target);
                    }
                  }
                },
                expose: 0.4,
                threaten: 3,
              }
            },
            jlsg_manwu: {
              audio: "ext:极略:1",
              srlose: true,
              enable: 'phaseUse',
              usable: 1,
              filter: function (event, player) {
                return player.countCards('h') > 0;
              },
              filterTarget: function (card, player, target) {
                if (!target.hasSex('male')) return false;
                return target.countCards('h') && player != target;
              },
              content: function () {
                event.card = target.get('h').randomGet();
                player.showCards(event.card);
                if (get.suit(event.card) == 'diamond') {
                  target.addJudge('lebu', event.card);
                  target.$give(event.card, target);
                } else {
                  player.gain(event.card).set('visible', true);
                  target.$give(event.card, player);
                }
              },
              ai: {
                order: 9,
                result: {
                  // player: function (card, player, target) {
                  // },
                  target: function (target, player) {
                    return get.effect(target, { name: 'lebu' }, player, target);
                  },
                  player: 1,
                }
              }
            },
            jlsg_baiyue: {
              audio: "ext:极略:2",
              srlose: true,
              forced: true,
              popup: false,
              silent: true,
              marktext: "拜",
              intro: {
                content: 'cards',
              },
              init: function (player) {
                player.storage.jlsg_baiyue = [];
              },
              trigger: { global: ["loseAfter", "cardsDiscardAfter"] },
              filter: function (event, player) {
                if (_status.currentPhase != player) return false;
                var p;
                if (event.player) {
                  if (event.player == player) return false;
                } else {
                  var evt = event.getParent();
                  if (!(evt.name == 'orderingDiscard' && evt.relatedEvent && evt.relatedEvent.player !== player)) { // && ['useCard','respond'].contains(evt.relatedEvent.name)
                    return false;
                  }
                }
                return (event.cards2 || event.cards).some(c => get.position(c, true) == 'd');
              },
              content: function () {
                player.markAuto("jlsg_baiyue", (trigger.cards2 || trigger.cards).filterInD('d'));
                player.addTempSkill('jlsg_baiyue_phaseEnd');
              },
              subSkill: {
                phaseEnd: {
                  audio: 'jlsg_baiyue',
                  onremove: function (player) {
                    player.storage.jlsg_baiyue = [];
                    player.unmarkSkill("jlsg_baiyue");
                  },
                  trigger: { player: 'phaseJieshuBegin' },
                  filter: function (event, player) {
                    return player.getStorage('jlsg_baiyue').filterInD('d').length;
                  },
                  direct: true,
                  content: function () {
                    'step 0'
                    player.chooseCardButton('是否发动【拜月】？', player.getStorage('jlsg_baiyue').filterInD('d')).ai = function (button) {
                      return get.value(button.link);
                    }
                    'step 1'
                    if (result.bool) {
                      player.logSkill('jlsg_baiyue');
                      player.unmarkAuto('jlsg_baiyue', [result.buttons[0].link]);
                      player.gain(result.buttons[0].link);
                      player.$gain(result.buttons[0].link);
                    }
                  },
                }
              }
            },
            // jlsg_baiyue: {
            //   audio: "ext:极略:2",
            //   srlose: true,
            //   trigger: { player: 'phaseEnd' },
            //   filter: function (event, player) {
            //     return player.storage.jlsg_baiyue.length;
            //   },
            //   direct: true,
            //   content: function () {
            //     'step 0'
            //     player.chooseCardButton('是否发动【拜月】？', player.storage.jlsg_baiyue, true).ai = function (button) {
            //       return get.value(button.link);
            //     }
            //     'step 1'
            //     if (result.bool) {
            //       player.logSkill('jlsg_baiyue');
            //       player.storage.jlsg_baiyue.remove(result.buttons[0].link);
            //       player.gain(result.buttons[0].link);
            //       player.$gain(result.buttons[0].link);
            //     }
            //     player.storage.jlsg_baiyue = [];
            //   },
            //   group: ['jlsg_baiyue_countGeneral'],
            //   subSkill: {
            //     countGeneral: {
            //       trigger: { global: ['useCardAfter', 'respondAfter', 'discardAfter'] },
            //       forced: true,
            //       popup: false,
            //       filter: function (event, player) {
            //         if (_status.currentPhase != player) return false;
            //         //if(event.player==player) return false;
            //         if (event.cards) {
            //           for (var i = 0; i < event.cards.length; i++) {
            //             if (event.cards[i].position != 'd')
            //               return true;
            //           }
            //         }
            //         return false;
            //       },
            //       content: function () {
            //         for (var i = 0; i < trigger.cards.length; i++) {
            //           if (get.position(trigger.cards[i]) == 'd') {
            //             player.storage.jlsg_baiyue = player.storage.jlsg_baiyue.concat(trigger.cards[i]);
            //           }
            //         }
            //       }
            //     },
            //   },
            //   init: function (player) {
            //     player.storage.jlsg_baiyue = [];
            //   }
            // },
            jlsg_yinmeng: {
              audio: "ext:极略:1",
              srlose: true,
              enable: 'phaseUse',
              group: ['jlsg_yinmeng2'],
              filter: function (event, player) {
                return player.countCards('h') && (player.storage.jlsg_yinmeng < Math.max(1, player.getDamagedHp()));
              },
              filterTarget: function (card, player, target) {
                return target.hasSex('male') && target.countCards('h') && player != target;
              },
              content: function () {
                'step 0'
                player.storage.jlsg_yinmeng++;
                'step 1'
                event.card = target.get('h').randomGet();
                //target.$phaseJudge(event.card);
                target.showCards(event.card);
                player.chooseCard(get.translation(target) + '展示的牌是' + get.translation(event.card) + ',请选择你展示的牌', true).ai = function (card) {
                  if (ai.get.attitude(player, target) > 0) return (get.type(event.card, 'trick') == get.type(card, 'trick'));
                  return (get.type(event.card, 'trick') != get.type(card, 'trick'));
                }
                'step 2'
                player.showCards(result.cards[0]);
                if (get.type(result.cards[0], 'trick') == get.type(event.card, 'trick')) {
                  game.asyncDraw([player, target]);
                }
                else {
                  target.discard(event.card);
                }
              },
              ai: {
                order: 4,
                result: {
                  player: 0.5,
                  target: function (player, target) {
                    var suits = player.getCards('h').map(card => get.type(card, 'trick'));
                    var num = new Set(suits).size;
                    var m = num / 3;
                    if (get.attitude(player, target) > 0 && Math.random() < m) return 1;
                    if (get.attitude(player, target) < 0 && Math.random() < m) return -1;
                    return 0;
                  }
                }
              },
            },
            jlsg_yinmeng2: {
              trigger: { player: 'phaseBefore' },
              forced: true,

              silent: true,
              popup: false,
              priority: 10,
              content: function () {
                player.storage.jlsg_yinmeng = 0;
              }
            },
            jlsg_xianger: {
              audio: "ext:极略:1",
              srlose: true,
              trigger: {
                global: "phaseBegin",
              },
              filter: function (event, player) {
                return event.player.sex == 'male' && event.player != player && player.countCards('h', { type: 'basic' }) > 1 && !event.player.hasSkill("jlsg_xianger2");
              },
              check: function (event, player) {
                if (get.attitude(player, event.player) > 0 && event.player.hasJudge('lebu')) return 1;
                if (get.attitude(player, event.player) > 0 && event.player.hasJudge('bingliang')) return 1;
                if (get.attitude(player, event.player) < 0 && event.player.hp == 1) return 1;
                return 0;
              },
              content: function () {
                "step 0"
                player.chooseCard(2, 'h', function (card) {
                  return get.type(card) == 'basic';
                }, '交给' + get.translation(trigger.player) + '两张基本牌', true).set('ai', function (card) {
                  return 7 - get.value(card);
                });
                "step 1"
                if (result.bool) {
                  player.$give(2, trigger.player);
                  trigger.player.gain(result.cards, player);
                  trigger.player.skip('phaseUse');
                  trigger.player.chooseBool('是否视为对' + get.translation(player) + '使用一张【杀】').set('ai', function (event, player) {
                    if (get.attitude(player, trigger.player) < 0 || player == 1) return 1;
                    if (get.attitude(player, trigger.player) < 0 || trigger.player == 1) return 0;
                    if (get.effect(player, { name: 'sha' }, trigger.player, trigger.player) < 0 && get.attitude(player, trigger.player) < 0) return 1;
                    if (get.effect(player, { name: 'sha' }, trigger.player, trigger.player) > 0 && get.attitude(player, trigger.player) > 0) return 0;
                    return 0;
                  });
                } else {
                  event.finish();
                }
                "step 2"
                if (result.bool) {
                  trigger.player.useCard({ name: 'sha' }, player);
                } else {
                  trigger.player.storage.jlsg_xianger2 = player;
                  trigger.player.addSkill("jlsg_xianger2");
                }
                "step 3"
                if (!trigger.player.getStat("damage")) {
                  trigger.player.skip('phaseDiscard');
                  player.draw();
                }
              },
            },
            jlsg_xianger2: {
              trigger: {
                player: "phaseUseBegin",
              },
              unique: true,
              forced: true,
              mark: true,
              marktext: "饵",
              intro: {
                content: function (player) {
                  return "回合开始受到1点伤害";
                },
              },
              content: function () {
                player.damage(1, player.storage.jlsg_xianger2);
                player.line(player.storage.jlsg_xianger2, 'red');
                player.removeSkill('jlsg_xianger2');
              },
            },
            jlsg_juelie: {
              audio: "ext:极略:1",
              srlose: true,
              enable: 'phaseUse',
              usable: 1,
              filterTarget: function (card, player, target) {
                return target.countCards('h') != player.countCards('h');
              },
              content: function () {
                'step 0'
                var prompt = `选择将手牌数调整至${get.cnNumber(player.countCards('h'))}张，或令${get.translation(player)}视为对你使用一张杀`;
                target.chooseControl('调整手牌', '对你出杀').set('ai', function () {
                  if (target.countCards('h') > player.countCards('h') && target.countCards('h', 'shan')) return '对你出杀';
                  if (target.countCards('h') < player.countCards('h')) return '调整手牌';
                  if (target.countCards('h') - player.countCards('h') >= 2) return '对你出杀';
                  if (get.effect(target, { name: 'sha' }, player, target) > 0) return '对你出杀';
                  return '调整手牌';
                }).set('prompt', prompt);
                'step 1'
                if (result.control == '调整手牌') {
                  if (target.countCards('h') > player.countCards('h')) {
                    target.chooseToDiscard(target.countCards('h') - player.countCards('h'), true);
                  } else {
                    target.draw(player.countCards('h') - target.countCards('h'));
                  }
                } else {
                  player.useCard({ name: 'sha' }, target, false);
                }
              },
              ai: {
                threaten: 2,
                order: 12,
                result: {
                  target: function (player, target) {
                    return (player.countCards('h') - target.countCards('h'));
                  }
                }
              }
            },
            jlsg_xiwu: {
              audio: "ext:极略:true",
              srlose: true,
              trigger: { player: 'shaMiss' },
              priority: -1,
              check: function (event, player) {
                return get.attitude(player, event.target) < 2;
              },
              content: function () {
                player.draw();
                if (trigger.target.countCards('h')) {
                  player.discardPlayerCard(trigger.target, 'h', true);
                }
              }
            },
            jlsg_fangxin: {
              audio: "ext:极略:2",
              srlose: true,
              enable: 'chooseToUse',
              discard: false,
              prepare: function (cards, player) {
                player.$give(cards, player);
              },
              filter: function (event, player) {
                if (event.type == 'dying') {
                  return event.filterCard({ name: 'tao' }, player) && ((!player.hasJudge('lebu') && player.countCards('he', { suit: 'diamond' })) || (!player.hasJudge('bingliang') && player.countCards('he', { suit: 'club' })));
                }
                if (event.parent.name != 'phaseUse') return false;
                if (!lib.filter.filterCard({ name: 'tao' }, player, event)) {
                  return false;
                }
                return player.isDamaged() && ((!player.hasJudge('lebu') && player.countCards('he', { suit: 'diamond' })) || (!player.hasJudge('bingliang') && player.countCards('he', { suit: 'club' })));
              },
              position: 'he',
              filterCard: function (card, player, target) {
                return ((get.suit(card) == 'diamond' && !player.hasJudge('lebu')) || (get.suit(card) == 'club' && !player.hasJudge('bingliang')));
              },
              filterTarget: function (card, player, target) {
                if (_status.event.type == 'dying') {
                  return target == _status.event.dying;
                }
                return player == target;
              },
              selectTarget: -1,
              check: function (card) {
                return 8 - get.value(card);
              },
              content: function () {
                if (get.suit(cards[0]) == 'diamond') {
                  player.addJudge('lebu', cards[0]);
                } else {
                  player.addJudge('bingliang', cards[0]);
                }
                player.useCard({ name: 'tao' }, targets).delayx = false;
              },
              ai: {
                threaten: 1.5,
                save: true,
                order: 9,
                result: {
                  player: function (player) {
                    return get.effect(player, { name: 'lebu' }, player, player);
                  },
                  target: function (player, target) {
                    return get.effect(target, { name: 'tao' }, player, target);
                  }
                }
              }
            },
            jlsg_fangxin_old: {
              srlose: true,
              enable: 'chooseToUse',
              check: function (event, player) {
                return get.attitude(player, event.player) > 0;
              },
              audio: "ext:极略:2",
              filter: function (event, player) {
                if (event.type == 'dying') {
                  return event.filterCard({ name: 'tao' }, player) && ((!player.hasJudge('lebu') && player.countCards('he', { suit: 'diamond' })) || (!player.hasJudge('bingliang') && player.countCards('he', { suit: 'club' })));
                }
                if (event.parent.name != 'phaseUse') return false;
                if (!lib.filter.filterCard({ name: 'tao' }, player, event)) {
                  return false;
                }
                return player.isDamaged() && ((!player.hasJudge('lebu') && player.countCards('he', { suit: 'diamond' })) || (!player.hasJudge('bingliang') && player.countCards('he', { suit: 'club' })));
              },
              chooseButton: {
                dialog: function (event, player) {
                  return ui.create.dialog('将一张梅花牌当【兵粮寸断】或将一张方片牌当【乐不思蜀】对自己使用，若如此做，视为你使用一张【桃】。', player.get('he'), 'hidden');
                },
                filter: function (button, player) {
                  return ((get.suit(button.link) == 'diamond' && !player.hasJudge('lebu')) || (get.suit(button.link) == 'club' && !player.hasJudge('bingliang')));
                },
                backup: function (links, player) {
                  return {
                    filterCard: function () {
                      return false
                    },
                    selectCard: -1,
                    viewAs: { name: 'tao' },
                    cards: links,
                    onuse: function (result, player) {
                      player.logSkill('jlsg_fangxin');
                      if (get.suit(lib.skill.jlsg_fangxin_backup.cards) == 'diamond') {
                        player.addJudge('lebu', lib.skill.jlsg_fangxin_backup.cards);
                      } else {
                        player.addJudge('bingliang', lib.skill.jlsg_fangxin_backup.cards);
                      }

                    }
                  }
                }
              },
              ai: {
                order: 10,
                result: {
                  target: function (player) {
                    if (player.countCards('h') <= player.hp) return 1;
                    if (player.hp <= 1) return 10;
                    return -2;
                  }
                },
                save: true
              }
            },
            jlsg_xiyu: {
              audio: "ext:极略:1",
              srlose: true,
              trigger: { player: 'phaseBegin' },
              direct: true,
              content: function () {
                'step 0'
                player.chooseTarget('细语：弃置一名角色的一张牌，然后该角色进行1个额外的出牌阶段', function (card, player, target) {
                  return target.countCards('he') > 0;
                }).ai = function (target) {
                  if (target.countCards('h') >= 3) return get.attitude(_status.event.player, target);
                  if (target.countCards('h') < 2) return -get.attitude(_status.event.player, target);
                  return -get.attitude(_status.event.player, target);
                }
                'step 1'
                if (result.bool) {
                  player.logSkill('jlsg_xiyu', result.targets);
                  event.targets = result.targets;
                  if (event.targets[0].num('he') > 0) {
                    player.discardPlayerCard('he', event.targets[0], true);
                  }
                  event.targets[0].phaseUse();
                  event.targets[0].getStat().card = {};
                  event.targets[0].getStat().skill = {};
                }
              }
            },
            jlsg_wanrou: {
              audio: "ext:极略:1",
              srlose: true,
              trigger: {
                global: ["loseAfter", "cardsDiscardAfter"]
              },
              direct: true,
              filter: function (event, player) {
                if (event.player) {
                  if (event.player != player) return false;
                } else {
                  var evt = event.getParent();
                  if (!(evt.name == 'orderingDiscard' && evt.relatedEvent && evt.relatedEvent.player === player)) { // && ['useCard','respond'].contains(evt.relatedEvent.name)
                    return false;
                  }
                }
                return (event.cards2 || event.cards).some(c => get.position(c, true) == 'd' && get.suit(c) == 'diamond');
              },
              content: function () {
                'step 0'
                event.count = (trigger.cards2 || trigger.cards).filter(card => get.suit(card) == 'diamond').length;
                if (!event.count) {
                  console.warn("婉柔找不到方片牌", trigger);
                  event.finish();
                }
                'step 1'
                --event.count;
                player.chooseTarget('婉柔：选择一名目标令其摸一张牌').ai = function (target) {
                  return ai.get.attitude(player, target)
                }
                'step 2'
                if (result.bool) {
                  player.logSkill('jlsg_wanrou', result.targets[0]);
                  result.targets[0].draw();
                  if (event.count) {
                    event.goto(1);
                  }
                }
              },
              ai: {
                threaten: 0.7
              },
              group: 'jlsg_wanrou2'
            },
            jlsg_wanrou2: {
              trigger: { player: 'loseEnd' },
              filter: function (event, player) {
                for (var i = 0; i < event.cards.length; i++) {
                  if (event.cards[i].original == 'j') return true;
                }
                return false;
              },
              direct: true,
              content: function () {
                'step 0'
                player.chooseTarget('婉柔：选择一名目标令其摸一张牌').ai = function (target) {
                  return ai.get.attitude(player, target)
                }
                'step 1'
                if (result.bool) {
                  player.logSkill('jlsg_wanrou', result.targets[0]);
                  result.targets[0].draw();
                }
              }
            },
            jlsg_zhouyan: {
              audio: "ext:极略:1",
              srlose: true,
              usable: 1,
              enable: 'phaseUse',
              filterTarget: function (card, player, target) {
                return player != target;
              },
              direct: true,
              init: function (player) {
                player.storage.isjlsg_zhouyan = false;
                player.storage.jlsg_zhouyanDamage = false;
              },
              content: function () {
                'step 0'
                player.logSkill('jlsg_zhouyan');
                player.storage.isjlsg_zhouyan = true;
                target.draw();
                player.useCard({ name: 'huogong' }, target);
                'step 1'
                if (player.storage.jlsg_zhouyanDamage && target.isAlive()) {
                  player.storage.jlsg_zhouyanDamage = false;
                  player.chooseBool('是否继续发动【舟焰】？').ai = function () {
                    return get.attitude(player, target) < 0;
                  }
                } else {
                  player.storage.isjlsg_zhouyan = false;
                  player.storage.jlsg_zhouyanDamage = false;
                  event.finish();
                }
                'step 2'
                if (result.bool) {
                  event.goto(0);
                }
                player.storage.isjlsg_zhouyan = false;
                player.storage.jlsg_zhouyanDamage = false;
              },
              group: ['jlsg_zhouyan_damage'],
              subSkill: {
                damage: {
                  trigger: { source: 'damageEnd' },
                  forced: true,
                  popup: false,
                  filter: function (event, player) {
                    return event.card && event.card.name == 'huogong';
                  },
                  content: function () {
                    player.draw();
                    if (player.storage.isjlsg_zhouyan) {
                      player.storage.isjlsg_zhouyan = false;
                      player.storage.jlsg_zhouyanDamage = true;
                    }
                  }
                }
              },
              ai: {
                order: 4,
                player: 0,
                fireattack: true,
                target: function (player, target) {
                  if (player == target) return 1;
                  if (!lib.card.huogong) return 0;
                  var result = lib.card.huogong.ai.result.target;

                  if ((player.countCards('h') > 2 || target.hp <= 2) && !target.hasSkill('huogong2') && get.damageEffect(target, player, player, 'fire') > 0 && result(player, target) < 0) return -2;
                  if (get.attitude(player, target) > 0) return 0.9;
                  if (target.countCards('h') == 0) return 1;
                  return 0.5;
                }
              }
            },
            jlsg_zhaxiang: {
              audio: "ext:极略:true",
              srlose: true,
              enable: 'phaseUse',
              filterCard: true,
              discard: false,
              filterTarget: function (card, target, player) {
                return player != target;
              },
              complexCard: true,
              prepare: function (cards, player, targets) {
                player.$give(cards.length, targets[0]);
              },
              check: function (card) {
                var player = _status.event.player;
                if (player.countCards('h', 'sha') > player.getCardUsable('sha') || !game.hasPlayer(function (current) {
                  return player.canUse('sha', current) && current.inRangeOf(player) && player.hasCard('sha', 'h') && player.hasCard(function (cardx) {
                    return get.effect(current, cardx, player, player) > 0 && cardx.name == 'sha';
                  }, 'h');
                })) {
                  if (card.name == 'sha') {
                    for (var i = 0; i < game.players.length; i++) {
                      if (player == game.players[i]) continue;
                      var target = game.players[i];
                      var effect = get.effect(target, {
                        name: 'sha',
                        nature: 'fire'
                      }, player, player);
                      if (effect > 0) return 7 - get.value(card);
                    }
                  }
                } else {
                  if (player.needsToDiscard() || player.countCards('h') > 4) return 6 - get.value(card);
                }
                return 0;
              },
              content: function () {
                'step 0'
                event.cards1 = cards[0];
                event.target = target;
                var cardx = ui.create.card();
                cardx.name = '诈降牌';
                cardx.classList.add('infohidden');
                cardx.classList.add('infoflip');
                player.showCards(cardx, '诈降');
                var random = Math.random();
                var att = get.attitude(event.target, player);
                event.target.chooseCard('交给' + get.translation(player) + '一张牌，或展示并获得此牌。').ai = function (card) {
                  if (['sha', 'jiu', 'tao'].includes(card.name)) return -1;
                  var effect = get.attitude(player, event.target) > 0 ?
                    0 : get.damageEffect(event.target, player, event.target, 'fire');
                  return -effect - get.value(card, event.target) + (get.attitude(event.target, player) / 5 * get.value(card, player)) - 2;
                }
                'step 1'
                if (result.bool) {
                  player.gain(result.cards[0]);
                  event.target.$give(result.cards[0], player);
                  event.target.discard(event.cards1);
                } else {
                  event.target.showCards(event.cards1);
                  event.target.gain(event.cards1);
                  event.target.$gain2(event.cards1);
                  if (event.cards1.name == 'sha') {
                    player.useCard({ name: 'sha', nature: 'fire' }, event.target, false);
                  }
                }
              },
              ai: {
                order: 6,
                fireattack: true,
                result: {
                  target: function (target, player) {
                    if (!ui.selected.cards.length) return 0;
                    if (ui.selected.cards[0].name == 'sha') {
                      var effect = get.effect(target, {
                        name: 'sha',
                        nature: 'fire'
                      }, player, player);
                      if (target.mayHaveShan()) effect *= 1.2;
                      if (effect > 0) {
                        return (get.attitude(player, target) > 0 ? 1 : -1) * effect
                      }
                      return 0;
                    } else {
                      return 1;
                    }
                    return 0;
                  }
                }
              },
              group: "jlsg_zhaxiang_directHit",
              subSkill: {
                directHit: {
                  shaRelated: true,
                  trigger: { player: 'useCard1' },
                  firstDo: true,
                  silent: true,
                  filter: function (event, player) {
                    return event.parent.name == 'jlsg_zhaxiang';
                  },
                  content: function () {
                    trigger.directHit.addArray(game.players);
                  },
                }
              },
            },
            jlsg_old_zhaxiang: {
              audio: "ext:极略:true",
              enable: "phaseUse",
              usable: 1,
              srlose: true,
              filterTarget: function (card, player, target) {
                return player != target;
              },
              content: function () {
                "step 0"
                target.useCard({ name: 'sha' }, target, player, true);
                "step 1"
                player.draw(2);
                "step 2"
                player.addTempSkill('jlsg_buff_chuantou');
                "step 3"
                player.useCard({ name: 'sha' }, player, target, false);
                game.delay();
                "step 4"
                player.removeSkill('jlsg_buff_chuantou');
              },
              ai: {
                order: 4,
                result: {
                  target: function (player, target) {
                    if (!player.hasShan() && player.hp <= 1) {
                      return 0;
                    }
                    return -1;
                  },
                }
              }
            },
            jlsg_shixue: {
              audio: "ext:极略:1",
              srlose: true,
              trigger: { player: 'shaBegin' },
              frequent: true,
              content: function () {
                player.draw(2);
                player.addTempSkill('jlsg_shixue2', 'shaAfter');
              }
            },
            jlsg_shixue2: {
              trigger: { player: 'shaMiss' },
              forced: true,
              popup: false,
              content: function () {
                player.chooseToDiscard(2, true);
              }
            },
            jlsg_guoshi: {
              audio: "ext:极略:2",
              srlose: true,
              trigger: { global: 'phaseJieshuBegin' },
              filter: function (event, player) {
                return event.player.getStorage("jlsg_guoshi").filterInD('d').length > 0;
              },
              init: function () {
                for (var i = 0; i < game.players.length; i++) {
                  game.players[i].storage.jlsg_guoshi = [];
                }
              },
              direct: true,
              content: function () {
                'step 0'
                var att = get.attitude(player, trigger.player);
                player.chooseCardButton(get.prompt('jlsg_guoshi', trigger.player), trigger.player.getStorage("jlsg_guoshi").filterInD('d')).ai = function (button) {
                  if (att > 0) return get.value(button.link, trigger.player);
                  return -get.value(button.link, trigger.player);
                }
                'step 1'
                if (result.bool) {
                  player.logSkill('jlsg_guoshi', trigger.player);
                  trigger.player.gain(result.buttons[0].link);
                  trigger.player.$gain(result.buttons[0].link);
                }
                if (trigger.player.ai.shown > player.ai.shown) {
                  player.addExpose(0.2);
                }
                'step 2'
                trigger.player.storage.jlsg_guoshi = [];
              },
              group: ['jlsg_guoshi2'],
              global: ['jlsg_guoshi_check'],
              subSkill: {
                check: {
                  trigger: { player: 'phaseBefore' },
                  forced: true,
                  popup: false,
                  content: function () {
                    player.storage.jlsg_guoshi = [];
                    player.addTempSkill('jlsg_guoshi_judge');
                    player.addTempSkill('jlsg_guoshi_discard');
                  }
                },
                judge: {
                  trigger: { global: 'judgeAfter' },
                  forced: true,
                  popup: false,
                  filter: function (event, player) {
                    if (_status.currentPhase != player) return false;
                    if (get.position(event.result.card) == 'd')
                      return true;
                    return false;
                  },
                  content: function () {
                    if (trigger.result.card)
                      player.storage.jlsg_guoshi.add(trigger.result.card);
                  }
                },
                discard: {
                  trigger: { global: 'discardAfter' },
                  filter: function (event, player) {
                    if (_status.currentPhase != player) return false;
                    for (var i = 0; i < event.cards.length; i++) {
                      if (get.position(event.cards[i]) == 'd') {
                        return true;
                      }
                    }
                    return false;
                  },
                  forced: true,
                  popup: false,
                  content: function () {
                    player.getStorage('jlsg_guoshi').addArray(trigger.cards.filterInD('d'));
                  }
                }
              },
              ai: {
                expose: 0.2
              }
            },
            jlsg_guoshi2: {
              audio: "jlsg_guoshi",
              trigger: { global: 'phaseZhunbeiBegin' },
              prompt: '是否发动【国士】观看牌顶的牌？',
              frequent: true,
              content: function () {
                player.chooseToGuanxing(2);
              },
              contentBackup: function () {
                "step 0"
                if (player.isUnderControl()) {
                  game.modeSwapPlayer(player);
                }
                var cards = get.cards(2);
                event.cards = cards;
                var switchToAuto = function () {
                  _status.imchoosing = false;
                  if (event.dialog) event.dialog.close();
                  if (event.control) event.control.close();
                  var top = [];
                  var judges = event.player.node.judges.childNodes;
                  var stopped = false;
                  if (get.attitude(player, event.player) > 0) {
                    for (var i = 0; i < judges.length; i++) {
                      var judge = get.judge(judges[i]);
                      cards.sort(function (a, b) {
                        return judge(b) - judge(a);
                      });
                      if (judge(cards[0]) < 0) {
                        stopped = true;
                        break;
                      } else {
                        top.unshift(cards.shift());
                      }
                    }
                  }
                  var bottom;
                  if (!stopped) {
                    cards.sort(function (a, b) {
                      return get.value(b, player) - get.value(a, player);
                    });
                    while (cards.length) {
                      if (get.value(cards[0], player) <= 5) break;
                      top.unshift(cards.shift());
                    }
                  }
                  bottom = cards;
                  for (var i = 0; i < top.length; i++) {
                    ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
                  }
                  for (i = 0; i < bottom.length; i++) {
                    ui.cardPile.appendChild(bottom[i]);
                  }
                  player.popup(get.cnNumber(top.length) + '上' + get.cnNumber(bottom.length) + '下');
                  game.log(player, '将' + get.cnNumber(top.length) + '张牌置于牌堆顶');
                  game.delay(2);
                }
                var chooseButton = function (online, player, cards) {
                  var event = _status.event;
                  player = player || event.player;
                  cards = cards || event.cards;
                  event.top = [];
                  event.bottom = [];
                  event.status = true;
                  event.dialog = ui.create.dialog('按顺序选择置于牌堆顶的牌（先选择的在上）', cards);
                  event.switchToAuto = function () {
                    event._result = 'ai';
                    event.dialog.close();
                    event.control.close();
                    _status.imchoosing = false;
                  },
                    event.control = ui.create.control('ok', 'pileTop', 'pileBottom', function (link) {
                      var event = _status.event;
                      if (link == 'ok') {
                        if (online) {
                          event._result = {
                            top: [],
                            bottom: []
                          }
                          for (var i = 0; i < event.top.length; i++) {
                            event._result.top.push(event.top[i].link);
                          }
                          for (var i = 0; i < event.bottom.length; i++) {
                            event._result.bottom.push(event.bottom[i].link);
                          }
                        } else {
                          var i;
                          for (i = 0; i < event.top.length; i++) {
                            ui.cardPile.insertBefore(event.top[i].link, ui.cardPile.firstChild);
                          }
                          for (i = 0; i < event.bottom.length; i++) {
                            ui.cardPile.appendChild(event.bottom[i].link);
                          }
                          for (i = 0; i < event.dialog.buttons.length; i++) {
                            if (event.dialog.buttons[i].classList.contains('glow') == false &&
                              event.dialog.buttons[i].classList.contains('target') == false)
                              ui.cardPile.appendChild(event.dialog.buttons[i].link);
                          }
                          player.popup(get.cnNumber(event.top.length) + '上' + get.cnNumber(event.cards.length - event.top.length) + '下');
                          game.log(player, '将' + get.cnNumber(event.top.length) + '张牌置于牌堆顶');
                        }
                        event.dialog.close();
                        event.control.close();
                        game.resume();
                        _status.imchoosing = false;
                      } else if (link == 'pileTop') {
                        event.status = true;
                        event.dialog.content.childNodes[0].innerHTML = '按顺序选择置于牌堆顶的牌';
                      } else {
                        event.status = false;
                        event.dialog.content.childNodes[0].innerHTML = '按顺序选择置于牌堆底的牌';
                      }
                    });
                  for (var i = 0; i < event.dialog.buttons.length; i++) {
                    event.dialog.buttons[i].classList.add('selectable');
                  }
                  event.custom.replace.button = function (link) {
                    var event = _status.event;
                    if (link.classList.contains('target')) {
                      link.classList.remove('target');
                      event.top.remove(link);
                    } else if (link.classList.contains('glow')) {
                      link.classList.remove('glow');
                      event.bottom.remove(link);
                    } else if (event.status) {
                      link.classList.add('target');
                      event.top.unshift(link);
                    } else {
                      link.classList.add('glow');
                      event.bottom.push(link);
                    }
                  }
                  event.custom.replace.window = function () {
                    for (var i = 0; i < _status.event.dialog.buttons.length; i++) {
                      _status.event.dialog.buttons[i].classList.remove('target');
                      _status.event.dialog.buttons[i].classList.remove('glow');
                      _status.event.top.length = 0;
                      _status.event.bottom.length = 0;
                    }
                  }
                  game.pause();
                  game.countChoose();
                }
                event.switchToAuto = switchToAuto;
                if (event.isMine()) {
                  chooseButton();
                  event.finish();
                } else if (event.isOnline()) {
                  event.player.send(chooseButton, true, event.player, event.cards);
                  event.player.wait();
                  game.pause();
                } else {
                  event.switchToAuto();
                  event.finish();
                }
                "step 1"
                if (event.result == 'ai' || !event.result) {
                  event.switchToAuto();
                } else {
                  var top = event.result.top || [];
                  var bottom = event.result.bottom || [];
                  for (var i = 0; i < top.length; i++) {
                    ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
                  }
                  for (i = 0; i < bottom.length; i++) {
                    ui.cardPile.appendChild(bottom[i]);
                  }
                  for (i = 0; i < event.cards.length; i++) {
                    if (!top.contains(event.cards[i]) && !bottom.contains(event.cards[i])) {
                      ui.cardPile.appendChild(event.cards[i]);
                    }
                  }
                  player.popup(get.cnNumber(top.length) + '上' + get.cnNumber(event.cards.length - top.length) + '下');
                  game.log(player, '将' + get.cnNumber(top.length) + '张牌置于牌堆顶');
                  game.delay(2);
                }
              }
            },
            jlsg_yingcai: {
              audio: "ext:极略:true",
              srlose: true,
              trigger: { player: 'phaseDrawBegin1' },
              check: function () {
                return true;
              },
              filter: function (event, player) {
                return !event.numFixed;
              },
              content: function () {
                'step 0'
                trigger.changeToZero();
                event.suit = [];
                event.cards = [];
                'step 1'
                event.cards2 = get.cards();
                game.cardsGotoOrdering(event.cards2);
                var card = event.cards2[0];
                if (card.clone) {
                  card.clone.classList.add('thrownhighlight');
                  game.addVideo('highlightnode', player, get.cardInfo(card));
                }
                event.node = trigger.player.$throwordered(card.copy(), true);
                event.node.classList.add('thrownhighlight');
                ui.arena.classList.add('thrownhighlight');
                game.delay(1);
                if (!event.suit.contains(get.suit(event.cards2)))
                  event.suit.push(get.suit(event.cards2));
                if (event.suit.length <= 2) {
                  event.cards = event.cards.concat(event.cards2);
                  event.redo();
                } else {
                  event.cards1 = event.cards;
                  event.cards1 = event.cards1.concat(event.cards2[0]);
                  ui.discardPile.appendChild(event.cards2[0]);
                  game.delayx(2);
                }
                'step 2'
                ui.arena.classList.remove('thrownhighlight');
                player.gain(event.cards, 'gain2');
                event.cards2[0].clone.hide();
                game.delay();
              }
            },
            jlsg_old_yingcai: {
              audio: "ext:极略:1",
              srlose: true,
              trigger: { player: 'phaseDrawBegin' },
              check: function () {
                return 1;
              },
              content: function () {
                'step 0'
                trigger.cancel();
                event.suit = [];
                event.cards = [];
                'step 1'
                event.cards2 = get.cards();
                if (!event.suit.contains(get.suit(event.cards2)))
                  event.suit.push(get.suit(event.cards2));
                if (event.suit.length <= 2) {
                  event.cards = event.cards.concat(event.cards2);
                  event.redo();
                } else {
                  event.cards1 = event.cards;
                  event.cards1 = event.cards1.concat(event.cards2[0]);
                  player.showCards(event.cards1);
                  ui.discardPile.appendChild(event.cards2[0]);
                }
                'step 2'
                player.gain(event.cards);
                if (event.cards.length) {
                  player.$draw(event.cards);
                }
              }
            },
            jlsg_weibao: {
              audio: "ext:极略:1",
              srlose: true,
              enable: 'phaseUse',
              usable: 1,
              filter: function (event, player) {
                return player.countCards('h') > 0;
              },
              filterTarget: function (card, player, target) {
                return player != target;
              },
              filterCard: true,
              check: function (card) {
                return 8 - get.value(card);
              },
              discard: false,
              content: function () {
                'step 0'
                player.$throw(1, 1000);
                cards[0].fix();
                ui.cardPile.insertBefore(cards[0], ui.cardPile.firstChild);
                target.chooseControl('heart2', 'diamond2', 'club2', 'spade2').set('ai', function (event) {
                  switch (Math.floor(Math.random() * 6)) {
                    case 0:
                      return 'heart2';
                    case 1:
                    case 4:
                    case 5:
                      return 'diamond2';
                    case 2:
                      return 'club2';
                    case 3:
                      return 'spade2';
                  }
                });
                'step 1'
                game.log(target, '选择了' + get.translation(result.control));
                event.choice = result.control;
                target.popup(event.choice);
                event.cards = get.cards();
                target.showCards(event.cards);
                target.gain(event.cards, 'draw');
                'step 2'
                if (get.suit(event.cards) + '2' != event.choice) target.damage();
              },
              ai: {
                order: 1,
                result: {
                  target: function (player, target) {
                    var eff = get.damageEffect(target, player);
                    if (eff >= 0) return 1 + eff;
                    var value = 0, i;
                    var cards = player.get('h');
                    for (i = 0; i < cards.length; i++) {
                      value += get.value(cards[i]);
                    }
                    value /= player.countCards('h');
                    if (target.hp == 1) return Math.min(0, value - 7);
                    return Math.min(0, value - 5);
                  }
                }
              }
            },
            jlsg_choulve: {
              audio: "ext:极略:1",
              srlose: true,
              enable: 'phaseUse',
              usable: 1,
              filter: function (event, player) {
                return player.countCards('h') > 1 && game.countPlayer(p => p != player) >= 2;
              },
              check: function (card) {
                if (ui.selected.cards.length == 0) return get.value(card);
                return 6 - get.value(card) && card.number < ui.selected.cards[0].number;
              },
              filterCard: true,
              selectCard: 2,
              filterTarget: function (card, player, target) {
                return player != target;
              },
              prepare: function (cards, player, targets) {
                player.$give(1, targets[0]);
                player.$give(1, targets[1]);
              },
              targetprompt: ['先拿牌', '后拿牌'],
              selectTarget: 2,
              discard: false,
              lose: false,
              multitarget: true,
              content: function () {
                targets[0].gain(cards[0]);
                targets[1].gain(cards[1]);
                targets[0].showCards(cards[0]);
                targets[1].showCards(cards[1]);
                if (get.number(cards[0]) != get.number(cards[1])) {
                  if (get.number(cards[0]) > get.number(cards[1])) {
                    targets[0].storage.jlsg_choulve = player;
                    targets[0].addTempSkill('jlsg_choulve_shaHit', 'shaAfter');
                    targets[0].useCard({ name: 'sha' }, targets[1], false);
                  } else {
                    targets[1].storage.jlsg_choulve = player;
                    targets[1].addTempSkill('jlsg_choulve_shaHit', 'shaAfter');
                    targets[1].useCard({ name: 'sha' }, targets[0], false);
                  }
                }
              },
              subSkill: {
                shaHit: {
                  trigger: { source: 'damageAfter' },
                  forced: true,
                  popup: false,
                  filter: function (event, player) {
                    return event.card.name == 'sha'
                  },
                  content: function () {
                    player.storage.jlsg_choulve.draw();
                  }
                }
              },
              ai: {
                order: 4,
                result: {
                  player: function (player) {
                    if (player.countCards('h') > player.hp) return 0.5;
                    return -5;
                  },
                  target: function (player, target) {
                    var card1 = ui.selected.cards[0];
                    var card2 = ui.selected.cards[1];
                    if (card1 && card2 && card1.number == card2.number) {
                      return 2;
                    }
                    if (ui.selected.targets.length == 0) {
                      return 1;
                    } else {
                      return get.effect(target, { name: 'sha' }, ui.selected.targets[0], target);
                    }
                  }
                }
              }
            },
            jlsg_old_jiexi: {
              audio: "ext:极略:true",
              srlose: true,
              enable: "phaseUse",
              filterTarget: function (card, player, target) {
                return player.canCompare(target) && target.countCards('h') > 0;
              },
              filter: function (event, player) {
                return player.countCards('h') > 0 && !player.isTurnedOver() && !player.hasSkill('jlsg_jilve2');
              },
              content: function () {
                "step 0"
                player.chooseToCompare(target);
                "step 1"
                if (result.bool) {
                  player.useCard({ name: 'guohe' }, target, true);
                } else {
                  player.addTempSkill('jlsg_jilve2', 'phaseAfter');
                }
                "step 2"
                if (!player.isTurnedOver() && player.countCards('h') < 4) {
                  player.turnOver();
                  player.draw();
                }
              },
              mod: {
                targetEnabled: function (card, player, target, now) {
                  if (target.isTurnedOver()) {
                    if (card.name == 'nanman' || card.name == 'shandian') return false;
                  }
                }
              },
              ai: {
                order: 5,
                result: {
                  target: function (player, target) {
                    var att = get.attitude(player, target);
                    var nh = target.countCards('h');
                    if (att > 0) {
                      var js = target.getCards('j');
                      if (js.length) {
                        var jj = js[0].viewAs ? { name: js[0].viewAs } : js[0];
                        if (jj.name == 'guohe' || js.length > 1 || get.effect(target, jj, target, player) < 0) {
                          return 3;
                        }
                      }
                      if (target.getEquip('baiyin') && target.isDamaged() &&
                        get.recoverEffect(target, player, player) > 0) {
                        if (target.hp == 1 && !target.hujia) return 1.6;
                        if (target.hp == 2) return 0.01;
                        return 0;
                      }
                    }
                    var es = target.getCards('e');
                    var noe = (es.length == 0 || target.hasSkillTag('noe'));
                    var noe2 = (es.length == 1 && es[0].name == 'baiyin' && target.isDamaged());
                    var noh = (nh == 0 || target.hasSkillTag('noh'));
                    if (noh && (noe || noe2)) return 0;
                    if (att <= 0 && !target.countCards('he')) return 1.5;
                    return -1.5;
                  },
                },
              }
            },
            jlsg_old_youxia: {
              audio: "ext:极略:2",
              srlose: true,
              enable: 'phaseUse',
              usable: 1,
              filterTarget: function (card, target, player) {
                return player != target && target.countCards('hej') > 0;
              },
              selectTarget: [1, 2],
              multitarget: true,
              multiline: true,
              content: function () {
                player.turnOver();
                targets.sortBySeat();
                for (var i = 0; i < targets.length; i++) {
                  player.discardPlayerCard('hej', targets[i], true);
                }
              },
              mod: {
                targetEnabled: function (card, player, target, now) {
                  if (target.isTurnedOver()) {
                    if (card.name == 'sha' || card.name == 'bingliang') return false;
                  }
                }
              },
              ai: {
                order: 5,
                result: {
                  player: -1,
                  target: function (player, target) {
                    if (get.attitude(player, target) <= 0) return (target.countCards('he') > 0) ? -1.5 : 1.5;
                    return 0;
                  },
                }
              }
            },
            jlsg_jiexi: {
              audio: "ext:极略:true",
              srlose: true,
              usable: 1,
              enable: 'phaseUse',
              filterTarget: function (card, target, player) {
                return player.canCompare(target);
              },
              filterCard: function () {
                return false
              },
              selectCard: -1,
              viewAs: { name: 'guohe' },
              prompt: '你可以与一名其他角色拼点，若你赢，视为对其使用一张【过河拆桥】。你可重复此流程直到你以此法拼点没赢',
              group: 'jlsg_jiexi_compare',
              subSkill: {
                compare: {
                  forced: true,
                  popup: false,
                  trigger: { player: 'guoheBefore' },
                  filter: function (event, player) {
                    return event.skill == 'jlsg_jiexi';
                  },
                  content: function () {
                    'step 0'
                    player.chooseToCompare(trigger.target);
                    'step 1'
                    if (result.bool) {
                      player.addSkill('jlsg_jiexi_after');
                    } else {
                      trigger.untrigger();
                      trigger.finish();
                    }
                  }
                },
                after: {
                  forced: true,
                  popup: false,
                  trigger: { player: 'guoheAfter' },
                  filter: function (event, player) {
                    return event.skill == 'jlsg_jiexi';
                  },
                  content: function () {
                    'step 0'
                    player.removeSkill('jlsg_jiexi_after');
                    if (trigger.target.countCards('h') && player.countCards('h')) {
                      var choice = get.effect_use(trigger.target, { name: 'guohe' }, player, player) > 1;
                      player.chooseBool('是否继续发动【劫袭】？')
                        .set('ai', () => _status.event.choice).set('choice', choice);
                    } else {
                      event.finish();
                    }
                    'step 1'
                    if (result.bool) {
                      var evt = trigger;
                      for (var i = 0; i < 10; i++) {
                        if (evt && evt.getParent) {
                          evt = evt.getParent();
                        }
                        if (evt.name == 'chooseToUse') {
                          player.useResult(evt.result, evt);
                          break;
                        }
                      }
                    }
                  }
                }
              },
              ai: {
                basic: {
                  order: 9,
                  useful: 1,
                  value: 5,
                },
                result: {
                  target: function (player, target) {
                    var att = get.attitude(player, target);
                    var nh = target.countCards('h');
                    if (att > 0) {
                      var js = target.getCards('j');
                      if (js.length) {
                        var jj = js[0].viewAs ? { name: js[0].viewAs } : js[0];
                        if (jj.name == 'guohe' || js.length > 1 || get.effect(target, jj, target, player) < 0) {
                          return 3;
                        }
                      }
                      if (target.getEquip('baiyin') && target.isDamaged() &&
                        get.recoverEffect(target, player, player) > 0) {
                        if (target.hp == 1 && !target.hujia) return 1.6;
                        if (target.hp == 2) return 0.01;
                        return 0;
                      }
                    }
                    var es = target.getCards('e');
                    var noe = (es.length == 0 || target.hasSkillTag('noe'));
                    var noe2 = (es.length == 1 && es[0].name == 'baiyin' && target.isDamaged());
                    var noh = (nh == 0 || target.hasSkillTag('noh'));
                    if (noh && (noe || noe2)) return 0;
                    if (att <= 0 && !target.countCards('he')) return 1.5;
                    return -1.5;
                  },
                },
                tag: {
                  loseCard: 1,
                  discard: 1,
                },
              },
            },
            jlsg_youxia: {
              audio: "ext:极略:2",
              srlose: true,
              enable: 'phaseUse',
              filterTarget: function (card, target, player) {
                return player != target && target.countCards('hej') > 0;
              },
              filter: function (event, player) {
                return !player.isTurnedOver();
              },
              selectTarget: [1, 2],
              multitarget: true,
              multiline: true,
              content: function () {
                player.turnOver();
                for (var i = 0; i < targets.length; i++) {
                  player.gainPlayerCard('hej', targets[i]);
                }
              },
              mod: {
                targetEnabled: function (card, player, target, now) {
                  if (target.isTurnedOver()) {
                    if (card.name == 'sha' || card.name == 'juedou') return false;
                  }
                }
              },
              ai: {
                order: 9,
                result: {
                  player: -2,
                  target: function (player, target) {
                    if (get.attitude(player, target) <= 0) return (target.num('he') > 0) ? -1.5 : 1.5;
                    return 0;
                  },
                }
              }
            },
            jlsg_huailing: {
              trigger: {
                global: "useCardToPlayered",
              },
              srlose: true,
              audio: "ext:极略:1",
              filter: function (event, player) {
                if (event.player == player) return false;
                if (event.getParent().triggeredTargets3.length > 1) return false;
                if (get.type(event.card) != 'trick') return false;
                if (get.info(event.card).multitarget) return false;
                if (event.targets.length < 2) return false;
                if (!player.isTurnedOver()) return false;
                return true;
              },
              direct: true,
              content: function () {
                "step 0"
                player.chooseTarget(get.prompt('jlsg_huailing'), function (card, player, target) {
                  var evt = _status.event.getTrigger().getParent();
                  return evt.targets.contains(target) && !evt.excluded.contains(target) && player != target;
                }).ai = function (target) {
                  return get.attitude(player, target) > 0;
                };
                "step 1"
                if (result.bool) {
                  player.logSkill('jlsg_huailing', result.targets);
                  player.turnOver();
                  trigger.getParent().excluded.addArray(result.targets);
                  game.delay();
                }
              },
              mod: {
                targetEnabled: function (card, player, target, now) {
                  if (target.isTurnedOver()) {
                    if (card.name == 'juedou' || card.name == 'guohe') return false;
                  }
                }
              },
              ai: {
                threaten: 1.5,
              },
            },
            jlsg_dailao: {
              audio: "ext:极略:2",
              usable: 1,
              srlose: true,
              enable: 'phaseUse',
              filterTarget: function (cards, target, player) {
                return player != target;
              },
              content: function () {
                'step 0'
                player.turnOver();
                target.turnOver();
                'step 1'
                target.chooseToDiscard('he').set('prompt2', `或点「取消」，令你与${get.translation(player)}各摸一张牌`).set('ai',
                  function (card) {
                    var unusefulness = get.unuseful(card);
                    var att = get.attitude(target, player);
                    if (-2 < att && att < 2) return -1;
                    if (!player.hasSkill('jlsg_ruya')) {
                      if (att > 0) return unusefulness;
                      return unusefulness + get.effect(player, { name: 'guohe' }, player, target) / 2;
                    }
                    if (att < 0 || player.countDiscardableCards(player, 'h') != player.countCards('h')) return -1;
                    if (player.isTurnedOver() && player.countCards('h') == 1) {
                      unusefulness += 8;
                    }
                    return unusefulness;
                  });
                'step 2'
                if (result.bool) {
                  target.addExpose(0.1);
                  player.chooseToDiscard('he', true);
                } else {
                  game.asyncDraw([player, target]);
                }
              },
              ai: {
                order: 9,
                result: {
                  player: function (player) {
                    return player.isTurnedOver() ? 5 : -3.5;
                  },
                  target: function (player, target) {
                    if (target.hasSkillTag('noturn')) return 0;
                    return target.isTurnedOver() ? 5 : -3.5;
                  }
                }
              }
            },
            jlsg_old_dailao: {
              audio: "ext:极略:2",
              usable: 1,
              srlose: true,
              enable: 'phaseUse',
              filterTarget: function (cards, target, player) {
                return player != target;
              },
              filterCard: true,
              position: 'he',
              check: function (card) {
                return 6 - get.value(card);
              },
              selectCard: [0, 1],
              complexCard: true,
              content: function () {
                if (cards.length == 0) {
                  game.asyncDraw([player, target]);
                } else {
                  target.chooseToDiscard('he', true);
                }
                player.turnOver();
                target.turnOver();
              },
              ai: {
                order: 9,
                result: {
                  player: function (player) {
                    if (ui.selected.cards.length > 0) {
                      if (player.isTurnedOver()) return 3;
                      if (!player.isTurnedOver()) return -4
                    }
                    if (ui.selected.cards.length == 0) {
                      if (player.isTurnedOver()) return 4;
                      if (!player.isTurnedOver()) return -3;
                    }
                  },
                  target: function (target, player) {
                    if (ui.selected.cards.length > 0) {
                      if (target.isTurnedOver()) return 3;
                      if (!target.isTurnedOver()) return -4
                    }
                    if (ui.selected.cards.length == 0) {
                      if (target.isTurnedOver()) return 4;
                      if (!target.isTurnedOver()) return -3;
                    }
                  }
                }
              }
            },
            jlsg_old_youdi: {
              audio: "ext:极略:true",
              srlose: true,
              enable: ['chooseToRespond', 'chooseToUse'],
              filterCard: function () {
                return false;
              },
              selectCard: -1,
              viewAs: { name: 'shan' },
              viewAsFilter: function (player) {
                return player.isTurnedOver();
              },
              prompt: '将你的武将牌翻面，视为打出一张闪',
              check: function () {
                return 1
              },
              onrespond: function (result, player) {
                player.turnOver();
              },
              ai: {
                skillTagFilter: function (player) {
                  return player.isTurnedOver();
                },
                respondShan: true,
              },
              group: 'jlsg_old_youdi2'
            },
            jlsg_old_youdi2: {
              trigger: { global: 'shaMiss' },
              filter: function (event, player) {
                return event.target == player;
              },
              direct: true,
              content: function () {
                'step 0'
                player.chooseToDiscard(get.prompt('jlsg_old_youdi', trigger.player), [1, Infinity])
                next.ai = function (card) {
                  if (get.attitude(player, trigger.player) <= 0) return 4 - get.value(card);
                  return false;
                };
                next.logSkill = ['jlsg_old_youdi', trigger.player];
                'step 1'
                if (result.bool) {
                  trigger.player.chooseToDiscard(result.cards.length, 'he', true);
                }
              }
            },
            jlsg_old_ruya: {
              audio: "ext:极略:true",
              srlose: true,
              frequent: true,
              trigger: {
                player: 'loseAfter',
                global: ['equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter'],
              },
              filter: function (event, player) {
                if (player.countCards('h')) return false;
                var evt = event.getl(player);
                return evt && evt.hs && evt.hs.length;
              },
              content: function () {
                player.turnOver();
                player.drawTo(player.maxHp);
              },
              ai: {
                threaten: 1.5,
                effect: {
                  target: function (card, player, target) {
                    if (target.countCards('h') == 1 && (card.name == 'guohe' || card.name == 'liuxinghuoyu')) return 0.5;
                    if (target.isTurnedOver() && target.countCards('h') == 1 && (card.name == 'guohe' || card.name == 'shunshou')) return -10;
                  }
                },
                noh: true,
                skillTagFilter: function (player, tag) {
                  if (tag == 'noh') {
                    if (player.countCards('h') != 1) return false;
                  }
                }
              }
            },
            jlsg_youdi: {
              audio: "ext:极略:1",
              srlose: true,
              enable: ['chooseToUse', 'chooseToRespond'],
              filterCard: function () {
                return false;
              },
              selectCard: -1,
              viewAs: { name: 'shan' },
              viewAsFilter: function (player) {
                return player.isTurnedOver();
              },
              prompt: '可以将你的武将牌正面朝上，视为打出一张【闪】',
              check: function () {
                return true;
              },
              onuse: function (result, player) {
                player.turnOver(false);
              },
              onrespond: function (result, player) {
                player.turnOver(false);
              },
              ai: {
                skillTagFilter: function (player) {
                  return player.isTurnedOver();
                },
                respondShan: true,
              },
              group: 'jlsg_youdi2'
            },
            jlsg_youdi2: {
              trigger: { global: 'shaMiss' },
              filter: function (event, player) {
                return event.target == player;
              },
              direct: true,
              content: function () {
                'step 0'
                player.chooseToDiscard('是否发动【诱敌】？', [1, trigger.player.countCards('he')], 'he').ai = function (card) {
                  if (get.attitude(player, trigger.player) <= 0) return 4 - get.value(card);
                  return false;
                }
                'step 1'
                if (result.bool) {
                  player.logSkill('jlsg_youdi', trigger.player);
                  trigger.player.chooseToDiscard(result.cards.length, 'he', true);
                }
              }
            },
            jlsg_ruya: {
              audio: "ext:极略:1",
              srlose: true,
              trigger: { player: 'loseEnd' },
              frequent: true,
              filter: function (event, player) {
                if (player.countCards('h')) return false;
                for (var i = 0; i < event.cards.length; i++) {
                  if (event.cards[i].original == 'h') return true;
                }
                return false;
              },
              content: function () {
                player.turnOver();
                player.draw(player.maxHp - player.countCards('h'));
              },
              ai: {
                threaten: 0.8,
                effect: {
                  target: function (card, player, target) {
                    if (target.countCards('h') == 1 && card.name == 'guohe') return 0.5;
                    if (target.isTurnedOver() && target.countCards('h') == 1 && (card.name == 'guohe' || card.name == 'shunshou')) return -10;
                  }
                },
                noh: true,
              }
            },
            jlsg_quanheng: {
              srlose: true,
              audio: "ext:极略:1",
              enable: 'phaseUse',
              usable: 1,
              filter: function (event, player) {
                return player.countCards('h') > 0;
              },
              chooseButton: {
                dialog: function () {
                  var list = ['wuzhong', 'sha'];
                  list[0] = ['trick', '', list[0]];
                  list[1] = ['basic', '', list[1]];
                  return ui.create.dialog('权衡', [list, 'vcard']);
                },
                filter: function (button, player) {
                  return lib.filter.filterCard({ name: button.link[2] }, player, _status.event.getParent());
                },
                check: function (button) {
                  var player = _status.event.player;
                  var shaTarget = false;
                  for (var i = 0; i < game.players.length; i++) {
                    if (player.canUse('sha', game.players[i]) && get.effect(game.players[i], { name: 'sha' }, player) > 0) {
                      shaTarget = true;
                    }
                  }
                  if (shaTarget && !player.countCards('h', 'sha')) return (button.link[2] == 'sha') ? 1 : -1;
                  var hs = player.get('h');
                  for (var i = 0; i < hs.length; i++) {
                    if (5 - get.value(hs[i])) {
                      return (button.link[2] == 'wuzhong') ? 1 : -1;
                    }
                  }
                  return 0;
                },
                backup: function (links, player) {
                  return {
                    filterCard: true,
                    selectCard: [1, Infinity],
                    audio: "ext:极略:1",
                    popname: true,
                    position: 'hs',
                    ai1: function (card) {
                      if (ui.selected.cards.length > 0) return -1;
                      return 5 - get.value(card);
                    },
                    viewAs: { name: links[0][2] },
                    onuse: function (result, player) {
                      player.logSkill('jlsg_quanheng');
                      if (this.viewAs.name == 'wuzhong') {
                        player.storage.jlsg_quanheng_wuzhong_takeEffect = false;
                        player.addSkill('jlsg_quanheng_wuxie');
                      }
                    }
                  }
                },
                prompt: function (links, player) {
                  return '至少一张手牌当' + get.translation(links[0][2]) + '使用';
                },
              },
              group: ['jlsg_quanheng_shaMiss'],
              subSkill: {
                shaMiss: {
                  trigger: { player: 'shaMiss' },
                  forced: true,
                  nopop: true,
                  filter: function (event, player) {
                    return event.skill == 'jlsg_quanheng_backup';
                  },
                  content: function () {
                    player.draw(trigger.cards.length);
                  }
                }
              },
              init: function (player) {
                player.storage.jlsg_quanheng_wuzhong_takeEffect = false;
              },
              ai: {
                order: 8,
                result: {
                  player: 1,
                }
              }
            },
            jlsg_quanheng_wuxie: {
              group: ['jlsg_quanheng_wuxie_switch', 'jlsg_quanheng_wuxie_state'],
              subSkill: {
                switch: {
                  trigger: { global: 'wuxieAfter' },
                  forced: true,
                  popup: false,
                  content: function () {
                    player.storage.jlsg_quanheng_wuzhong_takeEffect = !player.storage.jlsg_quanheng_wuzhong_takeEffect;
                  }
                },
                state: {
                  trigger: { player: 'useCardAfter' },
                  forced: true,
                  popup: false,
                  filter: function (event, player) {
                    return event.card.name == 'wuzhong';
                  },
                  content: function () {
                    'step 0'
                    if (player.storage.jlsg_quanheng_wuzhong_takeEffect) {
                      player.draw(trigger.cards.length);
                    }
                    'step 1'
                    player.removeSkill('jlsg_quanheng_wuxie');
                    player.storage.jlsg_quanheng_wuzhong_takeEffect = false;
                  }
                }
              }
            },
            jlsg_xionglve: {
              audio: "ext:极略:1",
              srlose: true,
              marktext: '略',
              trigger: { player: 'phaseDrawBegin' },
              check: function (event, player) {
                if (player.skipList.contains('phaseUse')) return 1;
                return player.storage.jlsg_xionglve.length <= 3;
              },
              content: function () {
                'step 0'
                trigger.finish();
                trigger.untrigger();
                event.cards = get.cards(2);
                player.chooseCardButton("选择一张牌置入手牌", event.cards, true);
                'step 1'
                if (result.bool) {
                  player.gain(result.links[0]);
                  player.$gain2(result.links[0]);
                  event.cards.remove(result.links[0]);
                  if (event.cards.length) {
                    player.lose(event.cards, ui.special);
                    player.storage.jlsg_xionglve = player.storage.jlsg_xionglve.concat(event.cards);
                    player.markSkill('jlsg_xionglve');
                    player.syncStorage('jlsg_xionglve');
                  }
                }
              },
              init: function (player) {
                player.storage.jlsg_xionglve = [];
              },
              intro: {
                content: 'cards'
              },
              group: ['jlsg_xionglve2'],
            },
            jlsg_xionglve2: {
              audio: "ext:极略:1",
              enable: 'phaseUse',
              filter: function (event, player) {
                return player.storage.jlsg_xionglve.length > 0;
              },
              chooseButton: {
                dialog: function (event, player) {
                  return ui.create.dialog('雄略', player.storage.jlsg_xionglve, 'hidden');
                },
                check: function (button) {
                  var player = _status.event.player;
                  var type = get.type(button.link, 'trick');
                  var recover = 0, lose = 1;
                  for (var i = 0; i < game.players.length; i++) {
                    if (!game.players[i].isOut()) {
                      if (game.players[i].hp < game.players[i].maxHp) {
                        if (get.attitude(player, game.players[i]) > 0) {
                          if (game.players[i].hp < 2) {
                            lose--;
                            recover += 0.5;
                          }
                          lose--;
                          recover++;
                        } else if (get.attitude(player, game.players[i]) < 0) {
                          if (game.players[i].hp < 2) {
                            lose++;
                            recover -= 0.5;
                          }
                          lose++;
                          recover--;
                        }
                      } else {
                        if (get.attitude(player, game.players[i]) > 0) {
                          lose--;
                        } else if (get.attitude(player, game.players[i]) < 0) {
                          lose++;
                        }
                      }
                    }
                  }
                  var equipTarget = false;
                  var shaTarget = false;
                  var shunTarget = false;
                  var chaiTarget = false;
                  for (var i = 0; i < game.players.length; i++) {
                    if (get.attitude(player, game.players[i]) > 0) {
                      if (player != game.players[i] && !game.players[i].get('e', { subtype: get.subtype(button.link) })[0] && get.attitude(player, game.players[i]) > 0) {
                        equipTarget = true;
                      }
                    }
                    if (player.canUse('shunshou', game.players[i]) && get.effect(game.players[i], { name: 'shunshou' }, player)) {
                      shunTarget = true;
                    }
                    if (player.canUse('guohe', game.players[i]) && get.effect(game.players[i], { name: 'guohe' }, player) >= 0) {
                      chaiTarget = true;
                    }
                    if (player.canUse('sha', game.players[i]) && get.effect(game.players[i], { name: 'sha' }, player) > 0) {
                      shaTarget = true;
                    }
                  }
                  if (player.isDamaged()) return (type == 'basic') ? 2 : -1;
                  if (shaTarget && player.countCards('h', 'sha') && !player.countCards('h', 'jiu')) return (type == 'basic') ? 1 : -1;
                  if (lose > recover && lose > 0) return (type == 'trick') ? 1 : -1;
                  if (lose < recover && recover > 0) return (type == 'trick') ? 1 : -1;
                  if (equipTarget) return (type == 'equip') ? 1 : -1;
                  if (shunTarget || chaiTarget) return (type == 'trick') ? 1 : -1;
                  if (shaTarget && !player.countCards('h', 'sha')) return (type == 'basic') ? 1 : -1;
                  return 0;
                },
                backup: function (links, player) {
                  if (get.type(links[0], 'trick') == 'trick') {
                    return {
                      cards: links,
                      chooseButton: {
                        dialog: function () {
                          var list = [];
                          for (var i of lib.inpile) {
                            if (!lib.translate[i + '_info']) continue;
                            // if (lib.card[i].mode && lib.card[i].mode.contains(lib.config.mode) == false) continue;
                            if (lib.card[i].type == 'trick') list.push(['锦囊', '', i]);
                          }
                          return ui.create.dialog('雄略:请选择想要使用的锦囊牌', [list, 'vcard']);
                        },
                        filter: function (button, player) {
                          return lib.filter.filterCard({ name: button.link[2] }, player, _status.event.getParent());
                        },
                        check: function (button) {
                          var player = _status.event.player;
                          var recover = 0, lose = 1;
                          for (var i = 0; i < game.players.length; i++) {
                            if (!game.players[i].isOut()) {
                              if (game.players[i].hp < game.players[i].maxHp) {
                                if (get.attitude(player, game.players[i]) > 0) {
                                  if (game.players[i].hp < 2) {
                                    lose--;
                                    recover += 0.5;
                                  }
                                  lose--;
                                  recover++;
                                } else if (get.attitude(player, game.players[i]) < 0) {
                                  if (game.players[i].hp < 2) {
                                    lose++;
                                    recover -= 0.5;
                                  }
                                  lose++;
                                  recover--;
                                }
                              } else {
                                if (get.attitude(player, game.players[i]) > 0) {
                                  lose--;
                                } else if (get.attitude(player, game.players[i]) < 0) {
                                  lose++;
                                }
                              }
                            }
                          }
                          var shunTarget = false;
                          var chaiTarget = false;
                          for (var i = 0; i < game.players.length; i++) {
                            if (player.canUse('shunshou', game.players[i]) && get.effect(game.players[i], { name: 'shunshou' }, player)) {
                              shunTarget = true;
                            }
                            if (player.canUse('guohe', game.players[i]) && get.effect(game.players[i], { name: 'guohe' }, player) >= 0) {
                              chaiTarget = true;
                            }
                          }
                          if (lose > recover && lose > 0) return (button.link[2] == 'nanman') ? 1 : -1;
                          if (lose < recover && recover > 0) return (button.link[2] == 'taoyuan') ? 1 : -1;
                          if (shunTarget) return (button.link[2] == 'shunshou') ? 1 : -1;
                          if (chaiTarget) return (button.link[2] == 'guohe') ? 1 : -1;
                          return (button.link[2] == 'wuzhong') ? 1 : -1;
                        },
                        backup: function (links, player) {
                          return {
                            filterCard: function () {
                              return false
                            },
                            selectCard: -1,
                            popname: true,
                            viewAs: { name: links[0][2] },
                            onuse: function (result, player) {
                              result.cards = lib.skill.jlsg_xionglve2_backup.cards;
                              var card = result.cards[0];
                              player.storage.jlsg_xionglve.remove(card);
                              player.syncStorage('jlsg_xionglve');
                              player.markSkill('jlsg_xionglve');
                              player.logSkill('jlsg_xionglve2', result.targets);
                            }
                          }
                        },
                        prompt: function (links, player) {
                          return '将一张雄略牌当' + get.translation(links[0][2]) + '使用';
                        }
                      }
                    }
                  } else if (get.type(links[0], 'trick') == 'basic') {
                    return {
                      cards: links,
                      chooseButton: {
                        dialog: function () {
                          var list = [];
                          for (var i of lib.inpile) {
                            if (!lib.translate[i + '_info']) continue;
                            // if (lib.card[i].mode && lib.card[i].mode.contains(lib.config.mode) == false) continue;
                            if (lib.card[i].type == 'basic') list.push(['basic', '', i]);
                          }
                          return ui.create.dialog('雄略:请选择想要使用的基本牌', [list, 'vcard']);
                        },
                        filter: function (button, player) {
                          return lib.filter.filterCard({ name: button.link[2] }, player, _status.event.getParent());
                        },
                        check: function (button) {
                          var player = _status.event.player;
                          var shaTarget = false;
                          for (var i = 0; i < game.players.length; i++) {
                            if (player.canUse('sha', game.players[i]) && get.effect(game.players[i], { name: 'sha' }, player) > 0) {
                              shaTarget = true;
                            }
                          }
                          if (player.isDamaged()) return (button.link[2] == 'tao') ? 1 : -1;
                          if (shaTarget && player.countCards('h', 'sha') && !player.countCards('h', 'jiu')) return (button.link[2] == 'jiu') ? 1 : -1;
                          if (shaTarget && !player.countCards('h', 'sha')) return (button.link[2] == 'sha') ? 1 : -1;
                          return (button.link[2] == 'sha') ? 1 : -1;
                        },
                        backup: function (links, player) {
                          return {
                            filterCard: function () {
                              return false
                            },
                            selectCard: -1,
                            audio: "ext:极略:1",
                            popname: true,
                            viewAs: { name: links[0][2] },
                            onuse: function (result, player) {
                              result.cards = lib.skill.jlsg_xionglve2_backup.cards;
                              var card = result.cards[0];
                              player.storage.jlsg_xionglve.remove(card);
                              player.syncStorage('jlsg_xionglve');
                              player.markSkill('jlsg_xionglve');
                              player.logSkill('jlsg_xionglve2', result.targets);
                            }
                          }
                        },
                        prompt: function (links, player) {
                          return '将一张雄略牌当' + get.translation(links[0][2]) + '使用';
                        }
                      }
                    }
                  } else {
                    return {
                      direct: true,
                      cards: links,
                      filterTarget: function (card, player, target) {
                        var cards = lib.skill.jlsg_xionglve2_backup.cards;
                        return player != target && !target.get('e', get.subtype(cards[0])[5]);
                      },
                      filterCard: function () {
                        return false
                      },
                      selectCard: -1,
                      prepare: function (cards, player, targets) {
                        var cards = lib.skill.jlsg_xionglve2_backup.cards;
                        player.$give(cards[0], targets[0], false);
                      },
                      ai2: function (target) {
                        return get.attitude(_status.event.player, target) + 10;
                      },
                      content: function () {
                        event.cards = lib.skill.jlsg_xionglve2_backup.cards;
                        var card = event.cards[0];
                        player.storage.jlsg_xionglve.remove(card);
                        player.syncStorage('jlsg_xionglve');
                        player.markSkill('jlsg_xionglve');
                        player.logSkill('jlsg_xionglve2', target);
                        if (get.type(card) == 'equip') {
                          target.equip(card);
                        } else {
                          player.discard(card);
                          target.draw();
                        }
                      }
                    }
                  }
                }
              },
              ai: {
                order: 6,
                result: {
                  player: function (player) {
                    if (player.hp <= 2) return 3;
                    return player.storage.jlsg_xionglve.length - 1;
                  },
                }
              }
            },
            jlsg_fuzheng: {
              audio: "ext:极略:1",
              unique: true,
              zhuSkill: true,
              group: ['jlsg_fuzheng2'],
            },
            jlsg_fuzheng2: {
              trigger: { player: 'phaseZhunbeiBegin' },
              filter: function (event, player) {
                if (!player.hasZhuSkill('jlsg_fuzheng')) return false;
                for (var i = 0; i < game.players.length; i++)
                  if (game.players[i] != player && game.players[i].group == 'wu') return true;
                return false;
              },
              direct: true,
              content: function () {
                'step 0'
                player.chooseTarget('是否发动【辅政】？', [1, 2], function (card, player, target) {
                  return player != target && target.group == 'wu';
                }).ai = function (target) {
                  var att = get.attitude(player, target);
                  if (target.countCards('h')) return att;
                  return att / 10;
                }
                'step 1'
                if (result.bool) {
                  player.logSkill('jlsg_fuzheng', result.targets);
                  event.targets = result.targets;
                  event.targets.sort(lib.sort.seat);
                } else {
                  event.finish();
                }
                'step 2'
                if (event.targets.length) {
                  var target = event.targets.shift();
                  target.draw();
                  event.current = target;
                } else {
                  event.finish();
                }
                'step 3'
                if (event.current && event.current.num('h')) {
                  event.current.chooseCard('选择一张手牌置于牌堆顶', 'h', true);
                } else {
                  event.goto(2);
                }
                'step 4'
                if (result && result.cards) {
                  event.card = result.cards[0];
                  event.current.lose(result.cards, ui.special);
                  var cardx = ui.create.card();
                  cardx.classList.add('infohidden');
                  cardx.classList.add('infoflip');
                  event.current.$throw(cardx, 1000);
                } else {
                  event.card = null;
                }
                'step 5'
                if (event.current == game.me) game.delay(0.5);
                'step 6'
                if (event.card) {
                  event.card.fix();
                  ui.cardPile.insertBefore(event.card, ui.cardPile.firstChild);
                }
                event.goto(2);
              }
            },
            jlsg_jiuzhu: {
              audio: "ext:极略:1",
              srlose: true,
              trigger: { global: ['loseAfter', 'cardsDiscardAfter'] },
              filter: function (event, player) {
                if (event.name == 'lose' && event.position != ui.discardPile) return false;
                var criterion0 = event.cards.filter(card => card.name == 'shan' && get.position(card, true) == 'd')
                  .length > 0;

                var criterion1 = player.countCards('he', card => card.name != "shan") != 0;
                // console.log(criterion0, criterion1, event.cards.map(card => card.name));
                return criterion0 && criterion1;
              },
              direct: true,
              content: function () {
                'step 0'
                event.cards = trigger.cards.slice(0);
                event.cards = event.cards.filter(card => get.position(card) == 'd' && card.name == 'shan');
                // console.log(event.cards);
                // console.log(_status.currentPhase);
                'step 1'
                event.card = event.cards.shift();
                player.chooseToDiscard('是否发动【救主】替换弃牌堆中的' + get.translation(event.card) + '?', 'he',
                  card => card.name != 'shan')
                  .ai = function (card) {
                    if (player.num('h', { name: 'shan' }) >= 2) return false;
                    return 6 - ai.get.value(card);
                  }
                'step 2'
                if (result.bool) {
                  player.logSkill('jlsg_jiuzhu');
                  player.gain(event.card, 'gain2');
                  if (_status.currentPhase != player) {
                    player.chooseBool('是否对' + get.translation(_status.currentPhase) + '使用一张无视防具的杀？').ai = function () {
                      return get.attitude(player, _status.currentPhase) < 0;
                    }
                  } else {
                    event.finish();
                  }
                } else {
                  event.finish();
                }
                'step 3'
                if (result.bool) {
                  player.addTempSkill('unequip', 'shaAfter');
                  player.useCard({ name: 'sha' }, _status.currentPhase, false);
                }
                "step 4"
                if (event.cards.length) event.goto(1);
              }
            },
            jlsg_tuwei: {
              audio: "ext:极略:1",
              srlose: true,
              trigger: { global: 'useCardAfter' },
              filter: function (event, player) {
                if (event.player != player && !event.targets.contains(player)) return false;
                var criterion0 = event.card.name == "sha" && event.card.isCard
                  && (event.cards.length == 1 && event.cards[0].name === 'sha')
                  && get.position(event.card.cards[0]) == 'd';
                var criterion1 = player.countCards('h', card => get.tag(card, 'damage')) != 0;
                return criterion0 && criterion1;
              },
              direct: true,
              content: function () {
                'step 0'
                player.chooseCardTarget({
                  filterCard: function (card) {
                    return get.tag(card, 'damage');
                  },
                  filterTarget: function (card, player, target) {
                    return (trigger.player == target || trigger.targets.contains(target)) && target.countDiscardableCards(player, 'he') != 0;
                  },
                  selectTarget: [1, 2],
                  ai1: function (card) {
                    return 6 - get.value(card);
                  },
                  ai2: function (target) {
                    return -get.attitude(_status.event.player, target);
                  },
                  prompt: get.prompt2('jlsg_tuwei'),
                });
                'step 1'
                if (result.bool) {
                  player.discard(result.cards);
                  player.logSkill('jlsg_tuwei', result.targets);
                  event.targets = result.targets;
                  if (result.targets.length == 1) {
                    player.discardPlayerCard(event.targets[0], 'he', [1, 2], true);
                  } else {
                    player.discardPlayerCard(event.targets[0], 'he', true);
                  }
                } else {
                  event.finish();
                }
                'step 2'
                if (targets.length == 2) {
                  player.discardPlayerCard(targets[1], 'he', true);
                }
              },
              ai: {
                expose: 0.2
              }
            },
            // jlsg_xujin: {
            //     audio: "ext:极略:1",
            //     srlose: true,
            //     trigger: { player: 'phaseDrawBefore' },
            //     content: function () {
            //       "step 0"
            //       trigger.cancel();
            //       "step 1"
            //       event.cards = get.cards(5);
            //       if (event.isMine() == false) {
            //         event.dialog = ui.create.dialog('蓄劲', event.cards);
            //         game.delay(2);
            //       }
            //       if (event.cards.length > 0) {
            //         var obj = {};
            //         for (var i = 0; i < event.cards.length; i++) {
            //           var suit = get.suit(event.cards[i]);
            //           if (!obj[suit]) {
            //             obj[suit] = 0;
            //           }
            //           obj[suit] = obj[suit] + 1;
            //           if (event.cards[i].name == 'sha') obj[suit] = obj[suit] + 1;
            //         }
            //         var max = get.suit(event.cards.randomGet());
            //         ;
            //         for (var a in obj) {
            //           if (obj[a] > obj[max]) max = a;
            //         }
            //         event.suit = max;
            //       }
            //       "step 2"
            //       if (event.dialog) event.dialog.close();
            //       var dialog = ui.create.dialog('蓄劲', event.cards);
            //       player.chooseButton([1, 5], dialog, true).set("filterButton", function (button) {
            //         if (ui.selected.buttons.length == 0) return true;
            //         for (var i = 0; i < ui.selected.buttons.length; i++) {
            //           if (get.suit(button.link) == get.suit(ui.selected.buttons[i].link)) return true;
            //         }
            //         return false;
            //       }).set("ai", function (button) {
            //         return get.suit(button.link) == event.suit;
            //       });
            //       "step 3"
            //       player.storage.jlsg_xujin2 = result.buttons.length;
            //       player.addTempSkill('jlsg_xujin2', 'phaseAfter');
            //       event.cards2 = [];
            //       for (var i = 0; i < result.buttons.length; i++) {
            //         event.cards2.push(result.buttons[i].link);
            //         cards.remove(result.buttons[i].link);
            //       }
            //       player.chooseTarget('选择获得卡牌的目标', true).ai = function (target) {
            //         if (player == target) return 10;
            //         return get.attitude(player, target);
            //       }
            //       "step 4"
            //       if (event.cards2.length) {
            //         result.targets[0].gain(event.cards2, 'gain');
            //       }
            //       for (var i = 0; i < cards.length; i++) {
            //         ui.discardPile.appendChild(cards[i]);
            //       }
            //       game.delay(2);
            //     },
            //     ai: {
            //       threaten: 1.2
            //     }
            //   },
            jlsg_xujin: {
              audio: "ext:极略:1",
              srlose: true,
              trigger: { player: "phaseDrawBegin1", },
              forced: true,
              locked: false,
              content: function () {
                "step 0"
                event.cards = get.cards(5);
                game.cardsGotoOrdering(event.cards);
                player.showCards(event.cards, '蓄劲');
                "step 1"
                event.dialog = ui.create.dialog('是否发动【蓄劲】？选择一种花色的牌交给一名角色。', event.cards);
                var split = { spade: [], heart: [], club: [], diamond: [] };
                for (const card of event.cards) { // split the four suits
                  let suit = get.suit(card);
                  split[suit].push(card);
                }
                var controlList = [];
                for (const suit in split) {
                  if (split[suit].length)
                    controlList.push(lib.translate[suit]);
                }
                var next = player.chooseControl([...controlList, "取消"], event.dialog);
                // if (event.dialog) {
                //   next.set('prompt', event.dialog);
                // }
                next.set('ai', function () {
                  var splitValue = {};
                  for (const suit in split) {
                    splitValue[suit] = split[suit].reduce((v, b) => v + get.value(b, player), 0);
                  }
                  if (Object.keys(splitValue).some(suit => splitValue[suit] > 10)) {
                    let suit = Object.keys(splitValue).reduce((a, b) => splitValue[a] > splitValue[b] ? a : b);
                    return lib.translate[suit];
                  } else {
                    return "取消";
                  }
                });
                event._split = split;
                "step 2"
                if (result.control == "取消") {
                  event.finish();
                } else {
                  trigger.changeToZero();
                  for (const suit in event._split) {
                    if (lib.translate[suit] == result.control)
                      event.cards = event._split[suit];
                  }
                  player.storage.jlsg_xujin2 = event.cards.length;
                  player.addTempSkill('jlsg_xujin2', 'phaseAfter');
                  player.chooseTarget('选择获得卡牌的目标', true).ai = function (target) {
                    if (player == target) return 10;
                    return get.attitude(player, target);
                  }
                }

                "step 3"
                if (event.cards.length) {
                  result.targets[0].gain(event.cards, 'gain');
                }
                // for (var i = 0; i < cards.length; i++) {
                //   ui.discardPile.appendChild(cards[i]);
                // }
                game.delay();
              },
              ai: {
                threaten: 1.2
              }
            },
            jlsg_xujin2: {
              mark: true,
              intro: {
                content: function (storage, player) {
                  return '出杀次数+' + storage + ',攻击距离为' + storage
                }
              },
              mod: {
                cardUsable: function (card, player, num) {
                  if (card.name == 'sha') return num + player.storage.jlsg_xujin2 - 1;
                },
                attackFrom: function (from, to, distance) {
                  return distance - from.storage.jlsg_xujin2 + 1
                }
              },
            },
            jlsg_paoxiao: {
              audio: "ext:极略:1",
              srlose: true,
              trigger: { source: 'damageAfter' },
              filter: function (event, player) {
                return event.card && event.card.name == 'sha';
              },
              check: function (event, player) {
                return get.attitude(player, event.player) <= 0 && event.notLink();
              },
              priority: 5,
              content: function () {
                'step 0'
                player.draw();
                player.chooseToUse({ name: 'sha' }, function (card, target, player) {
                  return player.canUse({ name: 'sha' }, target, false);
                });
                'step 1'
                if (!result.bool) {
                  trigger.player.discardPlayerCard(player, 'he', true);
                }
              },
            },
            jlsg_benxi: {
              shaRelated: true,
              audio: "ext:极略:1",
              srlose: true,
              trigger: { player: 'shaBegin' },
              forced: true,
              content: function () {
                "step 0"
                trigger.target.chooseToDiscard('请弃置一张装备牌，否则不能使用闪抵消此杀', 'he', function (card) {
                  return get.type(card) == 'equip';
                }).ai = function (card) {
                  var num = trigger.target.countCards('h', 'shan');
                  if (num == 0) return 0;
                  return 8 - get.value(card);
                }
                "step 1"
                if (!result.bool) {
                  trigger.directHit = true;
                }
              },
              mod: {
                globalFrom: function (from, to, distance) {
                  return distance - 1;
                }
              }
            },
            jlsg_yaozhan: {
              audio: "ext:极略:1",
              srlose: true,
              enable: 'phaseUse',
              usable: 1,
              filterTarget: function (card, player, target) {
                return player != target && target.countCards('h') > 0;
              },
              filter: function (event, player) {
                return player.countCards('h') > 0;
              },
              content: function () {
                "step 0"
                player.chooseToCompare(target);
                "step 1"
                if (result.bool) {
                  player.draw('nodelay');
                  player.useCard({ name: 'sha' }, target, false);
                } else {
                  target.chooseToUse({ name: 'sha' }, player);
                }
              },
              ai: {
                order: function (name, player) {
                  var cards = player.get('h');
                  if (player.countCards('h', 'sha') == 0) {
                    return 1;
                  }
                  for (var i = 0; i < cards.length; i++) {
                    if (cards[i].name != 'sha' && cards[i].number > 11 && get.value(cards[i]) < 7) {
                      return 9;
                    }
                  }
                  return lib.card.sha.ai.order - 1;
                },
                result: {
                  player: function (player) {
                    if (player.countCards('h', 'sha') > 0) return 0.6;
                    var num = player.countCards('h');
                    if (num > player.hp) return 0;
                    if (num == 1) return -2;
                    if (num == 2) return -1;
                    return -0.7;
                  },
                  target: function (player, target) {
                    var num = target.countCards('h');
                    if (num == 1) return -1;
                    if (num == 2) return -0.7;
                    return -0.5
                  },
                },
                threaten: 1.3
              }
            },
            jlsg_wenjiu: {
              audio: "ext:极略:1",
              srlose: true,
              enable: 'phaseUse',
              usable: 1,
              marktext: '酒',
              filterCard: function (card) {
                return get.color(card) == 'black';
              },
              filter: function (event, player) {
                return player.countCards('h', { color: 'black' }) > 0;
              },
              check: function (card) {
                return 6 - get.value(card)
              },
              discard: false,
              prepare: function (cards, player) {
                player.$give(1, player);
              },
              content: function () {
                player.lose(cards[0], ui.special);
                player.storage.jlsg_wenjiu = player.storage.jlsg_wenjiu.concat(cards[0]);
                player.syncStorage('jlsg_wenjiu');
                player.markSkill('jlsg_wenjiu');
              },
              init: function (player) {
                player.storage.jlsg_wenjiu = [];
              },
              intro: {
                content: 'cards'
              },
              group: 'jlsg_wenjiu2',
              ai: {
                order: 10,
                result: {
                  player: function (player) {
                    return 2 - player.storage.jlsg_wenjiu.length;
                  }
                }
              }
            },
            jlsg_wenjiu2: {
              audio: "ext:极略:1",
              trigger: { player: 'shaBegin' },
              filter: function (event, player) {
                return player.storage.jlsg_wenjiu.length;
              },
              check: function (event, player) {
                return get.attitude(player, event.target) < 0;
              },
              content: function () {
                'step 0'
                player.chooseCardButton('请弃置一张「酒」，该伤害+1点', true, player.storage.jlsg_wenjiu).ai = function (button) {
                  if (get.attitude(player, trigger.target) < 0) return 1;
                  return 0;
                }
                'step 1'
                if (result.bool) {
                  player.$throw(result.links);
                  player.storage.jlsg_wenjiu.remove(result.links[0]);
                  ui.discardPile.appendChild(result.links[0]);
                  player.syncStorage('jlsg_wenjiu');
                  if (!player.storage.jlsg_wenjiu.length) {
                    player.unmarkSkill('jlsg_wenjiu');
                  }
                  player.addTempSkill('jlsg_wenjiu3', 'shaAfter');
                  player.addTempSkill('jlsg_wenjiu4', 'shaAfter');

                }
              }
            },
            jlsg_wenjiu3: {
              trigger: { source: 'damageBegin' },
              filter: function (event) {
                return event.card && event.card.name == 'sha' && event.notLink();
              },
              forced: true,
              popup: false,
              content: function () {
                trigger.num++;
              }
            },
            jlsg_wenjiu4: {
              trigger: { player: 'shaMiss' },
              priority: -1,
              forced: true,
              popup: false,
              content: function () {
                player.draw();
              }
            },
            jlsg_shuixi: {
              audio: "ext:极略:1",
              srlose: true,
              trigger: { player: 'phaseZhunbeiBegin' },
              filter: function (event, player) {
                return player.countCards('h') > 0
              },
              direct: true,
              content: function () {
                'step 0'
                player.chooseCardTarget({
                  filterTarget: function (card, player, target) {
                    return target != player;
                  },
                  filterCard: true,
                  ai1: function (card) {
                    return get.value(card);
                  },
                  ai2: function (target) {
                    return -get.attitude(player, target);
                  },
                  prompt: '水袭：展示一张手牌并选择一名其他角色'
                });
                'step 1'
                if (result.bool) {
                  event.target = result.targets[0];
                  event.card = result.cards[0];
                  player.logSkill('jlsg_shuixi', event.target);
                  player.showCards(event.card);
                  event.target.chooseToDiscard({ suit: get.suit(event.card) }).ai = function (card) {
                    if (event.target.hasSkillTag('maihp') && (event.target.hp > 2 || event.target.hasCard('tao', 'h'))) return -1;
                    return 7.9 - get.value(card);
                  }
                } else {
                  event.finish();
                }
                'step 2'
                if (result.bool) {
                  event.finish()
                } else {
                  event.target.loseHp();
                  player.addTempSkill('jlsg_shuixi2', 'phaseAfter');
                }
              },
              ai: {
                expose: 0.4
              }
            },
            jlsg_shuixi2: {
              mark: true,
              intro: {
                content: '水袭失败,不能使用【杀】'
              },
              mod: {
                cardEnabled: function (card) {
                  if (card.name == 'sha')
                    return false
                }
              }
            },
            jlsg_sanfen: {
              audio: "ext:极略:1",
              srlose: true,
              enable: 'phaseUse',
              usable: 1,
              filter: function (event, player) {
                // var num = 0;
                // for (var i = 0; i < game.players.length; i++) {
                //   if (game.players[i].sex == 'male' && game.players[i] != player) num++
                // }
                // return (num > 1);
                return game.players.length >= 3;
              },
              filterTarget: function (card, player, target) {
                return target != player && target.countCards('he');
              },
              targetprompt: ['先出杀', '对你出杀'],
              selectTarget: 2,
              multitarget: true,
              content: function () {
                'step 0'
                targets[0].chooseToUse({ name: 'sha' }, -1, targets[1]);
                'step 1'
                if (!result.bool) {
                  player.discardPlayerCard('he', targets[0]);
                }
                targets[1].chooseToUse({ name: 'sha' }, -1, player);
                'step 2'
                if (!result.bool) {
                  player.discardPlayerCard('he', targets[1]);
                }
              },
              ai: {
                order: 8,
                result: {
                  target: -3
                },
                expose: 0.4,
                threaten: 3,
              }
            },
            jlsg_guanxing: {
              audio: "ext:极略:1",
              srlose: true,
              trigger: { player: ['phaseZhunbeiBegin', 'phaseJieshuBegin'] },
              frequent: true,
              content: function () {
                var num = Math.min(3, game.countPlayer());
                player.chooseToGuanxing(num);
              },
              ai: {
                threaten: 1.2
              }
            },
            jlsg_weiwo: {
              audio: "ext:极略:1",
              srlose: true,
              trigger: { player: 'damageBegin' },
              filter: function (event, player) {
                if (event.nature && player.countCards('h')) return true;
                if (!event.nature && !player.countCards('h')) return true;
                return false;
              },
              mark: true,
              forced: true,
              content: function () {
                trigger.cancel();

              },
              ai: {
                nofire: function (player) {
                  return player.countCards('h') > 0;
                },
                nothunder: function (player) {
                  return player.countCards('h') > 0;
                },
                effect: {
                  target: function (card, player, target, current) {
                    if (get.tag(card, 'natureDamage') && target.countCards('h') > 0) return 0;
                    if (card.name == 'tiesuo' && target.countCards('h') > 0) return [0, 0];
                    if (!get.tag(card, 'natureDamage') && !target.countCards('h')) return [0, 0];
                  }
                },
              },
              intro: {
                content: function (storage, player) {
                  var str = '';
                  if (player.countCards('h')) {
                    str += '防止属性伤害';
                  } else {
                    str += '防止非属性伤害';
                  }
                  return str;
                }
              }
            },
            jlsg_shouji: {
              audio: "ext:极略:1",
              srlose: true,
              enable: 'phaseUse',
              usable: 1,
              filter: function (event, player) {
                return player.countCards('he');
              },
              check: function (card) {
                return 10 - get.value(card)
              },
              filterCard: true,
              position: 'he',
              getCardName(card) {
                switch (get.suit(card)) {
                  case 'heart':
                    return 'shunshou';
                    break;
                  case 'diamond':
                    return 'huogong';
                    break;
                  case 'club':
                    return 'jiedao';
                    break;
                  case 'spade':
                    return 'juedou';
                    break;
                }
              },
              filterTarget: function (card, player, target) {
                var cardName = lib.skill.jlsg_shouji.getCardName(card);
                if (ui.selected.targets.length == 2) {
                  return lib.filter.filterTarget({ name: 'sha' }, ui.selected.targets[1], target);
                }
                if (ui.selected.targets.length == 1) {
                  // canUse is not compatible with modified select jiedao
                  if (cardName === 'jiedao') {
                    var targetEnabled = function (player, target) {
                      var card = { name: cardName, isCard: true };
                      var info = get.info(card);
                      var mod = game.checkMod(card, player, target, 'unchanged', 'playerEnabled', player);
                      if (mod == false) return false;
                      // should not check target enabled mod
                      return true;
                    }
                    if (!targetEnabled(ui.selected.targets[0], target)) return false;
                    return target.getEquip(1) &&
                      game.hasPlayer(shaTarget => lib.filter.filterTarget({ name: 'sha' }, target, shaTarget));
                  }
                  return ui.selected.targets[0].canUse({ name: cardName }, target);
                }
                // return game.hasPlayer(p => target.canUse({ name: cardName }, p));
                return true;
              },
              targetprompt: ['发起者', '承受者', '出杀目标'],
              selectTarget: function () {
                if (!ui.selected.cards.length) return 2;
                return lib.skill.jlsg_shouji.getCardName(ui.selected.cards[0]) == 'jiedao' ? 3 : 2;
              },
              multitarget: true,
              content: function () {
                var cardName = lib.skill.jlsg_shouji.getCardName(cards[0]);
                if (cardName != 'jiedao') {
                  targets[0].useCard({ name: cardName }, targets[1], 'noai');
                } else {
                  targets[0].useCard({ name: cardName }, [targets[1], targets[2]], 'noai');
                }
                // var prompt = `###${get.translation(event.name)}###选择${get.name(targets[1])}出杀目标`;
                // player.chooseTarget(prompt,shaTarget => lib.filter.filterTarget({name:'sha'},target,shaTarget));
                // targets[0].useCard({ name: 'jiedao' }, [targets[1], result.targets[0]], 'noai');
              },
              ai: {
                order: 6,
                fireattack: true,
                result: {
                  target: function (player, target) {
                    if (ui.selected.targets.length == 0) {
                      return 3;
                    } else {
                      var card = ui.selected.cards[0];
                      var next = lib.skill.jlsg_shouji.getCardName(card);
                      if (next == 'jiedao') return -1.5;
                      return get.effect(target, { name: next }, ui.selected.targets[0], target);
                    }
                  }
                },
              }
            },
            jlsg_hemou: {
              audio: "ext:极略:1",
              srlose: true,
              trigger: { global: 'phaseUseBegin' },
              filter: function (event, player) {
                return event.player != player && player.countCards('h') > 0;
              },
              direct: true,
              content: function () {
                'step 0'
                player.chooseCard('是否对' + get.translation(trigger.player) + '发动【合谋】?').ai = function (card) {
                  if (get.attitude(player, trigger.player) > 0 && !trigger.player.countCards('j', 'lebu') && trigger.player.countCards('h') > 2) return 4 - get.value(card);
                  return false;
                }
                'step 1'
                if (result.bool) {
                  player.logSkill('jlsg_hemou', trigger.player);
                  trigger.player.gain(result.cards);
                  player.$give(1, trigger.player);
                  switch (get.suit(result.cards[0])) {
                    case 'heart':
                      trigger.player.addTempSkill('jlsg_hemou_heart', 'phaseAfter');
                      break;
                    case 'diamond':
                      trigger.player.addTempSkill('jlsg_hemou_diamond', 'phaseAfter');
                      break;
                    case 'club':
                      trigger.player.addTempSkill('jlsg_hemou_club', 'phaseAfter');
                      break;
                    case 'spade':
                      trigger.player.addTempSkill('jlsg_hemou_spade', 'phaseAfter');
                      break;
                  }
                } else {
                  event.finish();
                }
              },
              ai: {
                expose: 0.1,
              },
              subSkill: {
                heart: {
                  enable: 'phaseUse',
                  usable: 1,
                  marktext: '♥︎',
                  mark: true,
                  viewAs: { name: 'shunshou' },
                  viewAsFilter: function (player) {
                    if (!player.countCards('hs', { suit: 'heart' })) return false;
                  },
                  prompt: '将一张♥︎手牌当顺手牵羊使用',
                  position: 'hs',
                  filterCard: function (card, player) {
                    return get.suit(card) == 'heart';
                  },
                  check: function (card) {
                    return 6 - get.value(card);
                  },
                  intro: {
                    name: '合谋·顺手',
                    content: '本回合内限一次,可将一张♥︎牌当顺手牵羊使用.'
                  }
                },
                diamond: {
                  enable: 'chooseToUse',
                  usable: 1,
                  marktext: '♦︎',
                  mark: true,
                  viewAs: { name: 'huogong', nature: 'fire' },
                  position: 'hs',
                  filterCard: function (card, player) {
                    return get.suit(card) == 'diamond';
                  },
                  viewAsFilter: function (player) {
                    if (!player.countCards('hs', { suit: 'diamond' })) return false;
                  },
                  prompt: '将一张♦︎手牌当火攻使用',
                  check: function (card) {
                    var player = _status.currentPhase;
                    if (player.countCards('h') > player.hp) {
                      return 6 - get.value(card);
                    }
                    return 4 - get.value(card)
                  },
                  ai: {
                    fireattack: true,
                  },
                  intro: {
                    name: '合谋·火攻',
                    content: '本回合内限一次,可将一张♦︎牌当火攻使用.'
                  }
                },
                club: {
                  enable: 'phaseUse',
                  usable: 1,
                  marktext: '♣︎',
                  mark: true,
                  viewAs: { name: 'jiedao' },
                  position: 'hs',
                  filterCard: function (card, player) {
                    return get.suit(card) == 'club';
                  },
                  viewAsFilter: function (player) {
                    if (!player.countCards('hs', { suit: 'club' })) return false;
                  },
                  prompt: '将一张♣︎手牌当借刀杀人使用',
                  check: function (card) {
                    return 6 - get.value(card);
                  },
                  intro: {
                    name: '合谋·借刀',
                    content: '本回合内限一次,可将一张♣︎牌当借刀杀人使用.'
                  }
                },
                spade: {
                  enable: 'phaseUse',
                  usable: 1,
                  marktext: '♠︎',
                  mark: true,
                  viewAs: { name: 'juedou' },
                  position: 'hs',
                  prompt: '将一张♠︎手牌当决斗使用',
                  filterCard: function (card, player) {
                    return get.suit(card) == 'spade';
                  },
                  viewAsFilter: function (player) {
                    if (!player.countCards('hs', { suit: 'spade' })) return false;
                  },
                  check: function (card) {
                    return 6 - get.value(card);
                  },
                  ai: {
                    order: 5
                  },
                  intro: {
                    name: '合谋·决斗',
                    content: '回合限一次,可将一张♠︎牌当决斗使用.'
                  }
                },
              }
            },
            jlsg_qicai: {
              audio: "ext:极略:1",
              srlose: true,
              trigger: { player: 'loseEnd' },
              frequent: true,
              filter: function (event, player) {
                for (var i = 0; i < event.cards.length; i++) {
                  if (event.cards[i].original == 'h') return true;
                }
                return false;
              },
              content: function () {
                'step 0'
                player.judge(function (card) {
                  if (get.color(card) == 'red') return 2;
                  return -2;
                }).judge2 = result => result.bool;
                'step 1'
                if (result.bool) {
                  player.draw();
                }
              },
              ai: {
                threaten: 4,
                order: 15,
                result: {
                  player: 1
                },
                effect: {
                  target: function (card) {
                    if (card.name == 'guohe' || card.name == 'liuxinghuoyu') return 0.3;
                  }
                }
              }
            },
            jlsg_rende: {
              audio: "ext:极略:1",
              srlose: true,
              trigger: { global: 'phaseJieshuEnd' },
              filter: function (event, player) {
                return player.countCards('h') != 0 && event.player.isAlive();
              },
              direct: true,
              content: function () {
                'step 0'
                player.chooseCard('是否对' + get.translation(trigger.player) + '发动【仁德】?', [1, player.countCards('h')]).ai = function (card) {
                  if (player == trigger.player) return 6;
                  if (get.attitude(player, trigger.player) > 1) {
                    if (trigger.player.countUsed('sha') > 0 && ['sha', 'jiu'].contains(card.name)) {
                      return 6.5 - get.value(card);
                    }
                    var skills = trigger.player.getSkills(false);
                    for (var i = 0; i < skills.length; i++) {
                      var info = get.info(skills[i]);
                      if (info && info.enable == 'phaseUse' && ui.selected.cards.length == 0) return 6.6 - get.value(card);
                    }
                    return 4 - get.value(card);
                  } else {
                    return get.useful(card) < 0;
                  }
                  return false;
                }
                'step 1'
                if (result.bool) {
                  player.logSkill('jlsg_rende', trigger.player);
                  trigger.player.gain(result.cards);
                  player.$give(result.cards.length, trigger.player);
                  game.delay();
                  // .player.getStat().card={};
                } else {
                  event.finish();
                }
                'step 2'
                trigger.player.stat.push({ card: {}, skill: {} });
                trigger.player.phaseUse();
              },
              ai: {
                expose: 0.2
              }
            },
            jlsg_chouxi: {
              audio: "ext:极略:2",
              usable: 1,
              srlose: true,
              enable: 'phaseUse',
              filter: function (event, player) {
                return player.countCards('h') > 0;
              },
              filterTarget: function (card, player, target) {
                return player != target;
              },
              check: function (card) {
                return 7 - get.value(card)
              },
              filterCard: true,
              content: function () {
                'step 0'
                event.cards1 = get.cards(2);
                player.showCards(event.cards1);
                event.types = [];
                for (var c of event.cards1) {
                  event.types.add(get.type(c, 'trick'));
                }
                event.types.sort();
                var prompt = '弃置一张与展示牌类别均不同的牌,然后让' + get.translation(player) + '获得' + get.translation(event.cards1) +
                  ',或受到来自' + get.translation(player) + '的1点伤害并获得其中一种类别的牌.';
                event.dialog = ui.create.dialog(prompt, 'hidden');
                event.dialog.classList.add('noselect');
                event.dialog.add(event.cards1);
                player.line(target);
                var cardDiff = 0; // value from card ownership
                for (var type of event.types) {
                  var newCardDiff = event.cards1
                    .filter(c => get.type(c) == type)
                    .reduce((a, b) => a - get.value(b, player) * Math.sign(get.attitude(target, player)) + get.value(b, target), 0);
                  if (newCardDiff > cardDiff) {
                    cardDiff = newCardDiff;
                  }
                }
                target.chooseToDiscard(dialog, function (card) {
                  let event = _status.event.getParent();
                  return !event.types.contains(get.type(card, 'trick'));
                }).set('ai', function (card, cards) {
                  if (card.name == 'tao') return -1;
                  return _status.event.diff - get.value(card);
                }).set('diff', cardDiff + 1.5 * get.damageEffect(target, player));
                'step 1'
                if (result.bool) {
                  player.gain(event.cards1, 'gain2');
                  event.finish();
                } else {
                  target.damage();
                }
                'step 2'
                if (!target.isAlive()) {
                  event.finish();
                  return;
                }
                if (event.types.length == 1) {
                  return;
                }
                let values = {};
                for (var c of event.cards1) {
                  var type = get.type2(c);
                  values[type] = values[type] || 0;
                  values[type] += get.value(c, player) + (get.attitude(player, target) < -1 ? get.value(c, target) : 0);
                }
                if (values) {
                  event.choice = Object.keys(values)[0];
                  for (var type in values) {
                    if (values[type] > values[event.choice]) {
                      event.choice = type;
                    }
                  }
                }
                var dialog = ui.create.dialog('仇袭：选择一种类型的卡牌卡牌获得之', event.cards1);
                target.chooseControl(event.types, dialog, function (event, player) {
                  return event.choice;
                });
                'step 3'
                var cards = [[], []];
                if (event.types.length == 1) {
                  event.type = event.types[0];
                } else {
                  event.type = result.control;
                }
                target.popup(event.type);
                for (var card of event.cards1) {
                  if (get.type(card, 'trick') == event.type) {
                    cards[0].push(card);
                  } else {
                    cards[1].push(card);
                  }
                }
                target.gain(cards[0], 'gain2');
                player.gain(cards[1], 'gain2');
              },
              ai: {
                order: 4,
                result: {
                  player: 0.5,
                  target: -1,
                }
              }
            },
            jlsg_yongbing: {
              unique: true,
              audio: 'ext:极略:true',
              zhuSkill: true,
              global: 'jlsg_yongbing2'
            },
            jlsg_yongbing2: {
              trigger: { source: 'damageEnd' },
              filter: function (event, player) {
                if (player.group != 'shu') return false;
                if (!event.card || event.card.name != 'sha') return false;
                return game.hasPlayer(function (target) {
                  return player != target && target.hasZhuSkill('jlsg_yongbing', player);
                });
              },
              direct: true,
              content: function () {
                'step 0'
                var list = [];
                for (var i = 0; i < game.players.length; i++) {
                  if (game.players[i] != player && game.players[i].hasZhuSkill('jlsg_yongbing', player)) {
                    list.push(game.players[i]);
                  }
                }
                event.list = list;
                'step 1'
                if (event.list.length) {
                  var current = event.list.shift();
                  event.current = current;
                  player.chooseBool('是否对' + get.translation(current) + '发动【拥兵】？').set('choice', get.attitude(player, current) > 0);
                } else {
                  event.finish();
                }
                'step 2'
                if (result.bool) {
                  player.logSkill('jlsg_yongbing', event.current);
                  event.current.draw();
                }
                event.goto(1);
              },
              ai: {
                expose: 0.2,
              }
            },
            jlsg_zhaoxiang: {
              audio: "ext:极略:1",
              srlose: true,
              trigger: { global: 'shaBegin' },
              filter: function (event, player) {
                return event.player != player;
              },
              direct: true,
              content: function () {
                'step 0'
                if (!trigger.player.inRangeOf(player) && (trigger.target != player && !trigger.target.inRangeOf(player))) {
                  var next = player.chooseBool(get.prompt('jlsg_zhaoxiang', trigger.player));
                  next.ai = function () {
                    return get.effect(trigger.target, trigger.card, trigger.player, player) < 0;
                  };
                } else {
                  var next = player.chooseToDiscard(get.prompt('jlsg_zhaoxiang', trigger.player));
                  next.ai = function (card) {
                    var income = Math.min(-get.effect(trigger.target, trigger.card, trigger.player, player) * 1.5,
                      get.effect(trigger.player, { name: 'shunshou' }, player, player) / 1.5
                    );
                    return income - get.value(card);
                  };
                }
                'step 1'
                if (result.bool) {
                  player.logSkill('jlsg_zhaoxiang', trigger.player);
                  if (trigger.player.countCards('h')) {
                    trigger.player.chooseCard('交给' + get.translation(player) + '一张牌或令打出的杀无效').set('ai', function (card) {
                      if (get.effect(player, trigger.card, trigger.player, trigger.player) < 0) {
                        return -1;
                      }
                      if (_status.event.getParent().player.hasSkill('jiu')) {
                        return 7 - get.value(card);
                      } else {
                        return 6 - get.value(card);
                      }
                    });
                  } else {
                    trigger.untrigger();
                    trigger.finish();
                    event.finish();
                  }
                } else {
                  event.finish();
                }
                'step 2'
                if (!result.bool) {
                  trigger.untrigger();
                  trigger.finish();
                } else {
                  player.gain(result.cards, trigger.player, 'giveAuto');
                }
              },
              ai: {
                expose: 0.5,
              }
            },
            jlsg_zhishi: {
              audio: "ext:极略:2",
              srlose: true,
              enable: 'phaseUse',
              usable: 1,
              filterTarget: function (card, player, target) {
                return player != target;
              },
              content: function () {
                'step 0'
                if (!target.countDiscardableCards(target, 'h')) {
                  target.damage(player);
                  target.recover();
                  event.finish();
                  return;
                }
                target.chooseToDiscard('弃置一张基本牌，并回复一点体力。或受到一点伤害并回复一点体力。', { type: 'basic' }).ai = function (card) {
                  if (target.hasSkillTag('maixie') && target.hp > 1) return 0;
                  if (get.recoverEffect(target, target, target) > 0) return 7.5 - get.value(card);
                  return -1;
                }
                'step 1'
                if (result.bool) {
                  target.recover();
                } else {
                  target.damage(player);
                  target.recover();
                }
              },
              ai: {
                order: 8,
                result: {
                  target: function (player, target) {
                    var result = 0;
                    if (target.hasSkillTag('maixie_hp') || target.hasSkillTag('maixie')) result += 0.5;
                    if (target.hp == 1 && (target.countCards('h') <= 1 || target.maxHp == 1)) result -= 2;
                    if (target.hp < target.maxHp) {
                      result += Math.min(0.4, target.countCards('h') * 0.1);
                    }
                    // if (!target.isHealthy() && target.hasCard(function (card) {
                    //   return get.type(card) == 'basic';
                    // }, 'h')) return 0.6;
                    // if (target.hp > 1) return 0.4;

                    return result;
                  }
                }
              }
            },
            jlsg_jianxiong: {
              unique: true,
              audio: 'ext:极略:true',
              global: 'jlsg_jianxiong2',
              zhuSkill: true,
            },
            jlsg_jianxiong2: {
              trigger: { player: 'damageEnd' },
              filter: function (event, player) {
                if (player.group != 'wei') return false;
                return game.hasPlayer(function (target) {
                  return event.source != target && target != player && target.hasZhuSkill('jlsg_jianxiong', player) && event.source != target;
                }) && get.itemtype(event.cards) == 'cards' && get.position(event.cards[0]) == 'd' && player.countCards('h') > 0;
              },
              direct: true,
              content: function () {
                'step 0'
                var list = [];
                for (var i = 0; i < game.players.length; i++) {
                  if (game.players[i] != player && game.players[i].hasZhuSkill('jlsg_jianxiong', player)) {
                    list.push(game.players[i]);
                  }
                }
                event.list = list;
                'step 1'
                if (event.list.length) {
                  var current = event.list.shift();
                  event.current = current;
                  player.chooseToDiscard(get.prompt2('jlsg_jianxiong', current)).set('ai', function (card) {
                    if (get.attitude(_status.event.player, _status.event.current) > 0) {
                      return 6 - get.value(card);
                    }
                    return 0;
                  }).set('logSkill', ['jlsg_jianxiong', event.current]);
                } else {
                  event.finish();
                }
                'step 2'
                if (result.bool) {
                  event.current.gain(trigger.cards, 'gain2');
                  game.log(event.current, '获得了', trigger.cards);
                }
                event.goto(1);
              },
              ai: {
                expose: 0.1,
              }
            },

            jlsg_zhonghou: {
              unique: true,
              audio: "ext:极略:1",
              srlose: true,
              trigger: {
                global: ['useCardBefore', 'respondBefore'],
              },
              // silent:true,
              forced: true,
              popup: false,
              firstDo: true,
              filter: function (event, player) {
                return event.skill && event.skill.startsWith('jlsg_zhonghou_');
              },
              content: function () {
                'step 0'
                if (trigger.player == player) {
                  if (player.isPhaseUsing()) {
                    player.addTempSkill('jlsg_zhonghou_phase');
                  }
                  event.goto(2);
                } else {
                  var prompt = `是否失去1点体力视为${get.translation(trigger.player)}使用一张${get.translation(trigger.card)}？`;
                  player.chooseBool(prompt, get.attitude(player, trigger.player) >= 6);
                }
                'step 1'
                if (!result.bool) {
                  trigger.player.addTempSkill('jlsg_zhonghou_phase');
                  game.log(player, Math.random() < 0.5 ? '丑拒了' : '蠢拒了', trigger.player);
                  player.chat('拒绝');
                  trigger.cancel();
                  trigger.getParent().goto(0);
                  event.finish();
                  game.delayx();
                }
                'step 2'
                player.loseHp();
              },
              global: ['jlsg_zhonghou_shan', 'jlsg_zhonghou_global'],
            },
            jlsg_zhonghou_phase: {

            },
            jlsg_zhonghou_global: {
              enable: ["chooseToUse", "chooseToRespond"],
              audio: 'jlsg_zhonghou',
              hiddenCard: function (player, name) {
                return get.type(name) == 'basic' && name != 'shan';
              },
              filter: function (event, player) {
                if (player.hasSkill('jlsg_zhonghou_phase')) return false;
                var criterion0 = game.hasPlayer(function (target) {
                  return (player == target && (target.hasSkill('jlsg_zhonghou') || target.hiddenSkills.contains('jlsg_zhonghou')) ||
                    player.inRangeOf(target) && target.hasSkill('jlsg_zhonghou')) && !target.isDying();
                });
                if (!criterion0) return false;
                for (var i of lib.inpile) {
                  if (get.type(i) != 'basic' || i == 'shan') continue;
                  if (event.filterCard({ name: i }, player, event)) return true;
                  if (i == 'sha' && lib.inpile_nature.some(nat => event.filterCard({ name: i, nature: nat }, player, event))) {
                    return true;
                  }
                }
                return false;
              },
              chooseButton: {
                dialog: function () {
                  var list = [];
                  for (var i of lib.inpile) {
                    if (i == 'shan') continue;
                    var type = get.type(i);
                    if (type != 'basic') continue;
                    list.push([type, '', i]);
                    if (i == 'sha') {
                      for (var j of lib.inpile_nature) list.push([type, '', i, j]);
                    }
                  }
                  return ui.create.dialog('忠候', [list, 'vcard']);
                },
                filter: function (button, player) {
                  var evt = _status.event.getParent();
                  return evt.filterCard({ name: button.link[2], nature: button.link[3] }, player, evt);
                },
                check: function (button) {
                  var player = _status.event.player;
                  var card = { name: button.link[2], nature: button.link[3] };
                  var val = _status.event.getParent().type == 'phase' ? player.getUseValue(card) : 1;
                  if (val <= 0) return 0;
                  return val;
                },
                backup: function (links, player) {
                  return {
                    viewAs: {
                      name: links[0][2],
                      nature: links[0][3],
                    },
                    filterCard: function () {
                      return false;
                    },
                    selectCard: -1,
                    onuse: function (event, player) {
                      player.logSkill('jlsg_zhonghou');
                    },
                    onrespond: function (event, player) {
                      player.logSkill('jlsg_zhonghou');
                    },
                    // ai1:function(card){
                    //   var player=_status.event.player;
                    //   var hasEnemy=game.hasPlayer(function(current){
                    //     return current!=player&&!current.hasSkill('rechanyuan')&&(get.realAttitude||get.attitude)(current,player)<0;
                    //   });
                    //   var cardx=lib.skill.reguhuo_backup.viewAs;
                    //   if(hasEnemy){
                    //     if(card.name==cardx.name&&(card.name!='sha'||card.nature==cardx.nature)) return 10;
                    //     return 0;
                    //   }
                    //   return 6-get.value(card);
                    // },
                  }
                },
              },
              ai: {
                fireAttack: true,
                respondSha: true,
                skillTagFilter: function (player, tag) {
                  if (player.hasSkill('jlsg_zhonghou_phase')) return false;
                  return game.hasPlayer(function (target) {
                    return (player == target && (target.hasSkill('jlsg_zhonghou') || target.hiddenSkills.contains('jlsg_zhonghou')) ||
                      player.inRangeOf(target) && target.hasSkill('jlsg_zhonghou')) && !target.isDying();
                  });
                },
              },
            },
            jlsg_zhonghou_shan: {
              audio: 'jlsg_zhonghou',
              enable: ['chooseToUse', 'chooseToRespond'],
              filter: function (event, player) {
                if (player.hasSkill('jlsg_zhonghou_phase')) return false;
                return game.hasPlayer(function (target) {
                  return (player == target && (target.hasSkill('jlsg_zhonghou') || target.hiddenSkills.contains('jlsg_zhonghou')) ||
                    player.inRangeOf(target) && target.hasSkill('jlsg_zhonghou')) && !target.isDying();
                });
              },
              filterCard: function () {
                return false;
              },
              check: function (event, player) {
                return !player.hasShan();
              },
              selectCard: -1,
              viewAs: {
                name: "shan",
              },
              onuse: function (event, player) {
                player.logSkill('jlsg_zhonghou');
              },
              onrespond: function (event, player) {
                player.logSkill('jlsg_zhonghou');
              },
              ai: {
                respondShan: true,
              }
            },
            jlsg_ganglie: {
              audio: "ext:极略:1",
              trigger: { player: 'phaseUseBegin' },
              srlose: true,
              check: function (event, player) {
                if (player.countCards('h') < 3 && player.hp < 2) return false;
                return game.hasPlayer(function (current) {
                  return get.tag(event.card, 'damage') && get.attitude(player, current) < 0;
                });
              },
              content: function () {
                player.loseHp();
                player.addTempSkill('jlsg_ganglie_damage', 'phaseAfter');
                player.addTempSkill('jlsg_ganglie_phaseEnd', 'phaseAfter');
              },
              subSkill: {
                damage: {
                  trigger: { source: 'damageBegin' },
                  forced: true,
                  filter: function (event) {
                    return event.num > 0;
                  },
                  content: function () {
                    trigger.num++;
                    player.removeSkill('jlsg_ganglie_damage');
                  }
                },
                phaseEnd: {
                  audio: "ext:极略:2",
                  trigger: { player: 'phaseEnd' },
                  forced: true,
                  filter: function (event, player) {
                    return player.getStat('damage') > 0;
                  },
                  content: function () {
                    player.draw(player.getStat('damage'));
                  }
                }
              }
            },
          },
          translate: {
            jlsg_sr: "SR武将",
            jlsgsr_choice: '抉择',
            jlsgsr_zhangliao: 'SR张辽',
            jlsgsr_xiahoudun: 'SR夏侯惇',
            jlsgsr_zhenji: 'SR甄姬',
            jlsgsr_xuzhu: 'SR许褚',
            jlsgsr_simayi: 'SR司马懿',
            jlsgsr_guojia: 'SR郭嘉',
            jlsgsr_caocao: 'SR曹操',
            jlsgsr_zhaoyun: 'SR赵云',
            jlsgsr_zhangfei: 'SR张飞',
            jlsgsr_machao: 'SR马超',
            jlsgsr_guanyu: 'SR关羽',
            jlsgsr_zhugeliang: 'SR诸葛亮',
            jlsgsr_huangyueying: 'SR黄月英',
            jlsgsr_liubei: 'SR刘备',
            jlsgsr_sunshangxiang: 'SR孙尚香',
            jlsgsr_daqiao: 'SR大乔',
            jlsgsr_huanggai: 'SR黄盖',
            jlsgsr_lvmeng: 'SR吕蒙',
            jlsgsr_zhouyu: 'SR周瑜',
            jlsgsr_ganning: 'SR甘宁',
            jlsgsr_luxun: 'SR陆逊',
            jlsgsr_sunquan: 'SR孙权',
            jlsgsr_lvbu: 'SR吕布',
            jlsgsr_huatuo: 'SR华佗',
            jlsgsr_diaochan: 'SR貂蝉',
            jlsgsr_shuangxiong: 'SR颜良文丑',
            jlsg_wuwei: '无畏',
            jlsg_yansha: '掩杀',
            jlsg_yansha2: '掩杀',
            jlsg_yansha3: '掩杀',
            zh_mark: '忠候',
            jlsg_zhonghou: '忠侯',
            jlsg_zhonghou_global: '忠侯',
            jlsg_zhonghou_shan: '忠侯',
            jlsg_ganglie: '刚烈',
            jlsg_liuyun: '流云',
            jlsg_lingbo: '凌波',
            jlsg_lingbo1: "凌波·送牌",
            jlsg_lingbo2: "凌波·弃牌",
            jlsg_aozhan: '鏖战',
            jlsg_aozhan2: '鏖战',
            jlsg_huxiao: '虎啸',
            jlsg_huxiao2: '虎啸',
            // jlsg_qingcheng_zhu: '倾城',
            // jlsg_qingcheng_yin: "倾城",
            // jlsg_qingcheng_yang: "倾城",
            // jlsg_qingcheng_yin1: '倾城·杀',
            // jlsg_qingcheng_yin2: "倾城·闪",
            // jlsg_qingcheng_yang1: '倾城·杀',
            // jlsg_qingcheng_yang2: '倾城·闪',
            jlsg_qingcheng: '倾城',
            jlsg_qingcheng2: '倾城',
            jlsg_guicai: '鬼才',
            jlsg_langgu: '狼顾',
            jlsg_langgu2: '狼顾',
            jlsg_zhuizun: '追尊',
            jlsg_zhuizun2: '追尊',
            jlsg_tianshang: '天殇',
            jlsg_yiji: '遗计',
            jlsg_huiqu: '慧觑',
            jlsg_zhaoxiang: '招降',
            jlsg_zhishi: '治世',
            jlsg_jianxiong: '奸雄',
            jlsg_jianxiong2: '奸雄',
            jlsg_jiuzhu: '救主',
            jlsg_jiuzhu2: '救主',
            jlsg_tuwei: '突围',
            jlsg_xujin: '蓄劲',
            jlsg_xujin2: '蓄劲',
            jlsg_paoxiao: '咆哮',
            jlsg_benxi: '奔袭',
            jlsg_yaozhan: '邀战',
            jlsg_wenjiu: '温酒',
            jlsg_wenjiu2: '温酒',
            jlsg_wenjiu3: '温酒',
            jlsg_wenjiu4: '温酒',
            jlsg_shuixi: '水袭',
            jlsg_shuixi2: '水袭',
            jlsg_sanfen: '三分',
            jlsg_guanxing: '观星',
            jlsg_weiwo: '帷幄',
            jlsg_shouji: '授计',
            jlsg_hemou: '合谋',
            jlsg_qicai: '奇才',
            jlsg_rende: '仁德',
            jlsg_chouxi: '仇袭',
            jlsg_yongbing: '拥兵',
            jlsg_yongbing2: '拥兵',
            jlsg_yinmeng: '姻盟',
            jlsg_xianger: '香饵',
            jlsg_xianger2: "香饵·标记",
            jlsg_juelie: '决裂',
            jlsg_fangxin: '芳馨',
            jlsg_xiyu: '细语',
            jlsg_wanrou: '婉柔',
            jlsg_wanrou2: '婉柔',
            jlsg_zhouyan: '舟焰',
            jlsg_zhaxiang: '诈降',
            jlsg_shixue: '誓学',
            jlsg_guoshi: '国士',
            jlsg_guoshi2: '国士',
            jlsg_yingcai: '英才',
            jlsg_weibao: '伪报',
            jlsg_choulve: '筹略',
            jlsg_jiexi: '劫袭',
            jlsg_youxia: '游侠',
            jlsg_huailing: '怀铃',
            jlsg_dailao: '待劳',
            jlsg_youdi: '诱敌',
            jlsg_youdi2: '诱敌',
            jlsg_ruya: '儒雅',
            jlsg_quanheng: '权衡',
            jlsg_xionglve: '雄略',
            jlsg_xionglve2: '雄略',
            jlsg_xionglve2_backup: '雄略',
            jlsg_fuzheng: '辅政',
            jlsg_jiwu: '极武',
            jlsg_jiwu2: '极武',
            jlsg_jiwu3: '极武',
            jlsg_jiwu4: '极武',
            jlsg_sheji: '射戟',
            jlsg_sheji2: '射戟',
            jlsg_xingyi: '行医',
            jlsg_guagu: '刮骨',
            jlsg_wuqin: '五禽',
            jlsg_lijian: '离间',
            jlsg_manwu: '曼舞',
            jlsg_baiyue: '拜月',
            jlsg_old_zhishi: '治世',
            jlsg_old_youxia: '游侠',
            jlsg_old_jiexi: '劫袭',
            jlsg_xiwu: '习武',
            jlsg_old_yingcai: '英才',
            jlsg_old_yiji: '遗计',
            jlsg_old_zhaxiang: '诈降',
            jlsg_old_huxiao: '虎啸',
            jlsg_old_dailao: '待劳',
            jlsg_old_youdi: '诱敌',
            jlsg_old_youdi2: '诱敌',
            jlsg_old_ruya: '儒雅',

            jlsg_old_dailao_info: '出牌阶段限一次，你可以令一名其他角色与你各摸一张牌或各弃置一张牌，然后你与其依次将武将牌翻面。',
            jlsg_old_youdi_info: '若你的武将牌背面朝上，你可以将其翻面来视为你使用一张【闪】。每当你使用【闪】响应一名角色使用的【杀】时，你可以额外弃置任意数量的手牌，然后该角色弃置等量的牌。',
            jlsg_old_ruya_info: '当你失去最后的手牌时，你可以翻面并将手牌补至你体力上限的张数。',
            jlsg_wuwei_info: '摸牌阶段，你可以放弃摸牌，改为亮出牌堆顶的3张牌，其中每有一张基本牌，你便可视为对一名其他角色使用一张【杀】(每阶段对每名角色限一次)。然后将这些基本牌置入弃牌堆，其余收入手牌。',
            jlsg_yansha_info: '摸牌阶段，你可以少摸一张牌。若如此做，本回合弃牌阶段开始时，你可以将一张手牌置于武将牌上，称为「掩」。当一名角色使用【杀】选择目标后，你可以将一张「掩」置入弃牌堆，然后获得其两张牌。',
            jlsg_yansha2_info: '一名角色使用【杀】选择目标后，你可以将一张「掩」置入弃牌堆，然后获得其两张牌。',
            jlsg_zhonghou_info: '当你攻击范围内的一名角色需要使用或打出一张基本牌时，该角色可以向你请求之，你可以失去1点体力，视为该角色使用此牌；若你拒绝，则取消此次响应。（你的濒死阶段除外）',
            jlsg_zhonghou_append: '<span style="font-family: yuanli">一名其他角色被你拒绝后，其本回合内不能再次发动忠候。你不能拒绝自己请求的忠候。</span>',
            jlsg_liuyun_info: '出牌阶段限一次，你可以横置你的武将牌并弃置一张黑色牌，然后令一名角色选择一项：回复1点体力，或摸两张牌。',
            // jlsg_lingbo_info: '当一名其他角色回合结束时，若你的武将牌横置时，你可以将一张自己装备区的牌移至该角色的合理区域；当一名其他角色回合开始时，若你的武将牌重置时，你可以选择该角色一张除手牌的牌，将此牌置入牌顶。',
            jlsg_lingbo_info: '一名角色的回合开始阶段，你可以重置你的武将牌，然后将场上的一张牌置于牌堆顶。',
            // jlsg_qingcheng_zhu_info: '游戏开始时，若你拥有技能［流云］：你可以重置你的武将牌，视为你使用或打出一张【杀】；你可以横置你的武将牌，视为你使用或打出一张【闪】；否则技能效果反之。',
            // jlsg_qingcheng_yin_info: '你可以重置你的武将牌，视为你使用或打出一张【杀】；你可以横置你的武将牌，视为你使用或打出一张【闪】。',
            // jlsg_qingcheng_yang_info: '你可以横置你的武将牌，视为你使用或打出一张【杀】；你可以重置你的武将牌，视为你使用或打出一张【闪】。',
            jlsg_qingcheng_info: '你可以横置你的武将牌，视为你使用或打出一张【杀】；你可以重置你的武将牌，视为你使用或打出一张【闪】。',
            jlsg_aozhan_info: '每当你因【杀】或【决斗】造成或受到1点伤害后，你可将牌堆顶的一张牌置于你的武将牌上，称为「战」。出牌阶段限一次，你可以选择一项：1、将所有「战」收入手牌。2、弃置所有「战」，然后摸等量的牌。',
            jlsg_huxiao_info: '出牌阶段，当你使用【杀】造成伤害时，若你的武将牌正面向上，你可以令此伤害+1并摸一张牌。若如此做，则此【杀】结算完毕后，将你的武将牌翻面并结束当前回合。',
            jlsg_old_huxiao_info: '出牌阶段，当你使用【杀】造成伤害时，若你的武将牌正面向上，你可以令此伤害+1并摸一张牌。若如此做，则此【杀】结算完毕后，将你的武将牌翻面并结束当前回合。',
            jlsg_guicai_info: '在任意角色的判定牌生效前，你可以选择一项：1、打出一张手牌代替之。2、亮出牌堆顶的一张牌代替之。',
            jlsg_langgu_info: '每当你造成或受到一次伤害后，你可以进行一次判定，若为黑色，你获得对方一张牌。',
            jlsg_zhuizun_info: '限定技，当你进入濒死状态时，你可以恢复体力至1点，令所有其他角色依次交给你一张手牌。然后当前回合结束后，你进行1个额外的回合。',
            jlsg_tianshang_info: '限定技，你死亡时，可令一名其他角色获得你此武将牌上拥有的其他技能，然后其增加1点体力上限并恢复1点体力。',
            jlsg_yiji_info: '每当你受到一点伤害，可以观看牌堆顶的两张牌，并将其交给任意1~2名角色。',
            jlsg_old_yiji_info: '当你受到一次伤害，可以观看牌堆顶的两张牌，并将其交给任意名角色，若你将所有的牌交给了同一名角色，你进行一次判定：判定牌为红桃，恢复1点体力。',
            jlsg_huiqu_info: '回合开始阶段，你可以弃置一张手牌进行一次判定，若结果为红色，你将场上的一张牌移动到一个合理的位置；若结果为黑色，你对一名角色造成1点伤害，然后你摸一张牌。',
            jlsg_zhaoxiang_info: '当一名其他角色使用【杀】指定目标后，你可以令其选择一项：1、交给你一张牌。2、令此【杀】对该目标无效；若其或【杀】的目标在你的攻击范围内，你须先弃置一张手牌。',
            jlsg_zhishi_info: '出牌阶段限一次，你可以令一名其他角色选择一项：1、弃置一张基本牌，然后回复一点。2、受到你造成的一点伤害，然后回复一点体力。',
            jlsg_old_zhishi_info: '出牌阶段限一次，你可以指定一名有手牌的其他角色，你选择其中一项执行：1.你展示一张【杀】令其弃置一张【杀】，若其执行，你与其恢复1点体力，否则你对其造成1点伤害；2.你展示一张【闪】令其弃置一张【闪】，若其执行，你与其恢复1点体力，否则你对其造成1点伤害。',
            jlsg_jianxiong_info: '主公技。每当其他魏势力受到不为你的一次伤害后，该角色可以弃置一张手牌，然后令你获得对其造成伤害的牌。',
            jlsg_jiuzhu_info: '每当一张非转化的【闪】进入弃牌堆时，你可以用一张不为【闪】的牌替换之。若此时不是你的回合，你可以视为对当前回合角色使用一张无视防具的【杀】。',
            jlsg_tuwei_info: '每当一张非转化的【杀】进入弃牌堆时，若你是此【杀】的目标或使用者，你可以弃置一张能造成伤害的牌，然后弃置此牌目标或使用者的共计两张牌。',
            // jlsg_xujin_info: '摸牌阶段，你可以放弃摸牌，改为展示牌堆顶的5张牌，并令一名角色获得其中1种花色的所有牌，再将其余的牌置入弃牌堆。若如此做，你本回合的攻击范围和可以使用的【杀】数量与以此法被获得的牌的数量相同。',
            jlsg_xujin_info: '摸牌阶段开始时，你展示牌堆顶的五张牌，然后，你可以放弃摸牌并将其中一种花色的牌交给一名角色，令你本回合的攻击范围和可以使用的【杀】数量与以此法被获得的牌的数量相同。否则你将展示的牌置入弃牌堆。',
            jlsg_paoxiao_info: '出牌阶段，当你使用【杀】对目标角色造成一次伤害并结算完毕后，你可以摸一张牌，然后选择一项：使用一张无视距离的【杀】，或令该角色弃置你的一张牌。',
            jlsg_benxi_info: '锁定技，你计算与其他角色的距离时始终-1.你使用【杀】指定目标后，目标角色须弃置一张装备牌，否则此【杀】不可被【闪】响应。',
            jlsg_yaozhan_info: '出牌阶段限一次，你可以与一名其他角色拼点：若你赢，你摸一张牌并视为对其使用一张【杀】（此【杀】不计入每回合的使用限制）；若你没赢，该角色可以对你使用一张【杀】。',
            jlsg_wenjiu_info: '出牌阶段限一次，你可以将一张黑色手牌置于你的武将牌上，称为「酒」。当你使用【杀】选择目标后，你可以将一张「酒」置入弃牌堆，然后当此【杀】造成伤害时，该伤害+1；当此【杀】被【闪】响应后，你摸一张牌。',
            jlsg_shuixi_info: '回合开始阶段开始时，你可以展示一张手牌并选择一名其他角色，令其选择一项：弃置一张与之相同花色的手牌，或失去1点体力。若该角色因此法失去体力，则此回合的出牌阶段，你不能使用【杀】。',
            jlsg_sanfen_info: '出牌阶段限一次，你可以选择两名其他角色，其中一名你选择的角色须对另一名角色使用一张【杀】，然后另一名角色须对你使用一张【杀】，你弃置不如此做者一张牌。（有距离限制）',
            jlsg_guanxing_info: '回合开始/结束阶段开始时，你可以观看牌堆顶的X张牌（X为存活角色的数量，且最多为3），将其中任意数量的牌以任意顺序置于牌堆顶，其余以任意顺序置于牌堆底。',
            jlsg_weiwo_info: '锁定技，当你有手牌时，你防止受到的属性伤害；当你没有手牌时，你防止受到的非属性伤害。',
            jlsg_shouji_info: '出牌阶段限一次，你可以弃置一张牌并选择两名角色，然后根据你弃置牌的花色，视为其中一名角色对另一名角色使用一张牌：黑桃【决斗】，梅花【借刀杀人】，红桃【顺手牵羊】，方片【火攻】。',
            jlsg_hemou_info: '其他角色的出牌阶段开始时，你可以将一张手牌正面朝上交给该角色，该角色本阶段限一次，可将一张与之相同花色的手牌按下列规则使用：黑桃【决斗】，梅花【借刀杀人】，红桃【顺手牵羊】，方片【火攻】。',
            jlsg_qicai_info: '每当你失去一次手牌时，你可以进行判定，若结果为红色，你摸一张牌。',
            jlsg_rende_info: '任一角色的回合结束阶段结束时，你可以将任意数量的手牌交给该角色，然后该角色进行1个额外的出牌阶段。',
            jlsg_chouxi_info: '出牌阶段限一次，你可以弃置一张手牌并展示牌堆顶的两张牌，然后令一名其他角色选择一项：1. 弃置一张与展示牌类别均不同的牌，然后令你获得展示的牌；2. 受到你造成的1点伤害并获得其中一种类别的牌，然后你获得其余的牌。',
            jlsg_yongbing_info: '主公技，当一名其他蜀势力角色使用【杀】造成一次伤害后，该角色可令你摸一张牌。',
            jlsg_yinmeng_info: '出牌阶段限X次，若你有手牌，你可以展示一名其他男性角色的一张手牌，然后展示你的一张手牌，若两张牌类型相同，你与其各摸一张牌；若不同，你弃置其展示的牌，X为你所损失的体力且至少为1',
            jlsg_xiwu_info: '当你使用的【杀】被目标角色的【闪】响应后，你可以摸一张牌，然后弃置其一张手牌。',
            jlsg_juelie_info: '出牌阶段限一次，你可以令一名手牌数与你不同的其他角色选择一项：将手牌数调整至与你相等；或视为你对其使用一张【杀】（不计入出牌阶段的使用限制）。',
            jlsg_xianger_info: "一名其他男性角色的回合开始时，你可以交给其两张基本牌。若如此做，该角色跳过出牌阶段，然后可以视为对你使用一张【杀】，否则下回合的出牌阶段受到你的1点伤害；若其在此阶段未造成伤害，则跳过弃牌阶段，且你摸一张牌。",
            jlsg_fangxin_info: '当你需要使用一张【桃】时，你可以将一张梅花牌当【兵粮寸断】或将一张方片牌当【乐不思蜀】对自己使用，若如此做，视为你使用了一张【桃】。',
            jlsg_xiyu_info: '你的回合开始时，你可以弃置一名角色的一张牌，然后该角色进行一个额外的出牌阶段。',
            jlsg_wanrou_info: '你的方片牌或你判定区的牌进入弃牌堆时，你可以令一名角色摸一张牌。',
            jlsg_zhouyan_info: '出牌阶段，你可以令一名角色摸一张牌，若如此做，视为你对其使用一张【火攻】，你可以重复此流程直到你以此法未造成伤害。每当你使用【火攻】造成一次伤害后，你可以摸一张牌。',
            jlsg_zhaxiang_info: '出牌阶段，你可以将一张手牌扣置，然后令一名其它角色选择一项：交给你一张牌并弃置你扣置的牌；或展示你扣置的牌并获得之。若你扣置的牌为【杀】，则视为你对其使用一张火属性的【杀】（不计入出牌阶段的使用限制且不可被响应）。',
            jlsg_old_zhaxiang_info: '出牌阶段限一次，你可以指定一名其它角色，视为该角色对你使用一张【杀】，然后你摸两张牌并视为对其使用一张【杀】（你的此【杀】无视防具）。',
            jlsg_shixue_info: '当你使用【杀】指定目标后，你可以摸两张牌；若如此做，当此【杀】被【闪】响应后，你须弃置两张牌。',
            jlsg_guoshi_info: '任一角色的回合开始阶段开始时，你可以观看牌堆顶的两张牌，然后可将其中任意张牌置于牌堆底；任1角色的回合结束阶段开始时，你可以令其获得本回合因弃置或判定进入弃牌堆的一张牌。',
            jlsg_yingcai_info: '摸牌阶段，你可以放弃摸牌，改为展示牌堆顶的一张牌，你重复此流程直到你展示出第3种花色的牌时，将这张牌置入弃牌堆，然后获得其余的牌。',
            jlsg_old_yingcai_info: '摸牌阶段，你可以放弃摸牌，改为展示牌堆顶的一张牌，你重复此流程直到你展示出第三种花色的牌时，将这张牌置入弃牌堆，然后获得其余的牌。',
            jlsg_weibao_info: '出牌阶段限一次，你可以将一张手牌置于牌堆顶，然后令一名其他角色选择一种花色后摸一张牌并展示之，若此牌与所选花色不同，你对其造成一点伤害。',
            jlsg_choulve_info: '出牌阶段限一次，你可以交给两名其他角色各一张手牌，然后依次展示之，点数较大的一方视为对另一方使用一张【杀】。该【杀】造成伤害后，你摸一张牌。',
            jlsg_jiexi_info: '出牌阶段，你可以与一名其他角色拼点，若你赢，视为对其使用一张【过河拆桥】。你可重复此流程直到你以此法拼点没赢。',
            jlsg_old_jiexi_info: '若你的武将牌正面朝上，你可以指定一名有手牌的角色进行拼点：若你赢，你视为对其使用一张【过河拆桥】，否则本回合不可发动此技能；锁定技，若你的武将牌正面朝上并触发技能〈劫袭〉后，且你的手牌数小于4时，你将武将牌背面朝上并摸一张牌；若你的武将牌背面朝上，你不能成为【南蛮入侵】和【闪电】的目标。',
            jlsg_youxia_info: '出牌阶段，若你的武将牌正面朝上，你可以将你的武将牌翻面，然后从一至两名其他角色处各获得一张牌；锁定技，若你的武将牌背面朝上，你不能成为【杀】和【决斗】的目标。',
            jlsg_old_youxia_info: '出牌阶段限一次，你可以将你的武将牌翻面，然后从1至2名其他角色的区域各弃置一张牌；锁定技，若你的武将牌背面朝上，你不能成为【杀】和【兵粮寸断】的目标。',

            jlsg_huailing_info: '若你的武将牌背面朝上，其他角色使用一张锦囊牌指定大于一个目标时，你可以令一名其他角色不受到该牌的效果，然后你将武将牌正面朝上；锁定技，若你的武将牌背面朝上，你不能成为【决斗】和【过河拆桥】的目标。',
            jlsg_dailao_info: '出牌阶段限一次，你可以令一名其他角色与你将武将牌翻面，然后其选择一项：与你各摸一张牌；或与你各弃置一张牌。',
            jlsg_youdi_info: '若你的武将牌背面朝上，你可以将其翻面来视为你使用一张【闪】。每当你使用【闪】响应一名角色使用的【杀】时，你可以弃置至多X张牌，然后该角色弃置等量的牌（X为该角色的牌数）。',
            jlsg_ruya_info: '当你失去最后的手牌时，你可以翻面并将手牌补至你体力上限的张数。',
            jlsg_quanheng_info: '出牌阶段限一次，你可以将至少一张手牌当【无中生有】或【杀】使用，若你以此法使用的牌被【无懈可击】或【闪】响应时，你摸等量的牌。',
            jlsg_xionglve_info: '摸牌阶段，你可以放弃摸牌，改为展示牌堆顶的两张牌，你获得其中一张牌，然后将另一张牌置于你的武将牌上，称为「略」。出牌阶段，你可以将一张基本牌或锦囊牌的「略」当与之同类别的任意一张牌（延时类锦囊牌除外）使用，将一张装备牌的「略」置于一名其他角色装备区内的相应位置。',
            jlsg_fuzheng_info: '主公技，回合开始阶段开始时，你可以令至多两名其他吴势力角色各摸一张牌，然后这些角色依次将一张手牌置于牌堆顶。',
            jlsg_jiwu_info: '出牌阶段限一次，你可以将你的手牌调整至一张，若如此做，本回合你的攻击范围无限，且你下一次使用的【杀】造成的伤害+1。锁定技，若你的装备区没有牌，你使用【杀】可以额外指定至多两名目标。',
            jlsg_old_jiwu_info: '出牌阶段限一次，若你的手牌数大于一，若如此做，本回合你的攻击范围无限，且你下一次使用的【杀】造成的伤害+1。锁定技，若你的装备区没有牌，你使用【杀】可以至多额外指定任意两名其他角色为目标。',

            jlsg_sheji_info: '当一名装备区有武器牌的其他角色对另一名角色造成伤害后，你可以弃置一张牌，然后获得该角色的武器牌。你可以将装备牌当无距离限制的【杀】使用或打出，你以此法使用的【杀】须连续使用两张【闪】才能抵消。',
            jlsg_xingyi_info: '出牌阶段限一次，你可以获得一名有手牌的其他角色一张手牌，然后令其恢复1点体力。',
            jlsg_guagu_info: '当一名角色进入濒死状态时，你可以弃置其所有手牌（至少一张），然后该角色恢复1点体力。若你以此法弃置其两张或更多的手牌，该角色摸一张牌。',
            jlsg_wuqin_info: '回合结束阶段结束时，你可以弃置一张基本牌，然后选择一项：摸两张牌，或进行一个额外的出牌阶段。',
            jlsg_lijian_info: '出牌阶段限一次，你可以弃一张牌并选择两名其他男性角色。若如此做，视为其中一名男性角色对另一名男性角色使用一张【决斗】(该【决斗】不可被【无懈可击】响应)。',
            jlsg_manwu_info: '出牌阶段限一次，你可以展示一名男性角色的一张手牌，若此牌为方片，将之置于该角色的判定区内，视为【乐不思蜀】；若不为方片，你获得之。',
            jlsg_baiyue_info: '回合结束阶段开始时，你可以获得本回合其他角色进入弃牌堆的一张牌。',
            jlsg_ganglie_info: '出牌阶段开始时，你可以失去1点体力，若如此做，你本回合下一次造成的伤害+1。且本回合你每造成1点伤害，回合结束时你便摸一张牌',
          },
        };
        if (config.oldCharacterReplace) {
          for (var i in jlsg_sr.character) {
            if (i == 'jlsgsr_sunshangxiang') {
              jlsg_sr.character[i][3] = ['jlsg_yinmeng', 'jlsg_xianger', 'jlsg_juelie'];
              jlsg_sr.translate[i] = 'SR旧孙尚香';
            } else if (i == 'jlsgsr_guojia') {
              jlsg_sr.character[i][3] = ['jlsg_tianshang', 'jlsg_old_yiji', 'jlsg_huiqu'];
              jlsg_sr.translate[i] = 'SR旧郭嘉';
            } else if (i == 'jlsgsr_luxun') {
              jlsg_sr.character[i][3] = ['jlsg_old_dailao', 'jlsg_old_youdi', 'jlsg_old_ruya'];
              jlsg_sr.translate[i] = 'SR旧陆逊';
            } else if (i == 'jlsgsr_caocao') {
              jlsg_sr.character[i][3] = ['jlsg_zhaoxiang', 'jlsg_old_zhishi', 'jlsg_jianxiong'];
              jlsg_sr.translate[i] = 'SR旧曹操';
            } else if (i == 'jlsgsr_xuzhu') {
              jlsg_sr.character[i][3] = ['jlsg_aozhan', 'jlsg_old_huxiao'];
              jlsg_sr.translate[i] = 'SR旧许褚';
            } else if (i == 'jlsgsr_ganning') {
              jlsg_sr.character[i][3] = ['jlsg_old_jiexi', 'jlsg_old_youxia', 'jlsg_huailing'];
              jlsg_sr.translate[i] = 'SR旧甘宁';
            } else if (i == 'jlsgsr_huanggai') {
              jlsg_sr.character[i][3] = ['jlsg_zhouyan', 'jlsg_old_zhaxiang'];
              jlsg_sr.translate[i] = 'SR旧黄盖';
            } else if (i == 'jlsgsr_zhouyu') {
              jlsg_sr.character[i][3] = ['jlsg_old_yingcai', 'jlsg_weibao', 'jlsg_choulve'];
              jlsg_sr.translate[i] = 'SR旧周瑜';
            }
          }
        }
        if (lib.device || lib.node) {
          for (var i in jlsg_sr.character) {
            jlsg_sr.character[i][4].push('ext:极略/' + i + '.jpg');
          }
        } else {
          for (var i in jlsg_sr.character) {
            jlsg_sr.character[i][4].push('db:extension-极略:' + i + '.jpg');
          }
        }
        return jlsg_sr;
      });
      game.import('character', function () { // Soul
        var jlsg_soul = {
          name: 'jlsg_soul',
          connect: true,
          character: {
            jlsgsoul_caocao: ['male', 'shen', 3, ['jlsg_guixin', 'jlsg_feiying'], ['wei']],
            jlsgsoul_sunquan: ['male', 'shen', 4, ['jlsg_huju'], ['wu']],
            jlsgsoul_jiaxu: ['male', 'shen', 3, ['jlsg_yanmie', 'jlsg_shunshi'], ['wei']],
            jlsgsoul_liubei: ['male', 'shen', 4, ['jlsg_junwang', 'jlsg_jizhao'], ['shu']],
            jlsgsoul_zhugeliang: ['male', 'shen', 3, ['jlsg_qixing', 'jlsg_kuangfeng', 'jlsg_dawu'], ['shu']],
            jlsgsoul_sp_zhugeliang: ['male', 'shen', 7, ['jlsg_yaozhi', 'jlsg_xingyun'], ['shu']],
            jlsgsoul_simayi: ['male', 'shen', 3, ['jlsg_jilve', 'jlsg_tongtian'], ['wei', 'nei']],
            jlsgsoul_luxun: ['male', 'shen', 3, ['jlsg_jieyan', 'jlsg_fenying'], ['wu']],
            jlsgsoul_lvbu: ['male', 'shen', 5, ['jlsg_kuangbao', 'jlsg_wumou', 'jlsg_wuqian', 'jlsg_shenfen'], ['qun']],
            jlsgsoul_guanyu: ['male', 'shen', 5, ['jlsg_wushen', 'jlsg_suohun'], ['shu']],
            jlsgsoul_zhaoyun: ['male', 'shen', 2, ['jlsg_juejing', 'jlsg_longhun'], ['shu']],
            jlsgsoul_zhangliao: ['male', 'shen', 4, ['jlsg_nizhan', 'jlsg_cuifeng', 'jlsg_weizhen'], ['wei']],
            jlsgsoul_huangyueying: ['female', 'shen', 3, ['jlsg_zhiming', 'jlsg_suyin'], ['shu']],
            jlsgsoul_zhangjiao: ['male', 'shen', 3, ['jlsg_dianjie', 'jlsg_shendao', 'jlsg_leihun'], ['fan', 'qun']],
            jlsgsoul_lvmeng: ['male', 'shen', 3, ['jlsg_shelie', 'jlsg_gongxin'], ['wu']],
            jlsgsoul_guojia: ['male', 'shen', 3, ['jlsg_tianqi', 'jlsg_tianji'], ['wei']],
            jlsgsoul_diaochan: ['female', 'shen', 3, ['jlsg_tianzi', 'jlsg_meixin'], ['qun']],
            jlsgsoul_zhangfei: ['male', 'shen', 4, ['jlsg_shayi', 'jlsg_zhenhun'], ['shu']],
            jlsgsoul_simahui: ['male', 'shen', 3, ['jlsg_zhitian', 'jlsg_yinshi'], ['qun']],
            jlsgsoul_sunshangxiang: ['female', 'shen', 3, ['jlsg_xianzhu', 'jlsg_liangyuan'], ['shu']],
            jlsgsoul_ganning: ['male', 'shen', 4, ['jlsg_lvezhen', 'jlsg_youlong'], ['wu']],
            jlsgsoul_xiahoudun: ['male', 'shen', 5, ['jlsg_danjing', 'jlsg_zhonghun'], ['wei']],
            jlsgsoul_dianwei: ['male', 'shen', 6, ['jlsg_zhiji'], ['wei']],
            jlsgsoul_huatuo: ['male', 'shen', 3, ['jlsg_yuanhua', 'jlsg_guiyuan', 'jlsg_chongsheng'], ['qun']],
            jlsgsoul_zhouyu: ['male', 'shen', 4, ['jlsg_qinyin', 'jlsg_yeyan'], ['wu']],
          },
          characterIntro: {},
          skill: {
            jlsg_guixin: {
              audio: "ext:极略:1",
              trigger: { player: 'damageEnd' },
              check: function (event, player) {
                if (player.isTurnedOver()) return true;
                if (game.dead.length >= 2) return true;
                var num = game.countPlayer(function (current) {
                  if (current.countCards('he') && current != player && get.attitude(player, current) <= 0) {
                    return true;
                  }
                  if (current.countCards('j') && current != player && get.attitude(player, current) > 0) {
                    return true;
                  }
                });
                return num >= 2;
              },
              content: function () {
                "step 0"
                event.num2 = trigger.num;
                "step 1"
                var targets = game.filterPlayer();
                targets.remove(player);
                targets.sort(lib.sort.seat);
                event.targets = targets;
                event.num = 0;
                player.line(targets, 'green');
                "step 2"
                if (num < event.targets.length) {
                  var hej = event.targets[num].getCards('hej')
                  if (hej.length) {
                    //				var card='hej';
                    player.gainPlayerCard('hej', event.targets[num], true);
                    //					if(get.position(card)=='h'){
                    //event.targets[num].$giveAuto(card,player);
                    //				}
                    //				else{
                    //				event.targets[num].$give(card,player);
                    //						}
                  }
                  event.num++;
                  event.redo();
                }
                "step 3"
                player.draw(game.dead.length);
                player.turnOver();
                "step 4"
                event.num2--;
                if (event.num2 > 0) {
                  player.chooseBool(get.prompt2("jlsg_guixin"));
                }
                else {
                  event.finish();
                }
                "step 5"
                if (result.bool) {
                  player.logSkill('jlsg_guixin');
                  event.goto(1);
                }
              },
              ai: {
                maixie: true,
                maixie_hp: true,
                threaten: function (player, target) {
                  if (target.hp == 1) return 3;
                  return 1;
                },
                effect: {
                  target: function (card, player, target) {
                    if (get.tag(card, 'damage')) {
                      if (player.hasSkillTag('jueqing', false, target)) return [1, -2];
                      if (target.hp == 1) return 0.8;
                      if (target.isTurnedOver()) return [0, 3];
                      var num = game.countPlayer(function (current) {
                        if (current.countCards('he') && current != player && get.attitude(player, current) <= 0) {
                          return true;
                        }
                        if (current.countCards('j') && current != player && get.attitude(player, current) > 0) {
                          return true;
                        }
                      });
                      if (num > 2) return [0, 1];
                      if (num == 2) return [0.5, 1];
                    }
                  }
                }
              }
            },
            jlsg_feiying: {
              mod: {
                targetInRange: function (card, player, target, now) {
                  if (!player.isTurnedOver() && card.name == 'sha')
                    return true;
                },
                targetEnabled: function (card, player, target, now) {
                  if (target.isTurnedOver() && card.name == 'sha')
                    return false;
                },

              },
            },
            jlsg_huju: {
              audio: "ext:极略:true",
              trigger: { global: 'phaseBegin' },
              derivation: ['zhiheng', 'jlsg_hufu'],
              filter: function (event, player) {
                return event.player != player;
              },
              forced: true,
              content: function () {
                player.draw();
              },
              group: ['jlsg_huju2'],
            },
            jlsg_huju2: {
              // audio: "ext:极略:true",
              trigger: { player: 'phaseBegin' },
              filter: function (event, player) {
                var num = player.countCards('h');
                for (var i = 0; i < game.players.length; i++) {
                  if (game.players[i].num('h') > num)
                    return false;
                }
                return true;
              },
              forced: true,
              content: function () {
                "step 0"
                player.chooseControl('选项一', '选项二', function () {
                  if (player.hp <= 2 && !player.countCards('h', function (card) {
                    return get.tag(card, 'recover');
                  })) return '选项二';
                  return '选项一';
                }).set('prompt', '虎踞<br><br><div class="text">1：失去1点体力</div><br><div class="text">2：减1点体力上限，失去【虎踞】，获得【制衡】和【虎缚】</div></br>');
                "step 1"
                if (result.control == '选项一') {
                  game.trySkillAudio('jlsg_hujuStill');
                  player.loseHp();
                } else {
                  player.logSkill('jlsg_hujuWake');
                  player.loseMaxHp();
                  player.removeSkill('jlsg_huju');
                  player.addSkill('zhiheng');
                  player.addSkill('jlsg_hufu');
                }
              },
            },
            jlsg_hujuStill: {
              audio: "ext:极略:true",
              unique: true,
            },
            jlsg_hujuWake: {
              skillAnimation: true,
              audio: "ext:极略:true",
              inherit: 'jlsg_huju2',
              unique: true,
            },
            jlsg_hufu: {
              audio: "ext:极略:2",
              enable: 'phaseUse',
              usable: 1,
              filterTarget: function (card, player, target) {
                return player != target && target.countCards('e');
              },
              content: function () {
                target.chooseToDiscard(target.countCards('e'), true, 'he');
              },
              ai: {
                expose: 0.3,
                order: 10,
                result: {
                  target: function (player, target) {
                    return -target.countCards('e');
                  }
                }
              }
            },
            jlsg_yanmie: {
              audio: "ext:极略:2",
              enable: 'phaseUse',
              filter: function (event, player) {
                return player.countCards('he', { suit: 'spade' }) > 0;
              },
              check: function (card) {
                return 7 - get.value(card)
              },
              filterCard: function (card) {
                return get.suit(card) == 'spade';
              },
              position: 'he',
              filterTarget: function (card, player, target) {
                return player != target && target.countCards('h');
              },
              content: function () {
                "step 0"
                var num = target.countCards('h');
                target.discard(target.get('h'));
                target.draw(num);
                target.showHandcards();
                "step 1"
                var cards = target.getCards('h', function (card) {
                  return get.type(card) != 'basic';
                });
                // var num = target.countCards('h', function (card) {
                //   return get.type(card) != 'basic';
                // });
                // target.discard(target.get('h', function (card) {
                //   return get.type(card) != 'basic';
                // }));
                if (cards.length) {
                  target.discard(cards, player);
                  target.damage(cards.length);
                }
              },
              ai: {
                order: 8,
                expose: 0.3,
                threaten: 1.8,
                result: {
                  target: function (player, target) {
                    return -target.countCards('h') - 1;
                  }
                }
              }
            },
            jlsg_shunshi: {
              audio: "ext:极略:2",
              trigger: { target: 'useCardToBegin' },
              filter: function (event, player) {
                return event.player != player && get.type(event.card) == 'basic'
                  && game.hasPlayer(p => p != player && p != event.player);
              },
              direct: true,
              content: function () {
                "step 0"
                player.chooseTarget('是否发动【顺世】?', [1, 3], function (card, player, target) {
                  return player != target && trigger.player != target;
                }).ai = function (target) {
                  // if (trigger.card.name == 'sha') {
                  //   if (target.countCards('e', '2') && target.get('e') != 'baiyin') return 0;
                  //   return -get.attitude(player, target);
                  // }
                  // if (trigger.card.name == 'tao') {
                  //   if (!target.isDamaged()) return 0;
                  //   return get.attitude(player, target);
                  // }
                  return get.effect(target, { name: trigger.card.name }, player);
                }
                "step 1"
                if (result.bool) {
                  player.logSkill('jlsg_shunshi', result.targets);
                  player.draw();
                  game.asyncDraw(result.targets);
                  for (var i = 0; i < result.targets.length; i++) {
                    trigger.targets.push(result.targets[i]);
                    game.log(result.targets[i], '成为了额外目标');
                  }
                }
              },
              ai: {
                effect: {
                  target: function (card, player, target) {
                    if (player == target) return;
                    if (card.name == 'tao') {
                      return [1, 2];
                    }
                    if (card.name == 'sha') {
                      return [1, 0.74];
                    }
                  },
                }
              }
            },
            jlsg_junwang: {
              audio: "ext:极略:2",
              trigger: { global: 'phaseUseBegin' },
              forced: true,
              filter: function (event, player) {
                return event.player != player && event.player.countCards('h') >= player.countCards('h');
              },
              content: function () {
                "step 0"
                trigger.player.chooseCard('交给' + get.translation(player) + '一张手牌', true).ai = function (card) {
                  if (get.attitude(trigger.player, player) > 0) {
                    return get.value(card);
                  } else {
                    return -get.value(card);
                  }
                }
                "step 1"
                if (result.bool) {
                  player.gain(result.cards[0]);
                  trigger.player.$give(1, player);
                }
              }
            },
            jlsg_jizhao: {
              audio: "ext:极略:2",
              enable: "phaseUse",
              filterCard: true,
              selectCard: [1, Infinity],
              filter: function () {
                for (var i = 0; i < game.players.length; i++) {
                  if (!game.players[i].storage.jlsg_jizhao1)
                    return true;
                }
                return false;
              },
              discard: false,
              // prepare: "give2",
              check: function (card) {
                if (ui.selected.cards.length > 1) return 0;
                if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') return 0;
                if (ui.selected.cards.length && ui.selected.cards[0].name == 'shandian') return 0;
                if (!ui.selected.cards.length && card.name == 'du') return 20;
                if (!ui.selected.cards.length && card.name == 'shandian') return 18;
                if (!ui.selected.cards.length && card.name == 'shan') return 14;
                if (!ui.selected.cards.length && card.name == 'jiedao') return 16;
                return 0;
              },
              filterTarget: function (card, player, target) {
                return !target.storage.jlsg_jizhao1 && player != target;
              },
              content: function () {
                target.gain(cards, player, 'giveAuto');
                // player.$give(cards, target);
                target.addTempSkill('jlsg_jizhao_zhao', { player: 'dieAfter' });
                target.storage.jlsg_jizhao1 = true;
                target.storage.jlsg_jizhao2 = player;
              },
              ai: {
                order: 4,
                result: {
                  target: function (card, player, target) {
                    if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') {
                      return -10;
                    }
                    if (ui.selected.cards.length && ui.selected.cards[0].name == 'shandian') {
                      return -10;
                    }
                    return -1;
                  },
                  result: {
                    target: -1,
                  },
                },
              },
            },
            jlsg_jizhao_zhao: {
              audio: "ext:极略:1",
              trigger: {
                player: "phaseEnd",
              },
              mark: true,
              marktext: "<font color=red>诏</font>",
              direct: true,
              content: function () {
                if (!player.getStat('damage')) {
                  player.storage.jlsg_jizhao2.logSkill('jlsg_jizhao', player);
                  player.storage.jlsg_jizhao1 = false;
                  player.damage(player.storage.jlsg_jizhao2);
                  player.removeSkill("jlsg_jizhao_zhao");
                  delete player.storage.jlsg_jizhao2;
                }
              },
              intro: {
                content: "该角色的回合未造成伤害，回合结束将受到你的1点伤害并弃置该标记",
              },
            },
            jlsg_qixing: {
              audio: "ext:极略:1",
              trigger: {
                global: 'phaseBefore',
                player: 'enterGame'
              },
              forced: true,
              marktext: '星',
              filter: function (event, player) {
                return event.name != 'phase' || game.phaseNumber == 0;
              },
              content: function () {
                "step 0"
                player.gain(get.cards(7))._triggered = null;
                "step 1"
                if (player == game.me) {
                  game.addVideo('delay', null);
                }
                player.chooseCard('选择七张牌作为「星」', 7, true).ai = function (card) {
                  return get.value(card);
                };
                "step 2"
                player.lose(result.cards, ui.special)._triggered = null;
                player.storage.jlsg_qixing = result.cards;
                player.syncStorage('jlsg_qixing');
              },
              mark: true,
              intro: {
                mark: function (dialog, content, player) {
                  if (content && content.length) {
                    if (player == game.me || player.isUnderControl()) {
                      dialog.add(content);
                    } else {
                      return '共有' + get.cnNumber(content.length) + '张「星」';
                    }
                  }
                },
                content: function (content, player) {
                  if (content && content.length) {
                    if (player == game.me || player.isUnderControl()) {
                      return get.translation(content);
                    }
                    return '共有' + get.cnNumber(content.length) + '张「星」';
                  }
                }
              },
              group: ['jlsg_qixing2'],
            },
            jlsg_qixing2: {
              trigger: { player: 'phaseDrawAfter' },
              audio: "ext:极略:true",
              direct: true,
              filter: function (event, player) {
                return player.storage.jlsg_qixing && player.storage.jlsg_qixing.length;
              },
              content: function () {
                "step 0"
                player.chooseCard(get.prompt('jlsg_qixing'), [1, 3]).ai = function (card) {
                  return 1;
                };
                "step 1"
                if (result.bool) {
                  player.logSkill('jlsg_qixing');
                  player.lose(result.cards, ui.special)._triggered = null;
                  player.storage.jlsg_qixing = player.storage.jlsg_qixing.concat(result.cards);
                  player.syncStorage('jlsg_qixing');
                  event.num = result.cards.length;
                } else {
                  event.finish();
                }
                "step 2"
                player.chooseCardButton(player.storage.jlsg_qixing, '选择1-两张牌作为手牌', [1, 2], true).ai = function (button) {
                  if (player.skipList.contains('phaseUse') && button.link != 'du') {
                    return -get.value(button.link);
                  }
                  return get.value(button.link);
                }
                if (player == game.me && _status.auto) {
                  game.delay(0.5);
                }
                "step 3"
                //  player.gain(result.links)._triggered=null;
                player.gain(result.links)._triggered = null;
                for (var i = 0; i < result.links.length; i++) {
                  player.storage.jlsg_qixing.remove(result.links[i]);
                }
                player.syncStorage('jlsg_qixing');
                if (player == game.me && _status.auto) {
                  game.delay(0.5);
                }
              }
            },
            jlsg_kuangfeng: {
              audio: "ext:极略:2",
              trigger: { player: 'phaseZhunbeiBegin' },
              direct: true,
              filter: function (event, player) {
                return player.storage.jlsg_qixing && player.storage.jlsg_qixing.length;
              },
              content: function () {
                "step 0"
                var clearKuangfeng = jlsg.findPlayerBySkillName('jlsg_kuangfeng2');
                if (clearKuangfeng) {
                  clearKuangfeng.removeSkill('jlsg_kuangfeng2');
                  clearKuangfeng.popup('jlsg_kuangfeng2');
                }
                player.chooseTarget('选择一名角色获得狂风标记').ai = function (target) {
                  if (player.storage.jlsg_qixing.length > 3) return jlsg.isWeak(target) && jlsg.isEnemy(player, target);
                  return -1;
                }
                "step 1"
                if (result.bool) {
                  result.targets[0].addSkill('jlsg_kuangfeng2');
                  result.targets[0].popup('jlsg_kuangfeng');
                  player.logSkill('jlsg_kuangfeng', result.targets, 'fire');
                  player.chooseCardButton('弃置1枚「星」', player.storage.jlsg_qixing, true);
                } else {
                  event.finish();
                }
                "step 2"
                player.storage.jlsg_qixing.remove(result.links[0]);
                player.syncStorage('jlsg_qixing');
                if (player.storage.jlsg_qixing.length == 0) {
                  player.unmarkSkill('jlsg_qixing');
                }
                player.discard(result.links);
              },
            },
            jlsg_kuangfeng2: {
              unique: true,
              trigger: { player: 'damageBegin' },
              mark: true,
              marktext: '风',
              intro: {
                content: '已获得「风」标记'
              },
              forced: true,
              content: function () {
                var jlsg_zhugeliang = jlsg.findPlayerBySkillName('jlsg_kuangfeng');
                if (jlsg_zhugeliang) {
                  if (trigger.nature) {
                    if (trigger.nature == 'fire') {
                      jlsg_zhugeliang.line(player, 'fire');
                      trigger.num++;
                    }
                    if (trigger.nature == 'thunder') {
                      jlsg_zhugeliang.line(player, 'thunder');
                      player.chooseToDiscard(2, true);
                    }
                  } else {
                    if (jlsg_zhugeliang && jlsg_zhugeliang.storage.jlsg_qixing) {
                      jlsg_zhugeliang.line(player, 'water');
                      var card = get.cards();
                      jlsg_zhugeliang.$draw(1);
                      jlsg_zhugeliang.lose(card, ui.special)._triggered = null;
                      jlsg_zhugeliang.storage.jlsg_qixing = jlsg_zhugeliang.storage.jlsg_qixing.concat(card);
                      jlsg_zhugeliang.markSkill('jlsg_qixing');
                      jlsg_zhugeliang.syncStorage('jlsg_qixing');
                      game.log(jlsg_zhugeliang, '将牌堆顶得一张牌置入「星」');
                    }
                  }
                }
              },
              ai: {
                threaten: 3,
                effect: {
                  target: function (card, player, target, current) {
                    if (get.tag(card, 'fireDamage')) return 1.5;
                    if (get.tag(card, 'thunderDamage')) return 1.5;
                  }
                }
              }
            },
            jlsg_dawu: {
              trigger: { player: 'phaseJieshuBegin' },
              priority: 1,
              direct: true,
              filter: function (event, player) {
                return player.storage.jlsg_qixing && player.storage.jlsg_qixing.length;
              },
              audio: "ext:极略:2",
              content: function () {
                "step 0"
                player.chooseTarget('选择角色获得大雾标记',
                  [1, Math.min(game.players.length, player.storage.jlsg_qixing.length)]).ai = function (target) {
                    if (target.isMin()) return 0;
                    if (target.hasSkill('biantian2')) return 0;
                    var att = get.attitude(player, target);
                    if (att >= 4) {
                      if (target.hp == 1 && target.maxHp > 2) return att;
                      if (target.hp == 2 && target.maxHp > 3 && target.countCards('he') == 0) return att * 0.7;
                      if (jlsg.isWeak(target)) return att * 1.1;
                      return 0;
                    }
                    return -1;
                  }
                "step 1"
                if (result.bool) {
                  var length = result.targets.length;
                  for (var i = 0; i < length; i++) {
                    result.targets[i].addSkill('jlsg_dawu2');
                    result.targets[i].popup('jlsg_dawu');
                  }
                  player.logSkill('jlsg_dawu', result.targets, 'thunder');
                  player.chooseCardButton('弃置' + get.cnNumber(length) + '枚「星」', length, player.storage.jlsg_qixing, true);
                } else {
                  event.finish();
                }
                "step 2"
                for (var i = 0; i < result.links.length; i++) {
                  player.storage.jlsg_qixing.remove(result.links[i]);
                }
                if (player.storage.jlsg_qixing.length == 0) {
                  player.unmarkSkill('jlsg_qixing');
                }
                player.syncStorage('jlsg_qixing');
                player.discard(result.links);
              },
              group: ['jlsg_dawu_remove'],
              subSkill: {
                remove: {
                  trigger: { player: ['phaseBegin', 'dieBegin'] },
                  forced: true,
                  unique: true,
                  popup: false,
                  silent: true,
                  content: function () {
                    for (var i = 0; i < game.players.length; i++) {
                      if (game.players[i].hasSkill('jlsg_dawu2')) {
                        game.players[i].removeSkill('jlsg_dawu2');
                        game.players[i].popup('jlsg_dawu');
                      }
                      if (game.players[i].hasSkill('jlsg_kuangfeng2')) {
                        game.players[i].removeSkill('jlsg_kuangfeng2');
                        game.players[i].popup('jlsg_kuangfeng2');
                      }
                    }
                  }
                }
              }
            },
            jlsg_dawu2: {
              trigger: { player: 'damageBefore' },
              filter: function (event) {
                if (event.nature != 'thunder') return true;
                return false;
              },
              marktext: '雾',
              mark: true,
              unique: true,
              forced: true,
              content: function () {
                trigger.cancel();

              },
              ai: {
                nofire: true,
                nodamage: true,
                effect: {
                  target: function (card, player, target, current) {
                    if (get.tag(card, 'damage') && !get.tag(card, 'thunderDamage')) return [0, 0];
                  }
                },
              },
              intro: {
                content: '已获得大雾标记'
              }
            },
            jlsg_yaozhi: {
              audio: "ext:极略:2",
              trigger: {
                player: ['phaseZhunbeiBegin', 'damageEnd', 'phaseJieshuBegin'],
              },
              frequent: true,
              content: function () {
                'step 0'
                if (!player.storage.jlsg_yaozhi) player.storage.jlsg_yaozhi = [];
                player.draw();
                'step 1'
                if (!_status.characterlist) {
                  lib.skill.pingjian.initList();
                }
                var list = [];
                var skills = [];
                _status.characterlist.randomSort();
                var name2 = event.triggername;
                for (var i = 0; i < _status.characterlist.length; i++) {
                  var name = _status.characterlist[i];
                  if (name.indexOf('zuoci') != -1 || name.indexOf('xushao') != -1 || name == 'jlsgsoul_sp_xushao') continue;
                  var skills2 = lib.character[name][3];
                  for (var j = 0; j < skills2.length; j++) {
                    if (player.hasSkill(skills2[j])) continue;
                    if (skills.contains(skills2[j])) continue;
                    var list2 = [skills2[j]];
                    game.expandSkills(list2);
                    for (var k = 0; k < list2.length; k++) {
                      var info = lib.skill[list2[k]];
                      if (!info || !info.trigger || !info.trigger.player || info.silent || info.limited || info.juexingji || info.zhuanhuanji || info.hiddenSkill || info.dutySkill) continue;
                      if (info.trigger.player == name2 || Array.isArray(info.trigger.player) && info.trigger.player.contains(name2)) {
                        if (info.init || info.ai && (info.ai.combo || info.ai.notemp || info.ai.neg)) continue;
                        if (info.filter) {
                          try {
                            var bool = info.filter(trigger, player, name2);
                            if (!bool) continue;
                          }
                          catch (e) {
                            continue;
                          }
                        }
                        list.add(name);
                        skills.add(skills2[j]);
                        break;
                      }
                    }
                    if (skills.contains(skills2[j])) {
                      break;
                    }
                  }
                  if (skills.length > 2) break;
                }
                player.chooseControl(skills).set('dialog', ['请选择要发动的技能', [list, 'character']]).set('ai', function () { return 0 });
                'step 2'
                if (result.control == '摸一张牌') {
                  player.draw();
                  return;
                }
                player.storage.jlsg_yaozhi.add(result.control);
                var removeT = 'damageAfter';
                if (event.triggername == 'phaseJieshuBegin') {
                  removeT = 'phaseJieshu';
                }
                else if (event.triggername == 'phaseZhunbeiBegin') {
                  removeT = 'phaseZhunbei';
                }
                player.addTempSkill(result.control, removeT);
              },
              group: 'jlsg_yaozhi_use',
            },
            jlsg_yaozhi_use: {
              audio: 'jlsg_yaozhi',
              enable: 'phaseUse',
              usable: 1,
              content: function () {
                'step 0'
                if (!player.storage.jlsg_yaozhi) player.storage.jlsg_yaozhi = [];
                player.draw();
                'step 1'
                var list = [];
                var skills = [];
                if (!_status.characterlist) {
                  lib.skill.pingjian.initList();
                }
                _status.characterlist.randomSort();
                for (var i = 0; i < _status.characterlist.length; i++) {
                  var name = _status.characterlist[i];
                  if (name.indexOf('zuoci') != -1 || name.indexOf('xushao') != -1 || name == 'jlsgsoul_sp_xushao') continue;
                  var skills2 = lib.character[name][3];
                  for (var j = 0; j < skills2.length; j++) {
                    if (skills.contains(skills2[j])) continue;
                    if (player.hasSkill(skills2[j])) continue;
                    if (lib.skill.pingjian.phaseUse_special.contains(skills2[j])) {
                      list.add(name);
                      skills.add(skills2[j]);
                      continue;
                    }
                    var list2 = [skills2[j]];
                    game.expandSkills(list2);
                    for (var k = 0; k < list2.length; k++) {
                      var info = lib.skill[list2[k]];
                      if (!info || !info.enable || info.viewAs || info.limited || info.juexingji || info.zhuanhuanji || info.hiddenSkill || info.dutySkill) continue;
                      if (info.enable == 'phaseUse' || Array.isArray(info.enable) && info.enable.contains('phaseUse')) {
                        if (info.init || info.onChooseToUse || info.ai && (info.ai.combo || info.ai.notemp || info.ai.neg)) continue;
                        if (info.filter) {
                          try {
                            var bool = info.filter(event.getParent(2), player);
                            if (!bool) continue;
                          }
                          catch (e) {
                            continue;
                          }
                        }
                        list.add(name);
                        skills.add(skills2[j]);
                        break;
                      }
                    }
                    if (skills.contains(skills2[j])) break;
                  }
                  if (skills.length > 2) break;
                }
                player.chooseControl(skills).set('dialog', ['请选择要发动的技能', [list, 'character']]).set('ai', function () { return 0 });
                'step 2'
                if (result.control == '摸一张牌') {
                  player.draw();
                  return;
                }
                player.storage.jlsg_yaozhi.add(result.control);
                player.addTempSkill(result.control, 'phaseUseEnd');
                player.addTempSkill('jlsg_yaozhi_temp', 'phaseUseEnd');
                player.storage.jlsg_yaozhi_temp = result.control;
                //event.getParent(2).goto(0);
              },
              ai: { order: 10, result: { player: 1 } },
            },
            jlsg_yaozhi_temp: {
              onremove: true,
              trigger: { player: ['useSkillBegin', 'useCard1'] },
              silent: true,
              firstDo: true,
              filter: function (event, player) {
                var info = lib.skill[event.skill];
                if (!info) return false;
                if (event.skill == player.storage.jlsg_yaozhi_temp) return true;
                if (info.sourceSkill == player.storage.jlsg_yaozhi_temp || info.group == player.storage.jlsg_yaozhi_temp) return true;
                if (Array.isArray(info.group) && info.group.contains(player.storage.jlsg_yaozhi_temp)) return true;
                return false;
              },
              content: function () {
                player.removeSkill(player.storage.jlsg_yaozhi_temp);
                player.removeSkill('jlsg_yaozhi_temp');
              },
            },
            jlsg_xingyun: {
              audio: "ext:极略:2",
              forced: true,
              trigger: { player: 'phaseEnd' },
              unique: true,
              content: function () {
                'step 0'
                player.loseMaxHp();
                'step 1'
                if (!player.storage.jlsg_yaozhi || !player.storage.jlsg_yaozhi.length) {
                  event.finish();
                  return;
                }
                var characters = [];
                var leftSkills = player.storage.jlsg_yaozhi.randomGets(16);
                var skills = [];
                for (var c in lib.character) {
                  var info = lib.character[c];
                  if (info[3].some(s => leftSkills.includes(s))) {
                    characters.push(c);
                    skills.push(...leftSkills.filter(s => info[3].includes(s)));
                    leftSkills.remove(info[3]);
                    if (!leftSkills.length) break;
                  }
                }
                var list = characters;
                if (player.isUnderControl()) {
                  game.swapPlayerAuto(player);
                }
                var switchToAuto = function () {
                  _status.imchoosing = false;
                  event._result = {
                    bool: true,
                    skills: skills.randomGets(1),
                  };
                  if (event.dialog) event.dialog.close();
                  if (event.control) event.control.close();
                };
                var chooseButton = function (list, skills) {
                  var event = _status.event;
                  if (!event._result) event._result = {};
                  event._result.skills = [];
                  var rSkill = event._result.skills;
                  var dialog = ui.create.dialog('请选择获得的技能', [list, 'character'], 'hidden');
                  event.dialog = dialog;
                  var table = document.createElement('div');
                  table.classList.add('add-setting');
                  table.style.margin = '0';
                  table.style.width = '100%';
                  table.style.position = 'relative';
                  for (var i = 0; i < skills.length; i++) {
                    var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
                    td.link = skills[i];
                    table.appendChild(td);
                    td.innerHTML = '<span>' + get.translation(skills[i]) + '</span>';
                    td.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                      if (_status.dragged) return;
                      if (_status.justdragged) return;
                      _status.tempNoButton = true;
                      setTimeout(function () {
                        _status.tempNoButton = false;
                      }, 500);
                      var link = this.link;
                      if (!this.classList.contains('bluebg')) {
                        if (rSkill.length >= 1) return;
                        rSkill.add(link);
                        this.classList.add('bluebg');
                      }
                      else {
                        this.classList.remove('bluebg');
                        rSkill.remove(link);
                      }
                    });
                  }
                  dialog.content.appendChild(table);
                  dialog.add('　　');
                  dialog.open();

                  event.switchToAuto = function () {
                    event.dialog.close();
                    event.control.close();
                    game.resume();
                    _status.imchoosing = false;
                  };
                  event.control = ui.create.control('ok', function (link) {
                    event.dialog.close();
                    event.control.close();
                    game.resume();
                    _status.imchoosing = false;
                  });
                  for (var i = 0; i < event.dialog.buttons.length; i++) {
                    event.dialog.buttons[i].classList.add('selectable');
                  }
                  game.pause();
                  game.countChoose();
                };
                if (event.isMine()) {
                  chooseButton(list, skills);
                }
                else if (event.isOnline()) {
                  event.player.send(chooseButton, list, skills);
                  event.player.wait();
                  game.pause();
                }
                else {
                  switchToAuto();
                }
                'step 2'
                var map = event.result || result;
                if (map && map.skills && map.skills.length) {
                  for (var s of map.skills) {
                    player.addSkillLog(s);
                    player.storage.jlsg_yaozhi.remove(s);
                  }
                }
                game.broadcastAll(function (list) {
                  game.expandSkills(list);
                  for (var i of list) {
                    var info = lib.skill[i];
                    if (!info) continue;
                    if (!info.audioname2) info.audioname2 = {};
                    info.audioname2.old_yuanshu = 'weidi';
                  }
                }, map.skills);
              },
              ai: {
                halfneg: true,
                combo: 'jlsg_yaozhi',
              }
            },
            jlsg_jilve: {
              audio: "ext:极略:3",
              enable: 'phaseUse',
              filter: function (event, player) {
                return !player.hasSkill('jlsg_jilve2');
              },
              content: function () {
                "step 0"
                player.draw('nodelay');
                player.chooseToUse().filterCard = function (card, player) {
                  return (lib.filter.cardEnabled(card, player, event.parent.parent) && lib.filter.cardUsable(card, player, event.parent.parent));
                }
                "step 1"
                if (!result.bool) {
                  player.chooseToDiscard('he', true);
                  player.addTempSkill('jlsg_jilve2', 'phaseAfter');
                }
              },
              ai: {
                threaten: 4,
                order: 15,
                result: {
                  player: 1
                },
                effect: {
                  player: function (card, player) {
                    if (get.type(card) != 'basic') return [1, 3];
                  }
                },
              }
            },
            jlsg_jilve2: {},
            jlsg_tongtian: {
              audio: "ext:极略:1",
              enable: 'phaseUse',
              unique: true,
              skillAnimation: true,
              limited: true,
              position: 'he',
              mark: true,
              marktext: "通",
              //filter:function(event,player){
              //    return !player.storage.jlsg_tongtian;
              //  },
              intro: {
                content: true,
              },
              filterCard: function (card) {
                var suit = get.suit(card);
                return !ui.selected.cards.map(card => get.suit(card)).includes(suit);
              },
              complexCard: true,
              selectCard: [1, 4],
              prompt: "选择不同花色的牌，获得各花色的技能。",
              check: function (card) {
                return 8 - get.value(card);
              },
              derivation: ['jlsg_tongtian_wu', 'jlsg_tongtian_shu', 'jlsg_tongtian_wei', 'jlsg_tongtian_qun'],
              content: function () {
                "step 0"
                var suits = cards.map(card => get.suit(card));
                if (suits.includes('spade')) {
                  player.addSkill('jlsg_tongtian_wei');
                }
                if (suits.includes('heart')) {
                  player.addSkill('jlsg_tongtian_shu');
                }
                if (suits.includes('diamond')) {
                  player.addSkill('jlsg_tongtian_wu');
                }
                if (suits.includes('club')) {
                  player.addSkill('jlsg_tongtian_qun');
                }
                "step 1"
                player.awakenSkill('jlsg_tongtian');

              },
              ai: {
                order: 6,
                result: {
                  player: function (player) {
                    var cards = player.get('he');
                    var suits = [];
                    for (var i = 0; i < cards.length; i++) {
                      if (!suits.contains(get.suit(cards[i]))) {
                        suits.push(get.suit(cards[i]));
                      }
                    }
                    if (suits.length < 3) return -1;
                    return suits.length;
                  }
                }
              },

            },
            jlsg_tongtian_wei: {
              audio: "ext:极略:1",
              mark: true,
              marktext: "魏",
              unique: true,
              intro: {
                content: get.skillInfoTranslation('fankui'),
              },
              inherit: 'fankui',
              content: function () {
                player.gainPlayerCard(get.prompt('fankui', trigger.source), trigger.source, get.buttonValue, 'he').set('logSkill', ['jlsg_tongtian_wei', trigger.source]);
              },
            },
            jlsg_tongtian_wu: {
              unique: true,
              audio: "ext:极略:1",
              mark: true,
              marktext: "吴",
              intro: {
                content: get.skillInfoTranslation('zhiheng'),
              },
              inherit: 'zhiheng',
            },
            jlsg_tongtian_shu: {
              audio: "ext:极略:1",
              mark: true,
              unique: true,
              marktext: "蜀",
              intro: {
                content: get.skillInfoTranslation('guanxing'),
              },
              inherit: "guanxing",
            },
            jlsg_tongtian_qun: {
              inherit: "wansha",
              audio: "ext:极略:1",
              mark: true,
              unique: true,
              marktext: "群",
              intro: {
                content: get.skillInfoTranslation('wansha'),
              },
              locked: true,
              trigger: { global: 'dying' },
              global: 'jlsg_tongtian_qun2',
              priority: 15,
              forced: true,
              filter: function (event, player, name) {
                return _status.currentPhase == player && event.player != player;
              },
              content: function () { }
            },
            jlsg_tongtian_qun2: {
              mod: {
                cardSavable: function (card, player) {
                  if (!_status.currentPhase) return;
                  if (_status.currentPhase.isAlive() && _status.currentPhase.hasSkill('jlsg_tongtian_qun') && _status.currentPhase != player) {
                    if (card.name == 'tao' && !player.isDying()) return false;
                  }
                },
                cardEnabled: function (card, player) {
                  if (!_status.currentPhase) return;
                  if (_status.currentPhase.isAlive() && _status.currentPhase.hasSkill('jlsg_tongtian_qun') && _status.currentPhase != player) {
                    if (card.name == 'tao' && !player.isDying()) return false;
                  }
                }
              }
            },
            jlsg_jieyan: {
              audio: "ext:极略:1",
              trigger: { global: 'useCardToBefore' },
              direct: true,
              filter: function (event, player) {
                return player.countCards('h') > 0 && (get.type(event.card) == 'trick' || event.card.name == 'sha') && get.color(event.card) == 'red' && event.targets.length == 1;
              },
              content: function () {
                "step 0"
                var next = player.chooseToDiscard('是否对' + get.translation(trigger.target) + '发动【劫焰】？', 'h')
                next.ai = function (card) {
                  if (get.attitude(player, trigger.target) < 0) {
                    if (get.damageEffect(trigger.target, player, player, 'fire') >= 0) {
                      return get.value(trigger.card) - get.value(card);
                    }
                    return 7 - get.value(card);
                  }
                  //if(trigger.target==player) return 10;
                  return 0;
                };
                next.logSkill = ['jlsg_jieyan', trigger.target];
                "step 1"
                if (result.bool) {
                  //player.logSkill('jlsg_jieyan',trigger.target);
                  trigger.cancel();
                  trigger.target.damage('fire', player);
                }
              },
              ai: {
                expose: 0.2,
                fireattack: true,
              }
            },
            jlsg_jieyan_buff: {
              audio: "ext:极略:true",
              trigger: { player: 'damageBegin' },
              forced: true,
              filter: function (event) {
                if (event.nature == 'fire') return true;
              },
              content: function () {
                trigger.cancel();
                player.draw(trigger.num);
              },
              ai: {
                nofire: true,
                effect: {
                  target: function (card, player, target, current) {
                    if (get.tag(card, 'fireDamage')) {
                      if (target.hp == target.Maxhp) return 0;
                      return [0, 2];
                    }
                  }
                }
              },
            },
            jlsg_fenying: {
              audio: "ext:极略:1",
              trigger: { global: "damageAfter" },
              direct: true,
              filter: function (event, player) {
                return event.nature == 'fire' && player.countCards('h') <= player.maxHp && player.countCards('he', { color: 'red' }) > 0 && event.player != player;
              },
              content: function () {
                "step 0"
                player.chooseCardTarget({
                  filterCard: function (card) {
                    return get.color(card) == 'red';
                  },
                  filterTarget: function (card, player, target) {
                    return get.distance(trigger.player, target) <= 1 && target != player;
                  },
                  ai1: function (card) {
                    return 7 - get.value(card);
                  },
                  ai2: function (target) {
                    return get.damageEffect(target, player, player, 'fire');
                  },
                  position: 'he',
                  prompt: '焚营：弃置一张红色牌对目标或与其相距最近的其他目标造成等量火焰伤害'
                });
                "step 1"
                if (result.bool) {
                  player.logSkill('jlsg_fenying', result.targets[0], 'fire');
                  player.discard(result.cards[0]);
                  result.targets[0].damage('fire', trigger.num, player);
                }
              }
            },

            jlsg_kuangbao: {
              group: ['jlsg_kuangbao1'],
              audio: "ext:极略:1",
              forced: true,
              init: function (player) {
                player.logSkill('jlsg_kuangbao');
                player.storage.jlsg_kuangbao = 2;
                game.addVideo('storage', player, ['jlsg_kuangbao', player.storage.jlsg_kuangbao]);
              },
              locked: true,
              mark: true,
              marktext: "暴",
              intro: {
                content: "共有#个标记",
              },
            },
            jlsg_kuangbao1: {
              trigger: { source: 'damageEnd', player: 'damageEnd' },
              forced: true,
              audio: "ext:极略:true",
              filter: function (event) {
                return event.num != 0;
              },
              content: function () {
                player.addMark('jlsg_kuangbao', trigger.num);
              },
            },
            jlsg_wumou: {
              audio: "ext:极略:1",
              trigger: { player: 'useCard' },
              forced: true,
              filter: function (event) {
                return get.type(event.card) == 'trick';
              },
              content: function () {
                'step 0'
                if (player.storage.jlsg_kuangbao > 0) {
                  player.chooseControl('选项一', '选项二').set('prompt', '无谋<br><br><div class="text">1:弃置1枚「暴」标记</div><br><div class="text">2:受到1点伤害</div></br>').ai = function () {
                    if (player.storage.jlsg_kuangbao > 6) return '选项一';
                    if (player.hp >= 4 && player.countCards('h', 'tao') >= 1) return '选项二';
                    return Math.random() < 0.5 && '选项一';
                  };
                } else {
                  player.damage('nosource');
                  event.finish();
                }
                'step 1'
                if (result.control == '选项一') {
                  player.storage.jlsg_kuangbao--;
                  player.syncStorage('jlsg_kuangbao');
                } else {
                  player.damage('nosource');
                }
              },
              ai: {
                neg: true,
              },
            },
            jlsg_wuqian: {
              audio: "ext:极略:1",
              enable: 'phaseUse',
              usable: 1,
              filter: function (event, player) {
                return player.storage.jlsg_kuangbao > 1;
              },
              content: function () {
                'step 0'
                player.removeMark('jlsg_kuangbao', 2);
                'step 1'
                player.addTempSkill('wushuang', 'phaseAfter');
                player.addTempSkill('jlsg_wuqian_buff', 'phaseAfter');
              },
              subSkill: {
                buff: {
                  trigger: { source: 'damageEnd' },
                  forced: true,
                  popup: false,
                  audio: false,
                  filter: function (event) {
                    return event.num != 0;
                  },
                  content: function () {
                    player.addMark('jlsg_kuangbao');
                  }
                }
              },
              ai: {
                order: 10,
                result: {
                  player: function (player) {
                    if (player.countCards('h', 'juedou') > 0) {
                      return 2;
                    }
                    var ph = player.get('h');
                    var num = 0;
                    for (var i = 0; i < ph.length; i++) {
                      if (get.tag(ph[i], 'damage')) num++;
                    }
                    if (num > 1) return num;
                    return 0;
                  }
                }
              }
            },
            jlsg_shenfen: {
              audio: "ext:极略:1",
              enable: 'phaseUse',
              usable: 1,
              filter: function (event, player) {
                return player.storage.jlsg_kuangbao >= 6;
              },
              skillAnimation: true,
              animationColor: 'metal',
              mark: true,
              content: function () {
                "step 0"
                player.storage.jlsg_kuangbao -= 6;
                player.syncStorage('jlsg_kuangbao');
                event.targets = game.players.slice(0);
                event.targets.remove(player);
                event.targets.sort(lib.sort.seat);
                event.targets2 = event.targets.slice(0);
                "step 1"
                if (event.targets.length) {
                  event.targets.shift().damage();
                  event.redo();
                }
                "step 2"
                if (event.targets2.length) {
                  var cur = event.targets2.shift();
                  if (cur && cur.num('he')) {
                    if (cur.num('e')) {
                      cur.discard(cur.get('e'));
                    }
                    cur.chooseToDiscard('h', true, 4);
                  }
                  event.redo();
                }
                "step 3"
                player.turnOver();
              },
              ai: {
                order: 9,
                result: {
                  player: function (player) {
                    var num = 0;
                    for (var i = 0; i < game.players.length; i++) {
                      if (game.players[i] != player) {
                        if (game.players[i].ai.shown == 0) return 0;
                        num += get.damageEffect(game.players[i], player, player) > 0 ? 1 : -1;
                      }
                    }
                    return num;
                  }
                }
              }
            },
            jlsg_wushen: {
              mod: {
                cardname: function (card, player, name) {
                  if (['sha', 'tao'].contains(card.name)) return 'juedou';
                },
              },
              audio: "ext:极略:1",
              trigger: { player: 'useCard' },
              forced: true,
              filter: function (event, player) {
                return event.card.name == 'juedou'
                  && event.cards && event.cards.length == 1 && ['sha', 'tao'].contains(event.cards[0].name);
              },
              // filterCard: { name: ['sha', 'tao'] },
              // viewAs: { name: 'juedou' },
              content: function () {
              },
              ai: {
                effect: {
                  target: function (card, player, target, current) {
                    if (get.tag(card, 'respondSha') && current < 0) return 1.5;
                  }
                },
                order: 4,
                useful: -1,
                value: -1
              }
            },
            jlsg_suohun: {
              audio: "ext:极略:1",
              trigger: { player: 'damage' },
              filter: function (event, player) {
                return event.source && event.source != player;
              },
              forced: true,
              init: function (player) {
                for (var i = 0; i < game.players.length; i++) {
                  game.players[i].storage.jlsg_suohun_mark = 0;
                }
              },
              content: function () {
                if (!trigger.source.storage.jlsg_suohun_mark) {
                  trigger.source.storage.jlsg_suohun_mark = 0;
                }
                trigger.source.storage.jlsg_suohun_mark += trigger.num;
                trigger.source.syncStorage('jlsg_suohun_mark');
                trigger.source.markSkill('jlsg_suohun_mark');
              },
              global: ['jlsg_suohun_mark'],
              subSkill: {
                mark: {
                  forced: true,
                  unique: true,
                  mark: true,
                  marktext: '魂',
                  intro: {
                    content: '共有#个标记'
                  }
                }
              },
              group: ['jlsg_suohun2'],
              ai: {
                maixie_defend: true,
              }
            },
            jlsg_suohun2: {
              skillAnimation: true,
              audio: "jlsg_suohun",
              trigger: { player: 'dyingBegin' },
              priority: 10,
              forced: true,
              filter: function (event, player) {
                return player.hp <= 0;
              },
              content: function () {
                "step 0"
                if (player.maxHp > 1) {
                  player.maxHp = Math.ceil(player.maxHp / 2);
                  player.recover(player.maxHp - player.hp);
                  player.update();
                } else {
                  player.loseMaxHp();
                  player.update();
                }
                "step 1"
                for (var i = 0; i < game.players.length; i++) {
                  if (game.players[i].storage.jlsg_suohun_mark) {
                    player.line(game.players[i], 'fire');
                    game.delay(1.5);
                    game.players[i].damage(game.players[i].storage.jlsg_suohun_mark, player);
                    game.players[i].storage.jlsg_suohun_mark = 0;
                    game.players[i].unmarkSkill('jlsg_suohun_mark');
                  }
                }
              },
              ai: {
                threaten: 0.9,
                effect: {
                  target: function (card, player, target) {
                    if (target.maxHp == 1) return;
                    var num = 0;
                    for (var i = 0; i < game.players.length; i++) {
                      if (game.players[i].storage.jlsg_suohun_mark && get.attitude(target, game.players[i]) <= -2) num += game.players[i].storage.jlsg_suohun_mark;
                    }
                    if (get.tag(card, 'damage')) {
                      if (target.hp == 1) return [0, 2 * num];
                      return [1, 0.5];
                    }
                  }
                }
              }
            },
            jlsg_juejing: {
              audio: "ext:极略:1",
              trigger: { global: 'phaseEnd' },
              filter: function (event, player) {
                return player.hp >= 1;
              },
              forced: true,
              content: function () {
                if (player.hp == 1) {
                  player.draw();
                } else if (player.hp > 1) {
                  player.loseHp();
                  player.draw(2);
                }
              }
            },
            jlsg_longhun: {
              audio: "ext:极略:4",
              group: ["jlsg_longhun1", "jlsg_longhun2", "jlsg_longhun3", "jlsg_longhun4"],
              ai: {
                skillTagFilter: function (player, tag) {
                  switch (tag) {
                    case 'respondSha': {
                      if (player.countCards('he', { suit: 'diamond' }) < Math.max(1, player.hp)) return false;
                      break;
                    }
                    case 'respondShan': {
                      if (player.countCards('he', { suit: 'club' }) < Math.max(1, player.hp)) return false;
                      break;
                    }
                    case 'save': {
                      if (player.countCards('he', { suit: 'heart' }) < Math.max(1, player.hp)) return false;
                      break;
                    }
                  }
                },
                save: true,
                respondSha: true,
                respondShan: true,
                effect: {
                  target: function (card, player, target) {
                    //if(get.tag(card,'recover')&&target.hp>=2) return [0,0];
                    if (!target.hasFriend()) return;
                    if ((get.tag(card, 'damage') == 1 || get.tag(card, 'loseHp')) && target.hp > 1) return [0, 1];
                  }
                },
                threaten: function (player, target) {
                  if (target.hp == 1) return 2;
                  return 0.5;
                },
              }
            },
            jlsg_longhun1: {
              audio: "ext:极略:true",
              enable: ['chooseToUse'],
              prompt: function () {
                return '将' + get.cnNumber(Math.max(1, _status.event.player.hp)) + '张红桃牌当作桃使用';
              },
              position: 'he',
              check: function (card, event) {
                if (_status.event.player.hp > 1) return 0;
                return 10 - get.value(card);
              },
              selectCard: function () {
                return Math.max(1, _status.event.player.hp);
              },
              viewAs: { name: 'tao' },
              filter: function (event, player) {
                return player.countCards('he', { suit: 'heart' }) >= player.hp;
              },
              filterCard: function (card) {
                return get.suit(card) == 'heart';
              }
            },
            jlsg_longhun2: {
              audio: "ext:极略:true",
              enable: ['chooseToUse', 'chooseToRespond'],
              prompt: function () {
                return '将' + get.cnNumber(Math.max(1, _status.event.player.hp)) + '张方片当作杀使用或打出';
              },
              position: 'hes',
              check: function (card) {
                if (_status.event.player.hp > 1) return 0;
                return 10 - get.value(card);
              },
              selectCard: function () {
                return Math.max(1, _status.event.player.hp);
              },
              viewAs: { name: 'sha', nature: 'fire' },
              viewAsFilter: function (player) {
                return player.countCards('hes', { suit: 'diamond' }) >= player.hp;
              },
              filterCard: function (card) {
                return get.suit(card) == 'diamond';
              },
            },
            jlsg_longhun3: {
              audio: "ext:极略:true",
              enable: ['chooseToUse', 'chooseToRespond'],
              prompt: function () {
                return '将' + get.cnNumber(Math.max(1, _status.event.player.hp)) + '张黑桃牌当作无懈可击使用';
              },
              position: 'hes',
              check: function (card, event) {
                if (_status.event.player.hp > 1) return 0;
                return 7 - get.value(card);
              },
              selectCard: function () {
                return Math.max(1, _status.event.player.hp);
              },
              viewAs: { name: 'wuxie' },
              viewAsFilter: function (player) {
                return player.countCards('hes', { suit: 'spade' }) >= player.hp;
              },
              filterCard: function (card) {
                return get.suit(card) == 'spade';
              }
            },
            jlsg_longhun4: {
              audio: "ext:极略:true",
              enable: ['chooseToUse', 'chooseToRespond'],
              prompt: function () {
                return '将' + get.cnNumber(Math.max(1, _status.event.player.hp)) + '张梅花牌当作闪使用或打出';
              },
              position: 'hes',
              check: function (card, event) {
                if (_status.event.player.hp > 1) return 0;
                return 10 - get.value(card);
              },
              selectCard: function () {
                return Math.max(1, _status.event.player.hp);
              },
              viewAs: { name: 'shan' },
              viewAsFilter: function (player) {
                return player.countCards('hes', { suit: 'club' }) >= player.hp;
              },
              filterCard: function (card) {
                return get.suit(card) == 'club';
              }
            },
            jlsg_nizhan: {
              group: "jlsg_Zhu_buff",
              audio: "ext:极略:1",
              trigger: { global: 'damageBegin2' },
              filter: function (event) {
                return event.card && (event.card.name == 'sha' || event.card.name == 'juedou') && event.notLink();
              },
              init: function (player) {
                for (var i = 0; i < game.players.length; i++) {
                  game.players[i].storage.jlsg_nizhan_mark = 0;
                }
              },
              direct: true,
              content: function () {
                "step 0"
                player.chooseTarget(get.prompt('jlsg_nizhan'), function (card, player, target) {
                  return (trigger.source == target || trigger.player == target) && player != target;
                }).ai = function (target) {
                  return -get.attitude(player, target);
                }
                "step 1"
                if (result.bool) {
                  player.logSkill('jlsg_nizhan', result.targets[0]);
                  if (!result.targets[0].storage.jlsg_nizhan_mark) {
                    result.targets[0].storage.jlsg_nizhan_mark = 0;
                  }
                  result.targets[0].storage.jlsg_nizhan_mark += 1;
                  result.targets[0].markSkill('jlsg_nizhan_mark');
                  result.targets[0].syncStorage('jlsg_nizhan_mark');
                }
              },
              subSkill: {
                mark: {
                  forced: true,
                  unique: true,
                  mark: true,
                  marktext: '袭',
                  intro: {
                    content: '共有#个标记'
                  }
                }
              },
              ai: {
                threaten: function (player) {
                  if (player.hasSkill('jlsg_cuifeng')) return 4.5;
                  return 0;
                }
              }
            },
            jlsg_cuifeng: {
              audio: "ext:极略:1",
              trigger: { player: 'phaseJieshuBegin' },
              forced: true,
              filter: function (player) {
                var num = 0;
                for (var i = 0; i < game.players.length; i++) {
                  if (!game.players[i].storage.jlsg_nizhan_mark)
                    continue;
                  num += game.players[i].storage.jlsg_nizhan_mark;
                }
                if (num >= 4) return true;
                return false;
              },
              content: function () {
                'step 0'
                for (var i = 0; i < game.players.length; i++) {
                  if (game.players[i].storage.jlsg_nizhan_mark) {
                    player.line(game.players[i], 'fire');
                    if (game.players[i].num('h') >= game.players[i].storage.jlsg_nizhan_mark) {
                      player.gainPlayerCard(game.players[i].storage.jlsg_nizhan_mark, game.players[i], 'h', true);
                    } else {
                      player.gain(game.players[i].get('h'));
                      game.players[i].$give(game.players[i].num('h'), player);
                      game.players[i].damage();
                    }
                    game.delay(1);
                  }
                }
                'step 1'
                for (var i = 0; i < game.players.length; i++) {
                  if (!game.players[i].storage.jlsg_nizhan_mark)
                    continue;
                  game.players[i].storage.jlsg_nizhan_mark = 0;
                  game.players[i].unmarkSkill('jlsg_nizhan_mark');
                }
              }
            },
            jlsg_weizhen: {
              audio: "ext:极略:1",
              trigger: { player: 'phaseBegin' },
              filter: function (event, player) {
                var num = 0;
                for (var i = 0; i < game.players.length; i++) {
                  if (!game.players[i].storage.jlsg_nizhan_mark) continue;
                  num += game.players[i].storage.jlsg_nizhan_mark;
                }
                if (num > 0) return true;
                return false;
              },
              prompt: function (event, player) {
                var str = '';
                var num = 0;
                for (var i = 0; i < game.players.length; i++) {
                  if (!game.players[i].storage.jlsg_nizhan_mark) continue;
                  num += game.players[i].storage.jlsg_nizhan_mark;
                }
                str += '移除场上全部的【袭】标记，然后摸' + num + '张牌。';
                return str;
              },
              check: function (event, player) {
                if (player.countCards('h') == 0 || player.hp == 1) return 1;
                return 0;
              },
              content: function () {
                var num = 0;
                for (var i = 0; i < game.players.length; i++) {
                  if (!game.players[i].storage.jlsg_nizhan_mark) continue;
                  if (game.players[i].storage.jlsg_nizhan_mark) {
                    player.line(game.players[i], 'water');
                  }
                  num += game.players[i].storage.jlsg_nizhan_mark;
                  game.players[i].storage.jlsg_nizhan_mark = 0;
                  game.players[i].unmarkSkill('jlsg_nizhan_mark');
                }
                game.delay();
                player.draw(num);
              }
            },
            jlsg_zhiming: {
              audio: "ext:极略:1",
              trigger: { global: 'phaseZhunbeiBegin' },
              filter: function (event, player) {
                return event.player != player && event.player.countCards('h') && player.countCards('h');
              },
              direct: true,
              content: function () {
                "step 0"
                player.chooseToDiscard('h', get.prompt2(event.name, trigger.player)).ai = function (card) {
                  if (get.attitude(player, trigger.player) < 0)
                    return 10 - get.value(card);
                  return 0;
                }
                'step 1'
                if (result.bool) {
                  player.logSkill('jlsg_zhiming', trigger.player);
                  event.color = get.color(result.cards[0]);
                  event.card = trigger.player.get('h').randomGet();
                  trigger.player.discard(event.card);
                } else {
                  event.finish();
                }
                'step 2'
                if (event.color == get.color(event.card)) {
                  player.chooseControl('跳过摸牌', '跳过出牌').ai = function () {
                    if (trigger.player.countCards('h') > trigger.player.hp) return '跳过出牌';
                    return '跳过摸牌';
                  }
                } else {
                  event.finish();
                }
                "step 3"
                if (result.control == '跳过摸牌') {
                  trigger.player.skip('phaseDraw');
                  game.log(trigger.player, '跳过了摸牌阶段');
                }
                if (result.control == '跳过出牌') {
                  trigger.player.skip('phaseUse');
                  game.log(trigger.player, '跳过了出牌阶段');
                }
              },
              ai: {
                expose: 0.4
              }
            },
            jlsg_Zhu_buff: {
              init: function (player) {
                if (lib.config.mode != 'guozhan') {
                  if (game.countPlayer() >= 5 && player.identity == 'zhu') {
                    player.loseMaxHp(true);
                  }
                }
              },
            },
            jlsg_buff_chuantou: {
              ai: {
                unequip: true,
                skillTagFilter: function (player, tag, arg) {
                  if (arg && arg.name == 'sha') return true;
                  return false;
                },
              },
            },
            jlsg_suyin: {
              audio: "ext:极略:1",
              trigger: { player: 'loseEnd' },
              direct: true,
              filter: function (event, player) {
                if (player.countCards('h')) return false;
                for (var i = 0; i < event.cards.length; i++) {
                  if (event.cards[i].original == 'h') return _status.currentPhase != player;
                }
                return false;
              },
              content: function () {
                "step 0"
                player.chooseTarget('【夙隐】：选择一名角色将其翻面', function (card, player, target) {
                  return player != target;
                }).ai = function (target) {
                  //if(target.isTurnedOver()&&get.attitude(player,target)>0) return 10;
                  if (!target.isTurnedOver() && get.attitude(player, target) < 0) return target.countCards('h');
                  return 0;
                }
                "step 1"
                if (result.bool) {
                  player.logSkill('jlsg_suyin', result.targets);
                  result.targets[0].turnOver();
                }
              },
              ai: {
                expose: 0.3
              }
            },
            jlsg_dianjie: {
              audio: "ext:极略:2",
              trigger: { player: ['phaseDrawBefore', 'phaseUseBefore'] },
              prompt: function (event, player) {
                if (event.name == 'phaseDraw') {
                  return '是否发动【电界】跳过摸牌阶段？';
                }
                return '是否发动【电界】跳过出牌阶段？';
              },
              check: function (event, player) {
                if (event.name == 'phaseDraw') {
                  if (player.countCards('h') <= 1 || player.hp == 1) return -1;
                } else {
                  if (player.countCards('h', function (card) {
                    return get.value(card) > 7;
                  })) return -1;
                  if (player.countCards('h') - player.hp >= 3) return -1;
                }
                return 1;
              },
              content: function () {
                "step 0"
                trigger.finish();
                trigger.untrigger();
                player.judge(function (card) {
                  return get.color(card) == 'black' ? 1.5 : -1;
                })
                "step 1"
                if (result.bool) {
                  player.chooseTarget('选择一个目标对其造成一点雷电伤害').ai = function (target) {
                    // if (player.hp == 1) return target == player ? 1 : -1;
                    return get.damageEffect(target, player, player, 'thunder');
                  }
                } else {
                  player.chooseTarget('选择一至两个目标将其横置', [1, 2], function (card, player, target) {
                    return !target.isLinked();
                  }).ai = function (target) {
                    return -get.attitude(player, target);
                  }
                  event.goto(3);
                }
                'step 2'
                if (result.bool) {
                  player.line(result.targets[0], 'thunder');
                  result.targets[0].damage('thunder');
                }
                event.finish();
                'step 3'
                if (result.bool) {
                  player.line(result.targets, 'thunder');
                  for (var i = 0; i < result.targets.length; i++) {
                    result.targets[i].link();
                  }
                }
              }
            },
            jlsg_shendao: {
              audio: "ext:极略:true",
              trigger: { global: 'judge' },
              direct: true,
              content: function () {
                "step 0"
                player.chooseTarget(get.translation(trigger.player) + '的' + (trigger.judgestr || '') + '判定为' +
                  get.translation(trigger.player.judging[0]) + '，是否发动【神道】？', function (card, player, target) {
                    if (target == player) return target.countCards('hej');
                    return target.countCards('ej');
                  }).ai = function (target) {
                    return player == target;
                  }
                "step 1"
                if (result.bool) {
                  event.target = result.targets[0];
                  if (result.targets[0] == player) {
                    player.chooseCard('请选择改判牌', 'hej').set('ai', function (card) {
                      var trigger = _status.event.getTrigger();
                      var player = _status.event.player;
                      var judging = _status.event.judging;
                      var result = trigger.judge(card) - trigger.judge(judging);
                      var attitude = get.attitude(player, trigger.player);
                      if (attitude == 0 || result == 0) return 0;
                      if (attitude > 0) {
                        return result - get.value(card) / 2;
                      } else {
                        return -result - get.value(card) / 2;
                      }
                    }).set('judging', trigger.player.judging[0]);
                  } else {
                    player.choosePlayerCard('请选择改判牌', result.targets[0], 'ej').set('ai', function (button) {
                      var trigger = _status.event.getTrigger();
                      var player = _status.event.player;
                      var judging = _status.event.judging;
                      var result = trigger.judge(button) - trigger.judge(judging);
                      var attitude = get.attitude(player, trigger.player);
                      if (attitude == 0 || result == 0) return 0;
                      if (attitude > 0) {
                        return result - get.value(button) / 2;
                      } else {
                        return -result - get.value(button) / 2;
                      }
                    }).set('judging', trigger.player.judging[0]);
                  }
                }
                "step 2"
                if (result.bool) {
                  event.cardx = result.cards[0] || result.links[0];
                  player.respond(event.cardx, 'highlight', 'noOrdering');
                } else {
                  event.finish();
                }
                "step 3"
                if (result.bool) {
                  player.logSkill('jlsg_old_shendao', event.target);
                  if (trigger.player.judging[0].clone) {
                    trigger.player.judging[0].clone.classList.remove('thrownhighlight');
                    game.broadcast(function (card) {
                      if (card.clone) {
                        card.clone.classList.remove('thrownhighlight');
                      }
                    }, trigger.player.judging[0]);
                    game.addVideo('deletenode', player, get.cardsInfo([trigger.player.judging[0].clone]));
                  }
                  ui.discardPile.appendChild(trigger.player.judging[0]);
                  trigger.player.judging[0] = event.cardx;
                  if (!get.owner(event.cardx, 'judge')) {
                    trigger.position.appendChild(event.cardx);
                  }
                  game.log(trigger.player, '的判定牌改为', event.cardx);
                  game.delay(2);
                }
              },
              ai: {
                tag: {
                  rejudge: 1,
                }
              }
            },
            jlsg_leihun: {
              audio: "ext:极略:1",
              trigger: {
                player: "damageBegin4",
              },
              forced: true,
              filter: function (event) {
                return event.nature == 'thunder';
              },
              content: function () {
                trigger.cancel();
                player.recover(trigger.num);
              },
              ai: {
                nothunder: true,
                effect: {
                  target: function (card, player, target, current) {
                    if (get.tag(card, 'thunderDamage')) {
                      if (target.isHealthy()) return 'zerotarget';
                      if (target.hp == 1) return [0, 2];
                      return [0, 1];
                    }
                  },
                },
              },
            },
            jlsg_shelie: {
              audio: "ext:极略:1",
              trigger: { player: 'phaseDrawBegin1' },
              forced: true,
              content: function () {
                'step 0'
                trigger.cancel(null, null, 'notrigger');
                event.cards = [];
                event.num = 1;
                event.getResultString = function (str) {
                  switch (str) {
                    case '基本牌':
                      return 'basic';
                    case '锦囊牌':
                      return 'trick';
                    case '装备牌':
                      return 'equip';
                  }
                  return str;
                };
                'step 1'
                player.chooseControl('基本牌', '锦囊牌', '装备牌', function () {
                  var randomResult = Math.random();
                  if (randomResult < 0.4) return '锦囊牌';
                  if (randomResult < 0.8) return '基本牌';
                  return '装备牌';
                }).set('prompt', '请选择想要获得的第' + get.cnNumber(event.num, true) + '张牌的类型');
                'step 2'
                event.control = event.getResultString(result.control);
                var card = get.cardPile2(function (card) {
                  return get.type(card, 'trick') == event.control && !event.cards.contains(card);
                });
                if (card) {
                  event.cards.push(card);
                } else {
                  player.chat('无牌可得了吗');
                  game.log(`但是牌堆里面已经没有${result.control}了！`);
                }
                if (event.num < 4) {
                  event.num++;
                  event.goto(1);
                } else {
                  if (event.cards.length) {
                    player.gain(event.cards, 'gain2');
                  }
                }
              }
            },
            jlsg_gongxin: {
              audio: "ext:极略:1",
              enable: 'phaseUse',
              usable: 1,
              filterTarget: function (card, player, target) {
                return target != player && target.countCards('h');
              },
              content: function () {
                'step 0'
                player.viewCards('攻心', target.get('h'));
                event.cards = target.get('h', function (card) {
                  return get.suit(card) == 'heart';
                });
                if (!event.cards.length) {
                  event.finish();
                  return;
                }
                "step 1"
                if (event.cards.length > 1) {
                  event.videoId = lib.status.videoId++;
                  game.broadcastAll(function (player, id, cards) {
                    var str;
                    if (player == game.me && !_status.auto) {
                      str = '攻心：选择获得其中的一张牌';
                    } else {
                      str = '攻心';
                    }
                    var dialog = ui.create.dialog(str, cards);
                    dialog.videoId = id;
                  }, player, event.videoId, event.cards);
                  event.time = get.utc();
                  game.addVideo('showCards', player, ['攻心', get.cardsInfo(event.cards)]);
                  game.addVideo('delay', null, 2);
                } else {
                  player.showCards(event.cards, get.translation(target.name) + '的红桃手牌');
                }
                "step 2"
                if (event.cards.length == 1) {
                  target.discard(event.cards);
                  target.damage();
                  event.finish();
                  return;
                }
                "step 3"
                var next = player.chooseButton();
                next.set('dialog', event.videoId);
                next.set('filterButton', function (button) {
                  return true;
                });
                next.set('ai', function (button) {
                  return get.value(button.link, _status.event.player);
                });
                "step 4"
                if (result.bool && result.links) {
                  event.cards2 = result.links;
                }
                var time = 1000 - (get.utc() - event.time);
                if (time > 0) {
                  game.delay(0, time);
                }
                "step 5"
                game.broadcastAll('closeDialog', event.videoId);
                if (event.cards2) {
                  player.gain(event.cards2, 'log', 'gain2');
                }
              },
              ai: {
                threaten: 1.5,
                result: {
                  target: function (player, target) {
                    return -target.countCards('h');
                  }
                },
                order: 10,
                expose: 0.4,
              }
            },
            jlsg_tianqi_phase: {
            },
            jlsg_tianqi: {
              // TODO: delete excessive audio clips
              // usable: 1,
              audio: "ext:极略:2",
              enable: ['chooseToUse', 'chooseToRespond'],
              hiddenCard: function (player, name) {
                return lib.inpile.contains(name) && !player.isDying() && !player.hasSkill('jlsg_tianqi_phase');
              },
              filter: function (event, player) {
                if (player.isDying() || player.hasSkill('jlsg_tianqi_phase')) return false;
                for (var i of lib.inpile) {
                  if (i == 'shan' || i == 'wuxie') continue;
                  var type = get.type(i);
                  if ((type == 'basic' || type == 'trick') && event.filterCard({ name: i }, player, event)) return true;
                  if (i == 'sha') {
                    for (var j of lib.inpile_nature) {
                      if (event.filterCard({ name: i, nature: j }, player, event)) return true;
                    }
                  }
                }
                return false;
              },
              chooseButton: {
                dialog: function (event, player) {
                  var list1 = [], list1Tag;
                  var list2 = [], list2Tag;
                  for (var i of lib.inpile) {
                    if (!lib.translate[i + '_info']) continue;
                    if (i == 'shan' || i == 'wuxie') continue;
                    var type = get.type(i);
                    if (type == 'basic') {
                      list1.push([type, '', i]);
                      if (event.filterCard({ name: i }, player, event)) list1Tag = true;
                      if (i == 'sha') {
                        for (var j of lib.inpile_nature) list1.push([type, '', i, j]);
                      }
                    }
                    if (type == 'trick') {
                      list2.push([type, '', i]);
                      if (event.filterCard({ name: i }, player, event)) list2Tag = true;
                    }
                  }
                  var dialog = ui.create.dialog();
                  if (list1Tag) {
                    dialog.add('基本牌');
                    dialog.add([list1, 'vcard']);
                  }
                  if (list2Tag) {
                    dialog.add('锦囊牌');
                    dialog.add([list2, 'vcard']);
                  }
                  return dialog;
                },
                filter: function (button, player) {
                  var evt = _status.event.getParent();
                  return evt.filterCard({ name: button.link[2], nature: button.link[3] }, player, evt);
                },
                check: function (button, buttons) {
                  // TODO: optimize
                  var player = _status.event.player;
                  var card = { name: button.link[2], nature: button.link[3] };
                  //if(player.storage.jlsg_tianqi!=get.type(ui.cardPile.firstChild)) delete player.storage.jlsg_tianqi;
                  // if (player.storage.jlsg_tianji_top != get.type(button.link[2], "trick")) return -1;
                  var knowHead = player.getStorage('jlsg_tianji_top')[0] === ui.cardPile.firstChild;
                  var event = _status.event.getParent();
                  var val = event.type == 'phase' ? player.getUseValue(card) / 10 : 3;
                  if (val > 0 && event.type != 'phase' && (get.tag(event.getParent(), 'damage') && event.getParent().name != 'juedou') && !player.countCards('h', { name: button.link[2] })
                    && (!knowHead || get.type(ui.cardPile.firstChild, 'trick') == get.type(button.link[2], "trick") || event.getParent().baseDamage > 1)) {
                    return val;
                  }
                  // calculating lose hp effect
                  var loseHpEffect = lib.jlsg.getLoseHpEffect(player);
                  if (!knowHead) {
                    loseHpEffect /= 2;
                  } else {
                    if (get.type(ui.cardPile.firstChild, 'trick') == get.type(button.link[2], "trick")) {
                      loseHpEffect = 0;
                    }
                  }
                  return val + loseHpEffect;
                  var recover = 0, lose = 1;
                  for (var i = 0; i < game.players.length; i++) {
                    if (!game.players[i].isOut()) {
                      if (game.players[i].hp < game.players[i].maxHp) {
                        if (get.attitude(player, game.players[i]) > 0) {
                          if (game.players[i].hp < 2) {
                            lose--;
                            recover += 0.5;
                          }
                          lose--;
                          recover++;
                        } else if (get.attitude(player, game.players[i]) < 0) {
                          if (game.players[i].hp < 2) {
                            lose++;
                            recover -= 0.5;
                          }
                          lose++;
                          recover--;
                        }
                      } else {
                        if (get.attitude(player, game.players[i]) > 0) {
                          lose--;
                        } else if (get.attitude(player, game.players[i]) < 0) {
                          lose++;
                        }
                      }
                    }
                  }
                  if (lose > recover && lose > 0 && player.storage.jlsg_tianji_top == 'trick') return (button.link[2] == 'wanjian') ? 1 : -1;
                  if (lose < recover && recover > 0 && player.storage.jlsg_tianji_top == 'trick') return (button.link[2] == 'taoyuan') ? 1 : -1;
                  if (player.storage.jlsg_tianji_top == 'basic' && player.isDamaged()) return (button.link[2] == 'tao') ? 1 : -1;
                  if (player.storage.jlsg_tianji_top == 'basic' && player.countCards('h', 'sha')) return (button.link[2] == 'jiu') ? 1 : -1;
                  if (player.storage.jlsg_tianji_top == 'basic' && !player.countCards('h', 'sha')) return (button.link[2] == 'sha') ? 1 : -1;
                  if (player.storage.jlsg_tianji_top == 'trick') return (button.link[2] == 'wuzhong') ? 1 : -1;
                  if (game.players.length < 4 && player.storage.jlsg_tianji_top == 'trick') return (button.link[2] == 'shunshou') ? 1 : -1;
                  return (button.link[2] == 'guohe') ? 1 : -1;
                },
                backup: function (links, player) {
                  var tianqiOnUse = function (result, player) {
                    if (player.isPhaseUsing()) {
                      player.addTempSkill('jlsg_tianqi_phase', 'phaseUseAfter');
                    }
                    player.logSkill('jlsg_tianqi');
                    game.log(player, '声明了' + get.translation(links[0][0]) + '牌');
                    var cards = get.cards();
                    player.showCards(cards);
                    result.cards = cards;
                    if (get.type(cards[0], 'trick') != links[0][0]) {
                      player.loseHp();
                    }
                    delete player.storage.jlsg_tianji_top;
                  };
                  return {
                    filterCard: function () {
                      return false
                    },
                    selectCard: -1,
                    popname: true,
                    viewAs: {
                      name: links[0][2],
                      nature: links[0][3],
                    },
                    onuse: tianqiOnUse,
                    onrespond: tianqiOnUse
                  }
                },
                prompt: function (links, player) {
                  return '亮出牌堆顶的一张牌，并将此牌当' + get.translation(links[0][2]) + '使用或打出。若亮出的牌不为' + get.translation(links[0][0]) + '牌，你须先失去1点体力。(你的出牌阶段限一次。)';
                }
              },
              group: ['jlsg_tianqi_shan', 'jlsg_tianqi_wuxie'],
              ai: {
                order: 10,
                fireAttack: true,
                respondShan: true,
                respondSha: true,
                skillTagFilter: function (player, tag, arg) {
                  if (player.isDying() || player.hasSkill('jlsg_tianqi_phase')) return false;
                },
                result: {
                  player: function (player) {
                    if (_status.event.dying) return get.attitude(player, _status.event.dying);
                    if (player.storage.jlsg_tianji_top != undefined) return 1;
                    if (player.hp <= 1 && player.storage.jlsg_tianji_top == undefined) return -10;
                    if (Math.random() < 0.67) return 0.5;
                    return -1;
                  },
                },
                threaten: 4,
              }
            },
            jlsg_tianqi_wuxie: {
              enable: ["chooseToUse"],
              audio: "jlsg_tianqi",
              // filter: function (event, player) {
              //   return !player.isDying() && lib.inpile.contains('wuxie');
              // },
              filterCard: function () {
                return false;
              },
              selectCard: -1,
              viewAs: { name: 'wuxie' },
              viewAsFilter: function (player) {
                return !player.isDying() && !player.hasSkill('jlsg_tianqi_phase');
              },
              onuse: function (result, player) {
                if (player.isPhaseUsing()) {
                  player.addTempSkill('jlsg_tianqi_phase', 'phaseUseAfter');
                }
                var cards = get.cards();
                player.showCards(cards);
                result.cards = cards;
                if (get.type(cards[0], 'trick') != 'trick') {
                  player.loseHp();
                }
                delete player.storage.jlsg_tianji_top;
              },
              ai: {
                effect: {
                  player: function (card, player, target) {
                    if (card.name == 'wuxie' && _status.event.skill == 'jlsg_tianqi_wuxie') {
                      var knowHead = player.getStorage('jlsg_tianji_top')[0] === ui.cardPile.firstChild;
                      // calculating lose hp effect
                      var loseHpEffect = lib.jlsg.getLoseHpEffect(player);
                      if (!knowHead) {
                        loseHpEffect /= 2;
                      } else {
                        if (get.type(ui.cardPile.firstChild, 'trick') == 'trick') {
                          loseHpEffect = 0;
                        }
                      }
                      return [1, loseHpEffect];
                    }
                  }
                },
                // skillTagFilter: function (player) {
                //   return !player.isDying();
                // },
                // basic: {
                //   useful: [6, 4],
                //   value: [6, 4],
                // },
              },
            },
            jlsg_tianqi_shan: {
              enable: ['chooseToRespond', 'chooseToUse'],
              audio: "jlsg_tianqi",
              // filter: function (event, player) {
              //   return !player.isDying() && event.parent.name != 'phaseUse';
              // },
              filterCard: function () {
                return false;
              },
              selectCard: -1,
              order: function (card, event, player) {
                var player = _status.event.player;
                var cards = get.cards();
                if (player.hp > 2 && get.type(cards[0]) == 'basic') {
                  return 1;
                }
                if (player.hp <= 2 && player.countCards('h', 'shan') && player.storage.jlsg_tianji_top != 'basic') return 0;
                return 1;
              },
              viewAs: { name: 'shan' },
              viewAsFilter: function (player) {
                return !player.isDying() && !player.hasSkill('jlsg_tianqi_phase');
              },
              onuse: function (result, player) {
                if (player.isPhaseUsing()) {
                  player.addTempSkill('jlsg_tianqi_phase', 'phaseUseAfter');
                }
                var cards = get.cards();
                player.showCards(cards);

                result.cards = cards;
                if (get.type(cards[0], 'basic') != 'basic') {
                  player.loseHp();
                }
                delete player.storage.jlsg_tianji_top;
              },
              onrespond: function (result, player) {
                if (player.isPhaseUsing()) {
                  player.addTempSkill('jlsg_tianqi_phase', 'phaseUseAfter');
                }
                var cards = get.cards();
                player.showCards(cards);

                result.cards = cards;
                if (get.type(cards[0], 'basic') != 'basic') {
                  player.loseHp();
                }
                delete player.storage.jlsg_tianji_top;
              },
              ai: {
                effect: {
                  player: function (card, player, target) {
                    if (card.name == 'shan' && _status.event.skill == 'jlsg_tianqi_shan') {
                      var knowHead = player.getStorage('jlsg_tianji_top')[0] === ui.cardPile.firstChild;
                      // calculating lose hp effect
                      var loseHpEffect = -1;
                      if (!knowHead) {
                        loseHpEffect /= 2;
                      } else {
                        if (get.type(ui.cardPile.firstChild, 'trick') == get.type(button.link[2], "trick")) {
                          loseHpEffect = 0;
                        }
                      }
                      return [1, loseHpEffect];
                    }
                  }
                },
                // basic: {
                //   useful: [7, 2],
                //   value: [7, 2],
                // },
              },
            },
            jlsg_tianji: {
              audio: "ext:极略:1",
              trigger: { global: 'phaseUseBegin' },
              frequent: true,
              filter: function (event, player) {
                if (ui.cardPile.hasChildNodes() == false) return false;
                return true;
              },
              content: function () {
                'step 0'
                event.top = [ui.cardPile.firstChild];
                player.storage.jlsg_tianji_top = [ui.cardPile.firstChild];
                event.dialog = ui.create.dialog('天机', event.top, true);
                var controls = [];
                if (game.hasPlayer(function (target) {
                  return player.countCards('h') <= target.countCards('h') && target != player;
                })) {
                  controls.push('获得');
                }
                controls.push('替换');
                player.chooseControl(controls, 'cancel', event.dialog).ai = function () {
                  if (event.top[0].name == 'du') return 'cancel';
                  return 0;
                };
                'step 1'
                if (result.control == '获得') {
                  player.draw();
                  event.finish();
                } else if (result.control == '替换') {
                  player.chooseCard('选择一张牌置于牌堆顶', 'h', true).ai = function (card) {
                    if (_status.currentPhase == player) {
                      if (player.hp <= player.maxHp / 2 && player.countCards('h', { type: 'basic' })) {
                        return get.type(card) == 'basic';
                      }
                      if (player.hp > player.maxHp / 2 && player.countCards('h', { type: 'trick' })) {
                        return get.type(card) == 'trick';
                      }
                    } else {
                      return 15 - get.value(card);
                    }
                  }
                } else {
                  event.finish();
                }
                'step 2'
                event.card = result.cards[0];
                if (!event.card) {
                  event.finish();
                  return;
                }
                // player.lose(event.card, ui.special);
                player.draw();
                'step 3'
                player.$throw(1, 1000);
                player.storage.jlsg_tianji_top = [event.card];
                player.lose(event.card, ui.cardPile, 'insert');
                game.log(player, '将一张牌置于牌堆顶');
              },
            },
            jlsg_tianji_old: {
              audio: "jlsg_tianji",
              trigger: { global: 'phaseUseBegin' },
              direct: true,
              init: function (player) {
                player.storage.pd = undefined;
              },
              content: function () {
                'step 0'
                var nh = player.countCards('h');
                var num = 0;
                for (var i = 0; i < game.players.length; i++) {
                  var np = game.players[i].num('h');
                  if (np > nh) num++;
                }
                var cards = [];
                cards.push(ui.cardPile.firstChild);
                event.cards = cards;
                var dialog = ui.create.dialog('天机', event.cards, 'hidden');
                dialog.classList.add('noselect');
                if (num) {
                  player.chooseControl('获得', '替换', 'cancel', dialog).ai = function () {
                    return '获得';
                  }
                } else {
                  player.chooseControl('替换', 'cancel', dialog).ai = function () {
                    if (_status.currentPhase !== player) {
                      if (get.type(cards[0]) == 'basic' && (player.countCards('h', { type: 'basic' }) < player.countCards('h') / 2)) return '替换';
                      if (get.type(cards[0]) != 'basic') return '替换';
                    }
                    if (_status.currentPhase == player) {
                      if (get.type(cards[0]) == 'trick' && player.hp <= player.maxHp / 2) return '替换';
                      if (get.type(cards[0]) == 'basic' && player.hp > player.maxHp / 2 && player.countCards('h', { type: 'trick' })) return '替换';
                      if (get.type(cards[0]) == 'equip' && player.countCards('e') < 4) return '替换';
                    }
                    if (get.type(cards[0]) == 'basic') player.storage.pd = 'basic';
                    else player.storage.pd = 'trick';
                    return 'cancel';
                  }
                }
                "step 1"
                if (result.control == '获得') {
                  player.logSkill('jlsg_tianji');
                  player.gain(event.cards, 'draw');
                  event.finish();
                } else if (result.control == '替换') {
                  player.logSkill('jlsg_tianji');
                  player.chooseCard('选择一张牌置于牌堆顶', 'h', true).ai = function (card) {
                    if (_status.currentPhase == player) {
                      if (player.hp <= player.maxHp / 2 && player.countCards('h', { type: 'basic' })) {
                        return get.type(card) == 'basic';
                      }
                      if (player.hp > player.maxHp / 2 && player.countCards('h', { type: 'trick' })) {
                        return get.type(card) == 'trick';
                      }
                    } else {
                      return 15 - get.value(card);
                    }
                  }
                } else {
                  event.finish();
                }
                'step 2'
                event.card = result.cards[0];
                if (get.type(result.cards[0]) == 'basic') {
                  player.storage.pd = 'basic';
                } else {
                  player.storage.pd = 'trick';
                }
                player.lose(result.cards, ui.special);
                var cardx = ui.create.card();
                cardx.classList.add('infohidden');
                cardx.classList.add('infoflip');
                player.$throw(cardx, 1000);
                'step 3'
                game.delay(0.5);
                'step 4'
                if (event.card) {
                  event.card.fix();
                  ui.cardPile.insertBefore(event.card, ui.cardPile.firstChild);
                  player.gain(event.cards, 'draw');
                }
              }
            },
            jlsg_xianzhu: {
              audio: "ext:极略:2",
              trigger: { global: 'recoverAfter' },
              check: function (event, player) {
                return get.attitude(player, event.player) > 0;
              },
              logTarget: 'player',
              content: function () {
                trigger.player.draw(2);
              },
              group: 'jlsg_xianzhu2'
            },
            jlsg_xianzhu2: {
              audio: "jlsg_xianzhu",
              check: function (event, player) {
                return get.attitude(player, event.player) > 0;
              },
              trigger: {
                global: ['loseAfter', 'equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter'],
              },
              direct: true,
              filter: function (event, player) {
                // var evt=event.getl(player);
                // return evt&&evt.es&&evt.es.length>0;
                return game.hasPlayer(p => {
                  var evt = event.getl(p);
                  return evt && evt.es && evt.es.length > 0;
                }
                );
              },
              content: function () {
                'step 0'
                event.players = game.filterPlayer(p => {
                  var evt = trigger.getl(p);
                  return evt && evt.es && evt.es.length > 0;
                });
                'step 1'
                event.target = event.players.shift();
                if (!event.target) {
                  event.finish();
                  return;
                }
                var evt = trigger.getl(event.target);
                event.num = evt && evt.es && evt.es.length;
                'step 2'
                if (!event.num) { // next target
                  event.goto(1);
                  return;
                }
                --event.num;
                player.chooseBool(get.prompt2('jlsg_xianzhu', (player != event.target) ? event.target : undefined))
                  .set('choice', get.attitude(player, event.target) > 0);
                'step 3'
                if (result.bool) {
                  player.logSkill('jlsg_xianzhu2', event.target);
                  event.target.draw(2);
                  event.goto(2);
                } else {
                  event.goto(1);
                }
              },
              ai: {
                noe: true,
                reverseEquip: true,
                effect: {
                  target: function (card, player, target, current) {
                    if (get.type(card) == 'equip' && !get.cardtag(card, 'gifts')) return [1, 3];
                  }
                }
              }
            },
            // jlsg_xianzhu2: {
            //   audio: "jlsg_xianzhu",
            //   trigger: { global: 'loseEnd' },
            //   check: function (event, player) {
            //     return get.attitude(player, event.player) > 0;
            //   },
            //   filter: function (event, player) {
            //     for (var i = 0; i < event.cards.length; i++) {
            //       if (event.cards[i].original == 'e') return true;
            //     }
            //     return false;
            //   },
            //   logTarget: 'player',
            //   content: function () {
            //     var num = 0;
            //     for (var i = 0; i < trigger.cards.length; i++) {
            //       if (trigger.cards[i].original == 'e') num += 2;
            //     }
            //     trigger.player.draw(num);
            //   },
            //   ai:{
            //     noe:true,
            //     reverseEquip:true,
            //     effect:{
            //       target:function(card,player,target,current){
            //         if(get.type(card)=='equip'&&!get.cardtag(card,'gifts')) return [1,3];
            //       }
            //     }
            //   }
            // },
            jlsg_liangyuan: {
              audio: "ext:极略:1",
              enable: 'phaseUse',
              skillAnimation: true,
              unique: true,
              limited: true,
              animationColor: 'fire',
              init: function (player) {
                player.storage.jlsg_liangyuan = false;
              },
              filter: function (event, player) {
                return !player.storage.jlsg_liangyuan;
              },
              filterTarget: function (card, player, target) {
                return player != target && target.hasSex('male');
              },
              content: function () {
                player.storage.jlsg_liangyuan = true;
                target.addSkill('jlsg_liangyuan2');
              },
              ai: {
                order: 6,
                result: {
                  target: 3,
                },
                threaten: function (player, target) {
                  if (game.hasPlayer(function (target1) {
                    return target.hasSkill('jlsg_liangyuan2');
                  })) return 3;
                }
              }
            },
            jlsg_liangyuan2: {
              mark: true,
              intro: {
                content: 'mark'
              },
              marktext: '缘',
              trigger: { global: 'phaseEnd' },
              filter: function (event, player) {
                return event.player.hasSkill('jlsg_liangyuan');
              },
              forced: true,
              content: function () {
                player.phase();
              }
            },
            jlsg_tianzi: {
              srlose: true,
              audio: "ext:极略:1",
              trigger: { player: 'phaseDrawBefore' },
              filter: function (event, player) {
                return !event.numFixed;
              },
              check: function (event, player) {
                return game.countPlayer() - event.num > 1;
              },
              content: function () {
                "step 0"
                trigger.changeToZero();
                event.current = player.next;
                "step 1"
                event.current.chooseCard('交给' + get.translation(player) + '一张手牌或令其摸一张牌').ai = function (card) {
                  if (ai.get.attitude(event.current, player) > 0) {
                    return -1;
                  }
                  else {
                    return 3 - ai.get.value(card);
                  }
                }
                "step 2"
                if (result.bool == false) {
                  event.current.line(player, 'green');
                  game.log(get.translation(event.current) + '让' + get.translation(player) + '摸了一张牌');
                  player.draw();
                }
                else {
                  player.gain(result.cards[0]);
                  event.current.$give(1, player);
                }
                if (event.current.next != player) {
                  event.current = event.current.next;
                  game.delay(0.5);
                  event.goto(1);
                }
              }
            },
            jlsg_meixin: {
              audio: "ext:极略:4",
              enable: 'phaseUse',
              usable: 1,
              filterCard: true,
              position: 'he',
              filterTarget: function (card, player, target) {
                if (player == target) return false;
                return target.hasSex('male');
              },
              check: function (card) {
                return 6 - get.value(card);
              },
              content: function () {
                target.markSkillCharacter('jlsg_meixin', player, '魅心', '本阶段当你使用一张基本牌后，该目标弃置一张牌；当你使用一张锦囊牌后，你获得该目标一张牌；当你使用一张装备牌后，你对该目标造成1点伤害。');
                player.storage.jlsg_meixin = target;
                player.addTempSkill('jlsg_meixin2', 'phaseAfter');
                player.addTempSkill('jlsg_meixin3', 'phaseAfter');
              },
              ai: {
                threaten: 3,
                order: 15,
                expose: 0.3,
                result: {
                  target: function (player, target) {
                    return -target.countCards('h') - 1;
                  }
                }
              }
            },
            jlsg_meixin2: {
              trigger: { player: 'useCardAfter' },
              filter: function (event, player) {
                return player.storage.jlsg_meixin && player.storage.jlsg_meixin.isAlive();
              },
              forced: true,
              content: function () {
                var target = player.storage.jlsg_meixin;

                if (get.type(trigger.card, 'trick') == 'basic' && target.countCards('he') > 0) {
                  player.logSkill('jlsg_meixin', target);
                  target.chooseToDiscard('he', true);
                }
                if (get.type(trigger.card, 'trick') == 'trick' && target.countCards('he') > 0) {
                  player.logSkill('jlsg_meixin', target);
                  player.gainPlayerCard('he', target, true);
                }
                if (get.type(trigger.card, 'trick') == 'equip') {
                  player.logSkill('jlsg_meixin', target);
                  target.damage();
                }
              }
            },
            jlsg_meixin3: {
              trigger: { player: 'phaseEnd' },
              forced: true,
              popup: false,
              filter: function (event, player) {
                return player.storage.jlsg_meixin && player.storage.jlsg_meixin.isAlive();
              },
              content: function () {
                var target = player.storage.jlsg_meixin;
                target.unmarkSkill('jlsg_meixin');
                delete player.storage.jlsg_meixin;
              }
            },
            jlsg_shayi: {
              audio: "ext:极略:2",
              trigger: { player: 'phaseUseBegin' },
              filter: function (event, player) {
                return player.countCards('h') > 0;
              },
              forced: true,
              content: function () {
                'step 0'
                player.showHandcards();
                'step 1'
                if (!player.countCards('h', 'sha')) {
                  player.addTempSkill('jlsg_shayi_buff', 'phaseAfter');
                } else {
                  player.draw();
                }
              },
              mod: {
                cardUsable: function (card, player, num) {
                  if (card.name == 'sha') return Infinity;
                },
                targetInRange: function (card) {
                  if (card.name == 'sha') return true;
                }
              },
              subSkill: {
                buff: {
                  audio: 'ext:极略:2',
                  enable: ['chooseToRespond', 'chooseToUse'],
                  filterCard: function (card) {
                    return get.color(card) == 'black';
                  },
                  position: 'hes',
                  viewAs: { name: 'sha' },
                  viewAsFilter: function (player) {
                    if (!player.countCards('hes', { color: 'black' })) return false;
                  },
                  prompt: '将一张黑色牌当杀使用或打出',
                  check: function (card) {
                    return 4 - get.value(card)
                  },
                  ai: {
                    skillTagFilter: function (player) {
                      if (!player.countCards('hes', { color: 'black' })) return false;
                    },
                    respondSha: true,
                  },
                }
              }
            },
            jlsg_zhenhun: {
              audio: "ext:极略:4",
              enable: 'phaseUse',
              usable: 1,
              filterTarget: function (card, player, target) {
                return player != target;
              },
              filer: function (event, player) {
                return player.countCards('he') > 0;
              },
              filterCard: true,
              check: function (card) {
                return 4 - get.value(card);
              },
              selectTarget: -1,
              content: function () {
                if (!target.hasSkill('jlsg_zhenhun_debuff')) {
                  var list = [];
                  for (var i = 0; i < target.skills.length; i++) {
                    if (!get.is.locked(target.skills[i])) {
                      list.push(target.skills[i]);
                    }
                  }
                  if (list.length > 0) {
                    target.disableSkill('jlsg_zhenhun', list);
                    target.addSkill('jlsg_zhenhun_debuff');
                  }
                }
              },
              ai: {
                order: 10,
                result: {
                  player: function (player) {
                    if (player.countCards('h') > 2) return 1;
                    return -1;
                  },
                  target: function (target) {
                    var num = 0;
                    for (var i = 0; i < target.skills.length; i++) {
                      if (!get.is.locked(target.skills[i])) {
                        if (target.skills[i].enable && target.skills[i].enable == 'phaseUse') {
                          continue;
                        } else {
                          num++;
                        }
                      }
                    }
                    if (num > 0) return -num;
                    return 0;
                  },
                },
                threaten: 1.3
              },
              subSkill: {
                debuff: {
                  trigger: { global: 'phaseAfter' },
                  forced: true,
                  popup: false,
                  content: function () {
                    player.enableSkill('jlsg_zhenhun');
                    player.removeSkill('jlsg_zhenhun_debuff');
                  },
                  mark: true,
                  intro: {
                    content: function (st, player) {
                      var storage = player.disabledSkills.jlsg_zhenhun;
                      if (storage && storage.length) {
                        var str = '失效技能：';
                        for (var i = 0; i < storage.length; i++) {
                          if (lib.translate[storage[i] + '_info']) {
                            str += get.translation(storage[i]) + '、';
                          }
                        }
                        return str.slice(0, str.length - 1);
                      }
                    }
                  }
                }
              }
            },
            jlsg_yinshi: {
              forced: true,
              audio: "ext:极略:1",
              trigger: { player: 'damageBegin' },
              filter: function (event) {
                return event.num > 0;
              },
              content: function () {
                trigger.cancel();
                player.draw(trigger.num);
              },
              ai: {
                nofire: true,
                nothunder: true,
                nodamage: true,
                effect: {
                  target: function (card, player, target, current) {
                    if (get.tag(card, 'damage')) return [0, 0.5];
                    return [1, 0.5];
                    // if (target.countCards('h') < target.maxHp) return [0, 2];
                  }
                },
              },
            },

            jlsg_zhitian: {
              audio: "ext:极略:1",
              trigger: { player: 'phaseZhunbeiBegin' },
              forced: true,
              unique: true,
              priority: 20,
              // filter: function (event, player) {
              //   return player.countCards('h') > 1;
              // },
              content: function () {
                "step 0"
                player.chooseTarget('知天：将所有手牌交给一名角色', true).ai = function (target) {
                  return get.attitude(player, target);
                }
                "step 1"
                if (result.bool) {
                  player.$giveAuto(player.getCards('h').length, result.targets[0]);
                  var cards = player.getCards('h');
                  player.lose(cards, ui.special);
                  result.targets[0].gain(cards);
                  var list = [];
                  var list2 = [];
                  var players = game.players.concat(game.dead);
                  for (var i = 0; i < players.length; i++) {
                    list2.add(players[i].name);
                    list2.add(players[i].name1);
                    list2.add(players[i].name2);
                  }

                  for (var i in lib.character) {
                    if (lib.character[i][4].contains('boss')) continue;
                    if (lib.character[i][4].contains('minskin')) continue;
                    if (lib.character[i][4].contains('hiddenboss')) continue;
                    if (lib.character[i][4].contains('Unaffected')) continue;
                    if (lib.character[i][4].contains('stonehidden')) continue;
                    if (list2.contains(i)) continue;
                    for (var j = 0; j < lib.character[i][3].length; j++) {
                      var info = lib.skill[lib.character[i][3][j]];

                      if (info && (info.gainable || !info.unique) && !info.zhuSkill && !info.juexingji && !info.limited) {

                        list.add(lib.character[i][3][j]);
                      }
                    }
                  }

                  var link = list.randomGet();
                  player.line(result.targets[0], 'green');
                  result.targets[0].addSkill(link);
                  result.targets[0].mark(link, {
                    name: get.translation(link),
                    content: lib.translate[link + '_info']
                  });
                  game.log(result.targets[0], '获得技能', '【' + get.translation(link) + '】');
                }
                "step 2"
                player.loseHp();
              },

            },
            jlsg_zhiji: {
              audio: "ext:极略:3",
              usable: 1,
              enable: 'phaseUse',
              filter: function (event, player) {
                return player.countCards('he', { subtype: 'equip1' });
              },
              filterCard: function (card) {
                return get.subtype(card) == 'equip1';
              },
              position: 'he',
              selectCard: [1, Infinity],
              filterTarget: function (card, player, target) {
                return player != target;
              },
              check: function (card) {
                return 9 - get.value(card);
              },
              content: function () {
                target.damage(cards.length);
              },
              group: ['jlsg_zhiji_damage'],
              subSkill: {
                damage: {
                  audio: 'ext:极略:1',
                  trigger: { player: 'damageEnd' },
                  check: () => true,
                  content: function () {
                    var field = undefined;
                    if (Math.random() > 0.5) {
                      field = 'discardPile';
                    }
                    var card = get.cardPile(function (card) {
                      return get.subtype(card) == 'equip1';
                    }, field);
                    if (!card) {
                      if (!field) {
                        card = get.cardPile(function (card) {
                          return get.subtype(card) == 'equip1';
                        }, 'discardPile');
                      } else {
                        card = get.cardPile(function (card) {
                          return get.subtype(card) == 'equip1';
                        });
                      }
                    }
                    if (card) {
                      player.gain(card, 'gain2');
                      game.log(player, '从' + (field == undefined ? '' : '弃') + '牌堆获得了', card);
                    }
                  }
                }
              },
              ai: {
                order: 10,
                result: {
                  target: -1.5
                },
                tag: {
                  damage: 1
                },
              }
            },
            jlsg_yuanhua: {
              audio: "ext:极略:2",
              mark: true,
              intro: {
                content: '发动元化移出游戏了#张牌',
              },
              init: function (player) {
                player.storage.jlsg_yuanhua = 0;
              },
              locked: true,
              direct: true,
              trigger: { player: 'gainAfter' },
              filter: function (event, player) {
                return event.cards && event.cards.some(c => c.name == 'tao');
              },
              content: function () {
                "step 0"
                event.cards = trigger.cards.filter(c => c.name == 'tao');
                "step 1"
                event.card = event.cards.pop();
                player.logSkill(event.name);
                if (player.isDamaged()) {
                  player.recover();
                } else {
                  player.draw(2, 'nodelay');
                }
                "step 2"
                game.log(player, '将', event.card, '移出游戏');
                player.lose(event.card, ui.special);
                player.addMark('jlsg_yuanhua', 1, false);
                "step 3"
                if (event.cards.length) {
                  event.goto(1);
                }
              },
            },
            jlsg_guiyuan: {
              audio: "ext:极略:1",
              global: 'jlsg_guiyuan_ai',
              enable: 'phaseUse',
              usable: 1,
              content: function () {
                'step 0'
                player.loseHp();
                event.targets = game.filterPlayer(p => p != player);
                event.targets.sortBySeat();
                player.line(event.targets, 'green');
                event.gained = false;
                'step 1'
                event.target = event.targets.shift();
                if (event.target.countCards('h', 'tao')) {
                  var card = event.target.getCards('h', 'tao').randomGet();
                  player.gain(event.target, card, 'visible', 'give');
                  event.gained = true;
                }
                'step 2'
                if (event.targets.length) {
                  event.goto(1);
                }
                else if (!event.gained) {
                  var card = get.cardPile(c => c.name == 'tao');
                  if (card) player.gain(card, 'gain2');
                }
              },
              ai: {
                order: 12,
                result: {
                  player: function (player) {
                    return (player.hp > 1 || player.canSave(player)) ? 1 : 0;
                  }
                }
              }
            },
            jlsg_guiyuan_ai: {
              ai: {
                nokeep: true,
                skillTagFilter: function (player) {
                  if (!game.hasPlayer(p => p.hasSkill('jlsg_guiyuan') && get.attitude(player, p) < 2)) return false;
                },
              }
            },
            jlsg_chongsheng: {
              audio: "ext:极略:1",
              unique: true,
              limited: true,
              trigger: { global: 'dying' },
              check: function (event, player) {
                if (get.attitude(player, event.player) < 4) return false;
                if (player.countCards('h', function (card) {
                  var mod2 = game.checkMod(card, player, 'unchanged', 'cardEnabled2', player);
                  if (mod2 != 'unchanged') return mod2;
                  var mod = game.checkMod(card, player, event.player, 'unchanged', 'cardSavable', player);
                  if (mod != 'unchanged') return mod;
                  var savable = get.info(card).savable;
                  if (typeof savable == 'function') savable = savable(card, player, event.player);
                  return savable;
                }) >= 1 - event.player.hp) return false;
                if (event.player == player || event.player == get.zhu(player)) return true;
                return !player.hasUnknown();
              },
              filter: function (event, player) {
                return event.player.hp <= 0;
              },
              skillAnimation: true,
              animationColor: 'gray',
              logTarget: 'player',
              content: function () {
                'step 0'
                player.awakenSkill('jlsg_chongsheng');
                'step 1'
                var num = player.storage.jlsg_yuanhua || 1;
                if (num > trigger.player.maxHp - trigger.player.hp) {
                  trigger.player.recover(trigger.player.maxHp - trigger.player.hp);
                  trigger.player.draw(num - (trigger.player.maxHp - trigger.player.hp));
                } else {
                  trigger.player.recover(num);
                }
                'step 2'
                if (!trigger.player.isAlive() || !trigger.player.group || trigger.player.group == 'unknown' || trigger.player.isUnseen(0)) {
                  event.finish();
                  return;
                }
                var group = trigger.player.group;
                var list;
                if (_status.characterlist) {
                  list = [];
                  for (var i = 0; i < _status.characterlist.length; i++) {
                    var name = _status.characterlist[i];
                    if (lib.character[name][1] == group) list.push(name);
                  }
                }
                else if (_status.connectMode) {
                  list = get.charactersOL(function (i) {
                    return lib.character[i][1] != group;
                  });
                }
                else {
                  list = get.gainableCharacters(function (info) {
                    return info[1] == group;
                  });
                }
                var players = game.players.concat(game.dead);
                for (var i = 0; i < players.length; i++) {
                  list.remove(players[i].name);
                  list.remove(players[i].name1);
                  list.remove(players[i].name2);
                }
                list = list.randomGets(3);
                if (!list.length) {
                  event.finish();
                  return;
                }
                trigger.player.chooseButton().set('ai', function (button) {
                  return get.rank(button.link, true) - lib.character[button.link][2] -
                    (get.rank(trigger.player.name1, true) - lib.character[trigger.player.name1][2]);
                }).set('createDialog', ['将武将牌替换为一名角色', [list, 'character']]);
                'step 3'
                if (result.bool) {
                  trigger.player.reinit(trigger.player.name, result.links[0]);
                }
              },
            },
            jlsg_lvezhen: {
              shaRelated: true,
              audio: "ext:极略:2",
              trigger: { player: 'shaBegin' },
              filter: function (event, player) {
                return event.target.countDiscardableCards(player, 'he');
              },
              check: function (event, player) {
                return get.attitude(player, event.target) < 0;
              },
              content: function () {
                'step 0'
                event.cards = get.cards(3);
                game.cardsGotoOrdering(cards);
                player.showCards(event.cards);
                'step 1'
                event.numx = 0;
                for (var i = 0; i < event.cards.length; i++) {
                  if (get.type(event.cards[i]) != 'basic') event.numx++;
                }
                // player.$throw(event.cards);
                if (event.numx) {
                  player.discardPlayerCard('请选择想要弃置的牌', trigger.target,
                    [1, Math.min(event.numx, trigger.target.countDiscardableCards(player, 'he'))], 'he').set(
                      'forceAuto', true);
                }
              }
            },
            jlsg_youlong: {
              audio: "ext:极略:2",
              enable: 'phaseUse',
              mark: true,
              marktext: "游",
              intro: {
                content: function () {
                  return '牌堆数' + ui.cardPile.childNodes.length + '张' + '||' + '弃牌数' + ui.discardPile.childNodes.length + '张';
                }
              },
              filterCard: function (card) {
                return get.color(card) == 'black';
              },
              filter: function (event, player) {
                return ui.discardPile.childNodes.length > ui.cardPile.childNodes.length;
              },
              position: 'hs',
              viewAs: { name: 'shunshou' },
              viewAsFilter: function (player) {
                if (!player.countCards('hs', { color: 'black' })) return false;
              },
              prompt: '将一张黑色手牌当顺手牵羊使用',
              check: function (card) {
                return 8 - get.value(card);
              },
              ai: {
                order: 9.5,
              }
            },
            jlsg_danjing: {
              audio: "ext:极略:2",
              enable: 'phaseUse',
              usable: 1,
              direct: true,
              filterTarget: function (card, player, target) {
                return player != target;
              },
              content: function () {
                'step 0'
                player.chooseControl('令其摸三张牌', '令其弃三张牌').ai = function () {
                  if (ai.get.attitude(player, target) > 0) return '令其摸三张牌';
                  return '令其弃三张牌';
                };
                'step 1'
                if (result.control == '令其摸三张牌') {
                  player.logSkill('jlsg_danjing1');
                  player.loseHp();
                  target.draw(3);
                }
                else {
                  player.logSkill('jlsg_danjing2');
                  player.loseHp();
                  target.chooseToDiscard(3, 'he', true);
                }
              },
              ai: {
                order: 5,
                result: {
                  player: function (player) {
                    return jlsg.getLoseHpEffect(player);
                  },
                  target: function (player, target) {
                    if (get.attitude(player, target) > 0) { return 4; }
                    else {
                      return Math.min(3, target.countDiscardableCards(player, 'he')) * 1.5;
                    }
                  }
                }
              }
            },
            jlsg_danjing1: {
              unique: true,
              audio: "ext:极略:true"
            },
            jlsg_danjing2: {
              unique: true,
              audio: "ext:极略:true"
            },
            jlsg_zhonghun: {
              unique: true,
              limited: true,
              audio: "ext:极略:2",
              trigger: { player: 'dieBegin' },
              direct: true,
              content: function () {
                'step 0'
                player.chooseTarget(function (card, player, target) {
                  return player != target;
                }).ai = function (target) {
                  return get.attitude(player, target);
                };
                'step 1'
                if (result.bool) {
                  player.logSkill('jlsg_zhonghun', result.targets);
                  for (var i = 0; i < player.skills.length; i++) {
                    result.targets[0].addSkill(player.skills[i]);
                  }
                }
              }
            },
            jlsg_qinyin: {
              audio: "ext:极略:2",
              direct: true,
              trigger: {
                player: "phaseDiscardBegin",
              },
              filter: function (event, player) {
                return true;
              },
              content: function () {
                'step 0'
                var list = ["摸两张牌，然后令所有角色各失去1点体力。"];
                if (player.countCards('he') >= 2) {
                  list.push("弃两张牌，然后令所有角色各恢复1点体力。");
                }
                event.list = list;
                player.chooseControlList(event.list).set('ai', function (event, player) {
                  var recover = 0, lose = 0, players = game.filterPlayer();
                  for (var i = 0; i < players.length; i++) {
                    if (players[i].hp < players[i].maxHp) {
                      if (get.attitude(player, players[i]) > 0) {
                        if (players[i].hp < 2) {
                          lose--;
                          recover += 0.5;
                        }
                        lose--;
                        recover++;
                      } else if (get.attitude(player, players[i]) < 0) {
                        if (players[i].hp < 2) {
                          lose++;
                          recover -= 0.5;
                        }
                        lose++;
                        recover--;
                      }
                    } else {
                      if (get.attitude(player, players[i]) > 0) {
                        lose--;
                      } else if (get.attitude(player, players[i]) < 0) {
                        lose++;
                      }
                    }
                  }
                  if (lose == 0 && recover == 0) return event.list.indexOf('cancel2');
                  if (player.countCards('h') < player.hp - 1) {
                    lose++;
                  }
                  if (player.needsToDiscard()) {
                    recover++;
                  }
                  if (lose > recover && lose > 0) return event.list.indexOf('摸两张牌，然后令所有角色各失去1点体力。');
                  if (lose < recover && recover > 0 && event.list.contains('弃两张牌，然后令所有角色各恢复1点体力。')) return event.list.indexOf('弃两张牌，然后令所有角色各恢复1点体力。');
                  return event.list.indexOf('cancel2');
                });
                'step 1'
                if (event.list[result.index] == '摸两张牌，然后令所有角色各失去1点体力。') {
                  player.draw(2);
                  var players = game.filterPlayer();
                  player.logSkill('jlsg_qinyin2');
                  for (var i = 0; i < players.length; i++) {
                    players[i].loseHp();
                    game.delay();
                  }
                }
                if (event.list[result.index] == '弃两张牌，然后令所有角色各恢复1点体力。') {
                  player.chooseToDiscard(2, 'he', true);
                  var players = game.filterPlayer();
                  player.logSkill('jlsg_qinyin1');
                  for (var i = 0; i < players.length; i++) {
                    players[i].recover();
                    game.delay();
                  }
                }
              },
              group: ['jlsg_qinyin1', 'jlsg_qinyin2'],
            },
            jlsg_qinyin1: {
              audio: "ext:极略:true",
              unique: true,
            },
            jlsg_qinyin2: {
              audio: "ext:极略:true",
              unique: true,
            },
            jlsg_yeyan: {
              unique: true,
              marktext: "炎",
              mark: true,
              forceDie: true,
              enable: "phaseUse",
              audio: "ext:极略:3",
              animationColor: "metal",
              skillAnimation: "legend",
              filter: function (event, player) {
                return !player.storage.jlsg_yeyan;
              },
              init: function (player) {
                player.storage.jlsg_yeyan = false;
              },
              filterCard: function (card) {
                var suit = get.suit(card);
                for (var i = 0; i < ui.selected.cards.length; i++) {
                  if (get.suit(ui.selected.cards[i]) == suit) return false;
                }
                return true;
              },
              complexCard: true,
              limited: true,
              selectCard: [1, 4],
              line: "fire",
              check: function () {
                return -1
              },
              filterTarget: true,
              selectTarget: [1, 2],
              multitarget: true,
              multiline: true,
              content: function () {
                "step 0"
                player.awakenSkill('jlsg_yeyan');
                player.storage.jlsg_yeyan = true;
                "step 1"
                if (cards.length >= 3) {
                  player.loseHp(3);
                }
                if (targets.length < 2) {
                  target.damage('fire', cards.length);
                } else {
                  targets[0].damage('fire', cards.length);
                  targets[1].damage('fire', cards.length);
                }
              },
              intro: {
                content: 'limited'
              },
              ai: {
                order: 6,
                fireattack: true,
                result: {
                  player: function (player) {
                    var cards = player.get('he');
                    var suits = [];
                    for (var i = 0; i < cards.length; i++) {
                      if (!suits.contains(get.suit(cards[i]))) {
                        suits.push(get.suit(cards[i]));
                      }
                    }
                    if (suits.length < 3) return -1;
                    return suits.length;
                  }
                }
              },
            },

          },
          translate: {
            jlsg_soul: "魂烈包",
            jlsgsoul_caocao: 'SK神曹操',
            jlsgsoul_sunquan: 'SK神孙权',
            jlsgsoul_jiaxu: 'SK神贾诩',
            jlsgsoul_liubei: 'SK神刘备',
            jlsgsoul_zhugeliang: 'SK神诸葛亮',
            jlsgsoul_sp_zhugeliang: 'SP神诸葛亮',
            jlsgsoul_simayi: 'SK神司马懿',
            jlsgsoul_luxun: 'SK神陆逊',
            jlsgsoul_lvbu: 'SK神吕布',
            jlsgsoul_guanyu: 'SK神关羽',
            jlsgsoul_zhaoyun: 'SK神赵云',
            jlsgsoul_zhangliao: 'SK神张辽',
            jlsgsoul_huangyueying: 'SK神黄月英',
            jlsgsoul_zhangjiao: 'SK神张角',
            jlsgsoul_lvmeng: 'SK神吕蒙',
            jlsgsoul_guojia: 'SK神郭嘉',
            jlsgsoul_sunshangxiang: 'SK神孙尚香',
            jlsgsoul_diaochan: 'SK神貂蝉',
            jlsgsoul_zhangfei: 'SK神张飞',
            jlsgsoul_simahui: 'SK神司马徽',
            jlsgsoul_dianwei: 'SK神典韦',
            jlsgsoul_huatuo: 'SK神华佗',
            jlsgsoul_ganning: 'SK神甘宁',
            jlsgsoul_xiahoudun: 'SK神夏侯惇',
            jlsgsoul_zhouyu: 'SK神周瑜',

            jlsg_qinyin: '琴音',
            jlsg_qinyin1: '琴音',
            jlsg_qinyin2: '琴音',
            jlsg_yeyan: '业炎',
            jlsg_huju: '虎踞',
            jlsg_huju2: '虎踞',
            jlsg_hufu: '虎缚',
            jlsg_yanmie: '湮灭',
            jlsg_shunshi: '顺世',
            jlsg_junwang: '君望',
            jlsg_jizhao: '激诏',
            jlsg_jizhao_zhao: "<font color=Red>激诏</font>",
            jlsg_qixing: '七星',
            jlsg_kuangfeng: '狂风',
            jlsg_kuangfeng2: '狂风',
            jlsg_dawu: '大雾',
            jlsg_dawu2: '大雾',
            jlsg_yaozhi: '妖智',
            jlsg_yaozhi_use: '妖智',
            jlsg_xingyun: '星陨',
            jlsg_tongtian: '通天',
            // jlsg_tongtian_shu: '观星',
            // jlsg_tongtian_wei: '反馈',
            // jlsg_tongtian_wu: '制衡',
            // jlsg_tongtian_qun: '完杀',
            // jlsg_tongtian_wei_info: "当你受到伤害后，你可以获得伤害来源的一张牌。",
            // jlsg_tongtian_shu_info: "准备阶段，你可以观看牌堆顶的X张牌，并将其以任意顺序置于牌堆项或牌堆底。（X为存活角色数且至多为5）",
            // jlsg_tongtian_qun_info: "锁定技，你的回合内，除你以外，不处于濒死状态的角色不能使用【桃】。",
            // jlsg_tongtian_wu_info: "出牌阶段限一次，你可以弃置任意张牌，然后摸等量的牌。",
            jlsg_jilve: '极略',
            jlsg_jieyan: '劫焰',
            jlsg_jieyan_buff: "劫焰·摸牌",
            jlsg_fenying: '焚营',
            jlsg_kuangbao: '狂暴',
            jlsg_kuangbao1: '狂暴',
            jlsg_wumou: '无谋',
            jlsg_wuqian: '无前',
            jlsg_shenfen: '神愤',
            jlsg_wushen: '武神',
            jlsg_suohun: '索魂',
            jlsg_suohun2: '索魂',
            jlsg_juejing: '绝境',
            jlsg_longhun: '龙魂',
            jlsg_longhun1: '龙魂·桃',
            jlsg_longhun2: '龙魂·杀',
            jlsg_longhun3: '龙魂·无懈',
            jlsg_longhun4: '龙魂·闪',
            jlsg_nizhan: '逆战',
            jlsg_cuifeng: '摧锋',
            jlsg_weizhen: '威震',
            jlsg_zhiming: '知命',
            jlsg_suyin: '夙隐',
            jlsg_dianjie: '电界',
            jlsg_dianjie2: '电界',
            jlsg_dianjie_buff: '电界·电击',
            jlsg_shendao: '神道',
            jlsg_leihun: '雷魂',
            jlsg_shelie: '涉猎',
            jlsg_gongxin: '攻心',
            jlsg_tianqi: '天启',
            jlsg_tianqi_shan: '天启',
            jlsg_tianqi_wuxie: '天启',
            jlsg_tianji: '天机',
            jlsg_xianzhu: '贤助',
            jlsg_xianzhu2: '贤助',
            jlsg_liangyuan: '良缘',
            jlsg_liangyuan2: '良缘',
            jlsg_tianzi: '天姿',
            jlsg_meixin: '魅心',
            jlsg_shayi: '杀意',
            jlsg_zhenhun: '震魂',
            jlsg_yinshi: '隐世',
            jlsg_zhitian: '知天',
            jlsg_zhiji: '掷戟',
            jlsg_zhiji_damage: '掷戟',
            jlsg_yuanhua: '元化',
            jlsg_guiyuan: '归元',
            jlsg_chongsheng: '重生',
            jlsg_lvezhen: '掠阵',
            jlsg_youlong: '游龙',
            jlsg_danjing: '啖睛',
            jlsg_danjing1: '啖睛',
            jlsg_danjing2: '啖睛',
            jlsg_feiying: '飞影',
            jlsg_guixin: '归心',
            jlsg_zhonghun: '忠魂',
            jlsg_old_dianjie: '电界',
            jlsg_old_shendao: '神道',

            jlsg_feiying_info: '锁定技，若你的武将牌正面朝上，你使用【杀】无距离限制；若你的武将牌正面朝下，你不能成为【杀】的目标。',
            jlsg_guixin_info: '当你受到一次伤害后，你可以获得每名其他角色区域里的一张牌，再摸X张牌（X为阵亡/败退的角色数），然后翻面。',
            jlsg_qinyin_info: '弃牌阶段开始时，你可以选择一项：1.摸两张牌，然后令所有角色各失去一点体力；2.弃两张牌，然后令所有角色各恢复一点体力。',
            jlsg_yeyan_info: '限定技，出牌阶段，你可以弃置至少一种花色不同的手牌，然后对一至2名角色各造成等量的火属性伤害，若你以此法弃置的手牌花色数不少于3，你将失去3点体力。',
            jlsg_huju_info: '锁定技，其他角色的回合开始时，你摸一张牌。你的回合开始时，若你的手牌数为最多（或之一），你选择一项：1、失去一点体力；2、减一点体力上限，失去〖虎踞〗，并获得技能〖制衡〗和〖虎缚〗。',
            jlsg_hufu_info: '出牌阶段限一次，你可以令一名其他角色弃置X张牌（X为其装备区的牌数）。',
            jlsg_yanmie_info: '出牌阶段，你可以弃置一张黑桃牌，令一名其他角色先弃置所有手牌再摸等量的牌并展示之。你弃置其中所有非基本牌，并对其造成等量的伤害。',
            jlsg_shunshi_info: '当你成为其他角色使用基本牌的目标后，你可以令你与除该角色以外的一至三名其他角色各摸一张牌，然后这些角色也成为此牌的目标。',
            jlsg_junwang_info: '锁定技，其他角色的出牌阶段开始时，若其手牌数不小于你，其须交给你一张手牌。',
            jlsg_jizhao_info: '出牌阶段对一名无标记的其他角色限一次，你可以交给其至少一张手牌，并令其获得一个「诏」标记；拥有「诏」标记的角色回合结束时，若其本回合内未造成过伤害，其受到你造成的一点伤害并失去「诏」标记。',
            jlsg_qixing_info: '分发起始手牌时，你将获得起始手牌改为观看牌堆顶十一张牌并获得其中4张手牌，然后将其余7张牌扣置于武将牌上，称为「星」；摸牌阶段结束时，你可以用一-三张手牌来替换一-二枚「星」',
            jlsg_kuangfeng_info: '回合开始阶段开始时，你可以将一张「星」置入弃牌堆，然后选择一名角色获得一枚「风」标记，若如此做，当其于你的下回合开始前受到火焰伤害时，该伤害+1；雷电伤害时，你令其弃置两张牌；普通伤害时，你摸一张牌置入「星」。',
            jlsg_dawu_info: '回合结束阶段开始时，你可以弃掉至少一张「星」，然后选择等量的角色获得「雾」标记，若如此做，当其于你的下回合开始前受到非雷电伤害时，你防止之。',
            jlsg_yaozhi_info: '准备阶段开始时/结束阶段开始时/当你受到伤害后/出牌阶段限一次，你可以摸一张牌，系统随机挑选三个能在对应时机发动的技能，然后你可以选择其中一个发动',
            jlsg_xingyun_info: '锁定技，回合结束后，你减1点体力上限，然后获得一个你发动〖妖智〗选择的技能',
            jlsg_tongtian_info: '限定技，出牌阶段你可以弃置任意花色不同的牌，然后根据以下技能获得相应技能：黑桃·反馈；红桃·观星；梅花·完杀；方片·制衡。',
            jlsg_jilve_info: '出牌阶段，你可以摸一张牌，然后选择一项：使用一张牌，或弃置一张牌。若你以此法弃置牌，则本回合此技能失效。',
            jlsg_jieyan_info: '当一张红色【杀】或红色普通锦囊牌仅指定一名角色为目标后，你可以弃置一张手牌令其无效，然后对目标角色造成一点火焰伤害。',
            jlsg_fenying_info: '当一名角色受到火焰伤害后，若你的手牌数不大于体力上限，你可以弃置一张红色牌，然后对该角色或与其距离最近的一名角色（不为你）造成等量的火焰伤害。',
            jlsg_kuangbao_info: '锁定技，游戏开始时，你获得2枚「暴」标记。每当你造成或受到伤害时，你获得等量的「暴」标记。',
            jlsg_wumou_info: '锁定技，当你使用非延时锦囊牌时，你须选择一项：1，弃置一枚「暴」标记；2，受到一点伤害。',
            jlsg_wuqian_info: '出牌阶段：你可以弃置2枚「暴」标记，若如此做，本回合内你视为拥有技能【无双】且你造成伤害后额外获得一枚「暴」标记。',
            jlsg_shenfen_info: '出牌阶段，弃6个暴怒标记，你对每名其他角色各造成一点伤害，其他角色先弃掉各自装备区里所有的牌，再各弃4张手牌，然后将你的武将牌翻面，每回合限一次。',
            jlsg_wushen_info: '锁定技，你的【杀】和【桃】均视为【决斗】。',
            jlsg_suohun_info: '锁定技，每当你受到一点伤害时，伤害来源(除你以外)获得一个「魂」标记。当你进入濒死状态时，减一半(向上取整)的体力上限并恢复体力至体力上限，拥有「魂」标记的角色依次弃置所有的「魂」标记，然后受到与弃置的「魂」标记数量相同的伤害。',
            jlsg_juejing_info: '锁定技，一名角色的回合结束时，若你的体力值：为一，你摸一张牌；大于一，你失去1点体力，然后摸两张牌。',
            jlsg_longhun_info: '你可以将同花色的X张牌按下列规则使用（或打出）：红桃当【桃】；方块当火属性的【杀】；梅花当【闪】；黑桃当【无懈可击】。（X为你当前的体力值且至少为一）。',
            jlsg_nizhan_info: '每当一名角色受到【杀】或【决斗】造成的一次伤害后，你可以将一枚「袭」标记放置在该角色或伤害来源(不为你)的武将牌上；锁定技，你的身份为“主公”时，不增加体力上限。',
            jlsg_cuifeng_info: '锁定技，回合结束阶段，若场上的「袭」标记总数不小于4，你须依次从每名被标记的角色处获得等同于其「袭」标记数量的手牌。若该角色手牌不足，则你获得其全部手牌，然后该角色受到你对其造成的一点伤害。最后移除场上全部的「袭」标记。',
            jlsg_weizhen_info: '回合开始阶段，你可以移除场上全部的「袭」标记，然后摸等同于「袭」标记数量的牌。',
            jlsg_zhiming_info: '其他角色的回合开始阶段开始时，若其有手牌，你可以弃置一张手牌，然后弃置其一张手牌，若两张牌颜色相同，你令其跳过此回合的摸牌阶段或出牌阶段。',
            jlsg_suyin_info: '你的回合外，当你失去最后的手牌时，可令一名其他角色将其武将牌翻面。',
            jlsg_mod_dianjie_info: '你的回合外，当你使用或打出一张【闪】后，或你主动跳过出牌阶段后：你可以进行一次判定，若为黑色，你对一名角色造成1点雷电伤害；若为红色，你可以令一至二名未横置的角色横置。',
            jlsg_dianjie_info: '你可以跳过你的摸牌阶段或出牌阶段，然后判定：若结果为黑色，你对一名角色造成一点雷电伤害；若结果为红色，你令至多两名武将牌未横置的角色将其武将牌横置。',
            jlsg_mod_shendao_info: '锁定技，对一名角色的判定牌生效前，你亮出牌堆顶的两张牌，选择其中一张直接代替之，若不是你的回合，你将另一种牌收入手牌。',
            jlsg_shendao_info: '一名角色的判定牌生效前，你可以用一张手牌或场上的牌代替之',
            jlsg_leihun_info: '锁定技，你受到的雷电伤害均视为体力恢复。',
            jlsg_shelie_info: '锁定技，摸牌阶段开始时，你跳过之，改为选择指定获得某种类型的牌（最多四次），然后从牌堆随机摸取之。',
            jlsg_gongxin_info: '出牌阶段限一次，你可以观看一次任意一名角色的手牌并展示其中所有的红桃牌，然后若展示的牌数：为一，你弃置之并对其造成一点伤害；大于一，你获得其中一张红桃牌。',
            jlsg_tianqi_info: '你的濒死状态除外，每当你需要使用或打出一张基本牌或非延时锦囊牌时，你可以声明之，然后亮出牌堆顶的一张牌，并将此牌当你所述之牌使用或打出，若其与你所述之牌不为同一类别，你须先失去一点体力。（但出牌阶段仅限一次。）',
            jlsg_tianji_info: '任一角色的出牌阶段开始时，你可以观看牌堆顶的一张牌，然后你可以选择一项：用一张手牌替换之；若你的手牌数不是全场最多的(或之一)，你可以获得之。',
            jlsg_xianzhu_info: '当一名角色恢复体力后，或失去一张装备区里的牌后，你可以令其摸两张牌。',
            jlsg_liangyuan_info: '限定技，出牌阶段，你可以选择一名其他男性角色，则于本局游戏中，你的自然回合结束时，该角色进行一个额外的回合。',
            jlsg_tianzi_info: '摸牌阶段开始时，你可以放弃摸牌，然后令所有其他角色依次选择一项：1、交给你一张牌；2、令你摸一张牌。',
            jlsg_meixin_info: '出牌阶段限一次，你可以弃置一张牌并选择一名其他男性角色，若如此做，本阶段当你使用一张基本牌后，你令其弃置一张牌；当你使用一张锦囊牌后，你获得其一张牌；当你使用一张装备牌后，你对其造成一点伤害。',
            jlsg_shayi_info: '锁定技，出牌阶段开始时，你展示所有手牌，若有【杀】，你摸一张牌；若没有【杀】，你于本阶段可以将一张黑色牌当【杀】使用。你使用【杀】无距离限制、无次数限制。',
            jlsg_zhenhun_info: '出牌阶段限一次，你可以弃置一张牌令所有其他角色的非锁定技于本阶段内无效。',
            jlsg_zhitian_info: '锁定技，你的回合开始时，你须将所有手牌交给一名角色，并令该角色随机获得未加入本局游戏的武将的一个技能（觉醒技、主公技、限定技和变化技除外），然后你失去一点体力。',
            jlsg_yinshi_info: '锁定技，当你受到伤害时，你防止之，然后摸等同于此伤害值数量的牌。',
            jlsg_zhiji_info: '出牌阶段限一次，你可以弃置至少一张武器牌，然后对一名其他角色造成等同于此次弃置武器牌数点伤害。当你受到伤害后，你可以从弃牌堆或牌堆随机获得一张武器牌。',
            jlsg_yuanhua_info: '锁定技，你获得【桃】后，若你已受伤，你回复1点体力，否则你摸两张牌。然后将此【桃】移出游戏。',
            jlsg_guiyuan_info: '出牌阶段限一次，你可以失去一点体力，然后令所有其他角色依次交给你一张【桃】，若你没有以此法获得牌，你从牌堆或弃牌堆获得一张【桃】。',
            jlsg_chongsheng_info: '限定技，一名角色进入濒死状态时，你可以令其回复X点体力（过量回复改为摸牌），然后其可以从随机三张同势力武将牌中选择一张替换之。（X为你发动〖元化〗移除牌的数量且至少为1）',
            jlsg_lvezhen_info: '当你使用【杀】指定目标后，你可以将牌堆顶的3张牌置入弃牌堆，其中每有一张非基本牌，你弃置目标角色一张牌。',
            jlsg_youlong_info: '出牌阶段，若弃牌堆的牌数多于牌堆，你可以将黑色手牌当【顺手牵羊】使用。',
            jlsg_danjing_info: '出牌阶段限一次，你可以失去1点体力，然后令一名其他角色摸三张牌或弃置三张牌。',
            jlsg_zhonghun_info: '限定技，当你死亡时，你可以令一名其他角色获得你当前的所有技能。',
          },
        };
        if (lib.device || lib.node) {
          for (var i in jlsg_soul.character) {
            jlsg_soul.character[i][4].push('ext:极略/' + i + '.jpg');
          }
        } else {
          for (var i in jlsg_soul.character) {
            jlsg_soul.character[i][4].push('db:extension-极略:' + i + '.jpg');
          }
        }
        return jlsg_soul;
      });
      game.import('character', function () { // 三英
        var jlsg_sy = {
          name: 'jlsg_sy',
          character: {
            // jlsgsy_lvbu: ['male', 'shen', 8, ['jlsgsy_wushuang', 'mashu', 'jlsgsy_baonulvbu'], ['qun', 'boss', 'bossallowed'], 'qun'],
            // jlsgsy_lvbubaonu: ['male', 'shen', 4, ['jlsgsy_wushuang', 'mashu', 'jlsgsy_xiuluo', 'jlsgsy_shenwei', 'jlsgsy_shenji'], ['qun', 'hiddenboss', 'bossallowed'], 'qun'],
            jlsgsy_dongzhuo: ['male', 'shen', 8, ['jlsgsy_zongyu', 'jlsgsy_lingnue', 'jlsgsy_baozheng', 'jlsgsy_baonudongzhuo'], ['qun', 'boss', 'bossallowed'], 'qun'],
            jlsgsy_dongzhuobaonu: ['male', 'shen', 4, ['jlsgsy_zongyu', 'jlsgsy_lingnue', 'jlsgsy_baozheng', 'jlsgsy_nishi', 'jlsgsy_hengxing'], ['qun', 'hiddenboss', 'bossallowed'], 'qun'],
            jlsgsy_zhangjiao: ['male', 'shen', 8, ['jlsgsy_bujiao', 'jlsgsy_taiping', 'jlsgsy_baonuzhangjiao'], ['qun', 'boss', 'bossallowed'], 'qun'],
            jlsgsy_zhangjiaobaonu: ['male', 'shen', 4, ['jlsgsy_bujiao', 'jlsgsy_taiping', 'jlsgsy_yaohuo', 'jlsgsy_sanzhi'], ['qun', 'hiddenboss', 'bossallowed'], 'qun'],
            jlsgsy_zhangrang: ['male', 'shen', 7, ['jlsgsy_chanxian', 'jlsgsy_baonuzhangrang'], ['qun', 'boss', 'bossallowed'], 'qun'],
            jlsgsy_zhangrangbaonu: ['male', 'shen', 4, ['jlsgsy_chanxian', 'jlsgsy_luanzheng', 'jlsgsy_canlue'], ['qun', 'hiddenboss', 'bossallowed'], 'qun'],
            jlsgsy_weiyan: ['male', 'shen', 8, ['jlsgsy_shiao', 'jlsgsy_baonuweiyan'], ['shu', 'boss', 'bossallowed'], 'shu'],
            jlsgsy_weiyanbaonu: ['male', 'shen', 4, ['jlsgsy_shiao', 'jlsgsy_fangu', 'jlsgsy_kuangxi'], ['shu', 'hiddenboss', 'bossallowed'], 'shu'],
            jlsgsy_sunhao: ['male', 'shen', 8, ['jlsgsy_mingzheng', 'jlsgsy_baonusunhao'], ['wu', 'boss', 'bossallowed'], 'wu'],
            jlsgsy_sunhaobaonu: ['male', 'shen', 4, ['jlsgsy_shisha', 'jlsgsy_huangyin', 'jlsgsy_zuijiu', 'jlsgsy_guiming'], ['wu', 'hiddenboss', 'bossallowed'], 'wu'],
            jlsgsy_caifuren: ['female', 'shen', 7, ['jlsgsy_dihui', 'jlsgsy_baonucaifuren'], ['qun', 'boss', 'bossallowed'], 'qun'],
            jlsgsy_caifurenbaonu: ['female', 'shen', 4, ['jlsgsy_dihui', 'jlsgsy_luansi', 'jlsgsy_huoxin'], ['qun', 'hiddenboss', 'bossallowed'], 'qun'],
            jlsgsy_simayi: ['male', 'shen', 7, ['jlsgsy_bolue', 'jlsgsy_baonusimayi'], ['jin', 'boss', 'bossallowed'], 'jin'],
            jlsgsy_simayibaonu: ['male', 'shen', 4, ['jlsgsy_bolue', 'jlsgsy_jinji', 'jlsgsy_biantian', 'jlsgsy_tianyou'], ['jin', 'hiddenboss', 'bossallowed'], 'jin'],
          },
          skill: {
            jlsgsy_baonu: {
              audio: "ext:极略:1",
              skillAnimation: true,
              trigger: { player: 'changeHp' },
              locked: true,
              silent: true,
              priority: 100,
              unique: true,
              mode: ['identity', 'guozhan', 'boss', 'stone'],
              filter: function (event, player) {
                return player.hp <= 4;
              },
              content: function () {
                var slimName = null;
                if (event.name.length > 12 && event.name.startsWith("jlsgsy_baonu")) {
                  slimName = event.name.substr(12);
                } else {
                  event.finish(); return;
                }
                if (player.hp < 4) {
                  player.hp = 4;
                }
                var name1 = player.name1, name2 = player.name2;
                if (name1.startsWith('jlsgsy_') && !name1.endsWith('baonu')) {
                  player.logSkill('jlsgsy_baonu' + name1.substr(7));
                  player.reinit(name1, name1 + 'baonu');
                }
                if (name2 && name2.startsWith('jlsgsy_') && !name2.endsWith('baonu')) {
                  player.logSkill('jlsgsy_baonu' + name2.substr(7));
                  player.reinit(name2, name2 + 'baonu');
                }
                player.update();
                ui.clear();
                while (_status.event.name != 'phaseLoop') {
                  _status.event = _status.event.parent;
                }
                game.resetSkills();
                _status.paused = false;
                _status.event.player = player;
                _status.event.step = 0;
                if (game.bossinfo) {
                  game.bossinfo.loopType = 1;
                }
              },
              group: ['jlsgsy_baonu2'],
            },
            jlsgsy_baonulvbu: {
              inherit: 'jlsgsy_baonu',
              animationStr: '把你们全宰了！',
              mode: ['identity', 'guozhan', 'boss', 'stone'],
            },
            jlsgsy_wushuang: {
              inherit: 'wushuang',
              audio: "ext:极略:1",
            },
            jlsgsy_xiuluo: {
              audio: "ext:极略:1",
              inherit: 'xiuluo',
            },
            jlsgsy_shenwei: {
              audio: "ext:极略:1",
              inherit: 'shenwei',
            },
            jlsgsy_shenji: {
              audio: "ext:极略:1",
              inherit: 'shenji',
            },
            jlsgsy_guiming: {
              audio: "ext:极略:1", // audio: ['jlsgsy_guiming'],
              trigger: { player: 'dying' },
              priority: 5,
              direct: true,
              unique: true,
              limited: true,
              init: function (player) {
                player.storage.jlsgsy_guiming = false;
              },
              filter: function (event, player) {
                if (player.storage.jlsgsy_guiming) return false;
                for (var i = 0; i < game.players.length; i++) {
                  if (game.players[i] == player) continue;
                  if (game.players[i].hp < game.players[i].maxHp) {
                    return true;
                  }
                }
                return false;
              },
              mark: true,
              intro: {
                content: 'limited'
              },
              content: function () {
                'step 0'
                player.storage.jlsgsy_guiming = true;
                player.unmarkSkill('jlsgsy_guiming');
                player.chooseTarget(function (card, player, target) {
                  if (player == target) return false;
                  for (var i = 0; i < game.players.length; i++) {
                    if (game.players[i] == player) continue;
                    if (game.players[i].hp < target.hp) return false;
                  }
                  return target.hp < target.maxHp;
                }, '是否发动【归命】？').ai = function (target) {
                  if (player != target) return 10;
                  return -1;
                };
                'step 1'
                if (result.bool) {
                  player.logSkill('jlsgsy_guiming', result.targets);
                  result.targets[0].recover(result.targets[0].maxHp - result.targets[0].hp);
                  player.recover(4 - player.hp);
                }
              }
            },
            jlsgsy_huangyin: {
              audio: "ext:极略:1", // audio: ['jlsgsy_huangyin'],
              trigger: { player: 'drawBegin' },
              // priority: -99,
              direct: true,
              // unique: true,
              check: function (event, player) {
                var hasAtt = 0;
                for (var i = 0; i < game.players.length; i++) {
                  if (game.players[i] == player) continue;
                  if (!game.players[i].isOut()) {
                    if (ai.get.attitude(player, game.players[i]) < 0) {
                      if (game.players[i].num('he') >= 2) {
                        hasAtt++;
                      }
                    }
                    else if (ai.get.attitude(player, game.players[i]) > 0) {
                      if (game.players[i].num('j') > 0) {
                        hasAtt++;
                      }
                    }
                  }
                }
                return hasAtt;
              },
              content: function () {
                "step 0"
                event.num = trigger.num;
                "step 1"
                player.chooseTarget(function (card, player, target) {
                  return player != target && target.num('hej');
                }, '###是否发动【荒淫】?###请选择获得牌的目标').ai = function (target) {
                  if (target.num('j')) return ai.get.attitude(player, target);
                  if (target.num('he')) return -ai.get.attitude(player, target);
                  return -ai.get.attitude(player, target);
                };
                "step 2"
                if (result.bool) {
                  player.logSkill('jlsgsy_huangyin', result.targets[0]);
                  player.line(result.targets[0], 'green');
                  event.targets = result.targets[0];
                  if (event.num == 1) {
                    trigger.num = 0;
                    player.gainPlayerCard('hej', event.targets, true);
                    event.finish();
                  }
                  else {
                    player.gainPlayerCard('hej', event.targets, [1, event.num], true);
                  }
                }
                else {
                  event.finish();
                }
                "step 3"
                if (result.bool) {
                  event.num -= result.links.length;
                  trigger.num -= result.links.length;
                }
                "step 4"
                if (event.num > 0) event.goto(1);
              }
            },
            jlsgsy_baonusunhao: {
              inherit: 'jlsgsy_baonu',
              animationStr: '当个好皇帝有什么意思!',
              mode: ['identity', 'guozhan', 'boss', 'stone'],
            },
            jlsgsy_mingzheng: {
              audio: "ext:极略:1",
              derivation: 'jlsgsy_shisha',
              trigger: { global: 'phaseDrawBegin' },
              frequent: true,
              content: function () {
                trigger.num++;
              },
              group: ['jlsgsy_mingzheng2'],
              ai: {
                threaten: 0.8,
              },
            },
            jlsgsy_mingzheng2: {
              trigger: { player: 'damageEnd' },
              forced: true,
              content: function () {
                player.removeSkill('jlsgsy_mingzheng');
                player.addSkill('jlsgsy_shisha');
              }
            },
            jlsgsy_shisha: {
              audio: "ext:极略:1", // audio: ['jlsgsy_shisha'],
              trigger: { player: 'shaBegin' },
              check: function (event, player) {
                return 1;
              },
              forced: true,
              content: function () {
                "step 0"
                var next = trigger.target.chooseToDiscard(2, 'he');
                next.ai = function (card) {
                  if (trigger.target.hp == 1 && !trigger.target.num('h', 'tao')) return 13 - ai.get.value(card);
                  if (trigger.target.hp == trigger.target.maxHp) return 6 - ai.get.value(card);
                  return 8 - ai.get.value(card);
                };
                "step 1"
                if (!result.bool) {
                  trigger.untrigger();
                  trigger.directHit = true;
                }
                else {
                  trigger.untrigger();
                  trigger.finish();
                }
              }
            },
            jlsgsy_zuijiu: {
              audio: "ext:极略:1", // audio: ['jlsgsy_zuijiu'],
              enable: 'phaseUse',
              usable: 1,
              delay: 0,
              filter: function (event, player) {
                return player.num('h') > 0;
              },
              content: function () {
                "step 0"
                player.showHandcards();
                "step 1"
                if (player.num('h', { color: 'black' }) >= player.num('h', { color: 'red' })) player.useCard({ name: 'jiu' }, player);
              },
              ai: {
                order: 10,
                result: {
                  player: function (player) {
                    if (player.getStat().card.sha > 0) return 0;
                    if (player.num('h', 'jiu')) return 0;
                    if (player.hasSkill('jiu')) return 0;
                    if (!player.num('h', 'sha')) return 0;
                    if (player.num('h', { color: 'black' }) >= player.num('h', { color: 'red' })) return 3;
                    return 0;
                  }
                }
              },
            },
            jlsgsy_bolue: {
              audio: false,
              derivation: ['qiangxi', 'jlsg_qicai', 'luanji', 'jlsg_quanheng'],
              enable: 'phaseUse',
              usable: 1,
              unique: true,
              content: function () {
                'step 0'
                player.judge(ui.special);
                'step 1'
                var mapping = {
                  spade: ['jlsgsy_qiangxi', 'qiangxi'],
                  heart: ['jlsgsy_qicai', 'jlsg_qicai'],
                  club: ['jlsgsy_luanji', 'luanji'],
                  diamond: ['jlsgsy_quanheng', 'jlsg_quanheng'],
                }
                var skillStrs = mapping[result.suit];
                if (skillStrs) {
                  game.trySkillAudio(skillStrs[0], player);
                  player.addTempSkill(skillStrs[1]);
                  game.log(player, `获得了技能【${lib.translate[skillStrs[1]]}】`);
                }
                player.gain(result.card);
                player.$gain2(result.card);
              },
              ai: {
                order: 13,
                result: {
                  player: 1
                },
                threaten: 1.5
              },
            },
            jlsgsy_qiangxi: {
              inherit: 'qiangxi',
              audio: "ext:极略:1",
            },
            jlsgsy_qicai: {
              inherit: 'jlsg_qicai',
              audio: "ext:极略:1",
            },
            jlsgsy_luanji: {
              inherit: 'luanji',
              audio: "ext:极略:1",
            },
            jlsgsy_quanheng: {
              inherit: 'jlsg_quanheng',
              audio: "ext:极略:1",
            },
            jlsgsy_baonusimayi: {
              inherit: 'jlsgsy_baonu',
              animationStr: '老夫没时间陪你们了!',
              mode: ['identity', 'guozhan', 'boss', 'stone'],
            },
            jlsgsy_biantian: {
              audio: "ext:极略:1",
              trigger: { global: 'phaseJudgeBefore' },
              forced: true,
              filter: function (event, player) {
                if (event.player == player) return false;
                return event.player.isAlive();
              },
              unique: true,
              content: function () {
                'step 0'
                event.judgestr = '闪电';
                trigger.player.judge(function (card) {
                  if (get.suit(card) == 'spade' && get.number(card) > 1 && get.number(card) < 10) return -6;
                  return 0;
                }, event.judgestr).judge2 = (result => result.bool === false);
                game.delayx(1.5);
                'step 1'
                if (result.bool === false) {
                  trigger.player.damage(3, 'thunder', 'nosource');
                }
                else {
                  event.finish();
                }
              }
            },
            jlsgsy_tianyou: {
              audio: "ext:极略:1", // audio: ['jlsgsy_tianyou'],
              trigger: { player: 'phaseJieshuBegin' },
              init: function (player) {
                player.storage.tianyou = false;
              },
              unique: true,
              intro: {
                content: 'cards'
              },
              check: function (event, player) {
                return 1;
              },
              marktext: '佑',
              content: function () {
                "step 0"
                player.storage.tianyou = true;
                event.cards = get.cards(1);
                player.showCards(event.cards);
                "step 1"
                player.$gain2(event.cards);
                event.color = get.color(event.cards);
                var str = '';
                if (event.color == 'red') str += '红色';
                if (event.color == 'black') str += '黑色';
                player.storage['jlsgsy_tianyou'] = event.cards;
                player.storage.tianyou2 = event.color;
                player.markSkill('jlsgsy_tianyou');
                game.log(player, '将', str, '牌', event.cards, '置于武将牌上');
              },
              group: ['jlsgsy_tianyou2'],
            },
            jlsgsy_tianyou2: {
              trigger: { player: 'phaseBegin' },
              filter: function (event, player) {
                return player.storage.tianyou;
              },
              direct: true,
              unique: true,
              content: function () {
                player.storage.tianyou = false;
                player.discard(player.storage['jlsgsy_tianyou']);
                player.unmarkSkill('jlsgsy_tianyou');
                delete player.storage['jlsgsy_tianyou'];
                delete player.storage.tianyou2;
              },
              mod: {
                targetEnabled: function (card, player, target) {
                  if (get.color(card) == target.storage.tianyou2) {
                    return false;
                  }
                }
              },
            },
            jlsgsy_fangzhu: {
              audio: "ext:极略:1", // audio: ['jlsgsy_fangzhu'],
            },
            jlsgsy_fankui: {
              audio: "ext:极略:1", // audio: ['jlsgsy_fankui'],
            },
            jlsgsy_ganglie: {
              audio: "ext:极略:1", // audio: ['jlsgsy_ganglie'],
            },
            jlsgsy_jinji: {
              audio: false,
              trigger: { player: 'damageEnd' },
              unique: true,
              priority: 10,
              filter: function (event, player) {
                return event.source != undefined && event.source.isAlive();
              },
              check: function (event, player) {
                var att = ai.get.attitude(player, event.source);
                return att < -1;
              },
              content: function () {
                "step 0"
                player.judge(function (card) {
                  if (get.suit(card) == 'spade') return 1;
                  if (get.color(card) == 'red') return 1.1;
                  if (get.suit(card) == 'club') return 1.5;
                  return 0;
                });
                "step 1"
                player.gain(result.card);
                player.$gain2(result.card);
                event.color = get.color(result.card);
                event.suit = get.suit(result.card);
                if (event.color == 'red') {
                  if (trigger.source.num('he')) {
                    player.choosePlayerCard('是否对' + get.translation(trigger.source) + '发动【反馈】？', trigger.source, ai.get.buttonValue, 'he');
                    event.goto(2);
                  }
                  else {
                    event.finish();
                  }
                } else if (event.suit == 'club') {
                  player.logSkill('jlsgsy_fangzhu', trigger.source);
                  trigger.source.draw(player.getDamagedHp());
                  trigger.source.turnOver();
                } else if (event.suit == 'spade') {
                  player.logSkill('jlsgsy_ganglie', trigger.source);
                  trigger.source.chooseToDiscard(2).set('ai', function (card) {
                    if (card.name == 'tao') return -10;
                    if (card.name == 'jiu' && _status.event.player.hp == 1) return -10;
                    return get.unuseful(card) + 2.5 * (5 - get.owner(card).hp);
                  });
                  event.goto(3);
                }
                "step 2"
                if (result.bool) {
                  player.logSkill('jlsgsy_fankui', trigger.source);
                  player.gain(result.buttons[0].link, trigger.source);
                  trigger.source.$give(1, player);
                }
                event.finish();
                "step 3"
                if (result.bool == false) {
                  trigger.source.damage();
                }
              },
              ai: {
                maixie: true,
                effect: {
                  target: function (card, player, target) {
                    if (get.tag(card, 'damage')) {
                      if (player.skills.contains('jueqing')) return [1, -2];
                      if (!target.hasFriend()) return;
                      if (target.hp >= 4) return [1, get.tag(card, 'damage') * 2, 1, -get.tag(card, 'damage') * 2];
                      if (target.hp == 3) return [1, get.tag(card, 'damage') * 1.5, 1, -get.tag(card, 'damage') * 1.5];
                      if (target.hp == 2) return [1, get.tag(card, 'damage') * 0.5, 1, -get.tag(card, 'damage') * 0.5];
                    }
                  }
                }
              },
            },
            jlsgsy_zongyu: {
              audio: "ext:极略:1", // audio: ['zhongyu'],
              enable: 'phaseUse',
              filter: function (event, player) {
                return player.hp > 0 && (lib.filter.cardEnabled({ name: 'jiu' }, player, event) &&
                  lib.filter.cardUsable({ name: 'jiu' }, player, event));
              },
              content: function () {
                player.loseHp();
                player.useCard({ name: 'jiu' }, player);
              },
              ai: {
                order: 8,
                result: {
                  player: function (player) {
                    if (player.hp == 5) return 0;
                    if (player.getStat().card.sha > 0) return 0;
                    if (player.num('h', 'jiu')) return 0;
                    if (!player.num('h', 'sha')) return 0;
                    if (player.hasSkill('jiu')) return 0;
                    var att = 0;
                    for (var i = 0; i < game.players.length; i++) {
                      if (game.players[i] != player) {
                        att += ai.get.effect(game.players[i], { name: 'sha' }, player, player);
                      }
                    }
                    if (player.hp == player.maxHp && att > 0) return 1;
                    if (player.num('h', 'tao') && att > 0) return 1;
                    return player.hp - 2 && att > 0;
                  }
                }
              },
            },
            jlsgsy_lingnue: {
              audio: "ext:极略:1", // audio: ['linnue'],
              trigger: { source: 'damageEnd' },
              unique: true,
              filter: function (event) {
                return event.card && event.card.name == 'sha' &&
                  _status.currentPhase == event.source && event.parent.parent.parent.parent.name == 'phaseUse';
              },
              check: function (event, player) {
                return ai.get.attitude(player, event.player) < 0;
              },
              content: function () {
                'step 0'
                player.judge(function (card) {
                  if (get.color(card) == 'black') return 1;
                  return 0;
                }).judge2 = result => result.bool;
                "step 1"
                if (result.bool) {
                  player.gain(result.card);
                  player.$gain2(result.card);
                  if (player.getStat().card.sha >= 1) {
                    player.getStat().card.sha--;
                  }
                }
              },
              ai: {
                expose: 0.2,
              }
            },
            jlsgsy_baozheng: {
              audio: "ext:极略:1", // audio: ['baozheng'],
              direct: true,
              unique: true,
              trigger: { global: 'phaseDrawAfter' },
              filter: function (event, player) {
                return event.player.num('h') > player.num('h');
              },
              content: function () {
                "step 0"
                trigger.player.chooseCard('交出一张方块牌或受到1点伤害', function (card) {
                  return get.suit(card) == 'diamond';
                }).ai = function (card, player) {
                  player = trigger.player;
                  if (player.hp == player.maxHp) {
                    return 6 - ai.get.value(card);
                  }
                  else if (player.hp == 1 && (!player.num('h', 'tao') || !player.num('h', 'jiu'))) {
                    return 10 - ai.get.value(card);
                  }
                  return 7 - ai.get.value(card);
                };
                "step 1"
                player.logSkill('jlsgsy_baozheng', trigger.player);
                if (result.bool) {
                  player.gain(result.cards[0], trigger.player);
                  trigger.player.$give(1, player);
                }
                else {
                  trigger.player.damage(player);
                }
              },
              ai: {
                threaten: 1.3
              }
            },
            jlsgsy_nishi: {
              audio: "ext:极略:1", // audio: ['nishi'],
              forced: true,
              unique: true,
              trigger: { player: 'phaseDrawBegin' },
              content: function () {
                trigger.num = Math.min(4, player.hp);
              },
              ai: {
                threaten: function (player, target) {
                  if (target.hp == target.maxHp) return 2;
                }
              }
            },
            jlsgsy_hengxing: {
              audio: "ext:极略:1", // audio: ['hengxing'],
              trigger: { global: 'useCardToBegin' },
              filter: function (event, player) {
                if (event.player == player) return false;
                return event.target == player && event.card && event.card.name == 'sha' && player.num('he') >= player.hp;
              },
              unique: true,
              check: function (card, player) {
                if (player.hp > 2) return 0;
                if (player.num('h', 'shan')) return 0;
                if (player.hp > 1) return player.num('he') - 2;
                if (player.hp == 1) return 1;
                return 0;
              },
              content: function () {
                var num = player.hp;
                player.chooseToDiscard(num, 'he', true).set('ai', function (card) {
                  return -ai.get.value(card);
                });
                trigger.untrigger();
                trigger.finish();
              }
            },
            jlsgsy_baonudongzhuo: {
              inherit: 'jlsgsy_baonu',
              animationStr: '统统杀光',
              mode: ['identity', 'guozhan', 'boss', 'stone'],
            },
            jlsgsy_baonu2: {
              trigger: { global: 'gameDrawBegin' },
              forced: true,
              popup: false,
              priority: 100,
              content: function () {
                if (game.bossinfo) {
                  game.bossinfo.loopType = 2;
                }
                player.draw(4, false);
              }
            },
            jlsgsy_bujiao: {
              audio: "ext:极略:1", // audio: ['bujiao'],
              forced: true,
              unique: true,
              trigger: { global: 'phaseUseBegin' },
              filter: function (event, player) {
                return event.player != player && event.player.countCards('h') != 0;
              },
              content: function () {
                'step 0'
                trigger.player.chooseCard('h', true, '布教：将一张手牌交给' + get.translation(player));
                'step 1'
                if (result.bool) {
                  trigger.player.give(result.cards, player);
                  trigger.player.draw();
                }
              }
            },
            jlsgsy_taiping: {
              audio: "ext:极略:1", // audio: ['taiping'],
              trigger: { player: 'damageEnd' },
              filter: function (event, player) {
                return event.num > 0;
              },
              direct: true,
              unique: true,
              content: function () {
                "step 0"
                event.num = trigger.num;
                "step 1"
                player.chooseTarget('选择一名目标令其获得1枚平印记', function (card, player, target) {
                  return player != target
                }).ai = function (target) {
                  return -ai.get.attitude(player, target);
                };
                "step 2"
                if (result.bool) {
                  player.logSkill('jlsgsy_taiping', result.targets, 'white');
                  event.num--;
                  if (!result.targets[0].skills.contains('jlsgsy_taiping4')) {
                    result.targets[0].addSkill('jlsgsy_taiping4');
                  }
                  result.targets[0].storage['jlsgsy_taiping']++;
                  result.targets[0].storage['jlsgsy_taiping4'] = result.targets[0].storage['jlsgsy_taiping'];
                  result.targets[0].syncStorage('jlsgsy_taiping4');
                  result.targets[0].markSkill('jlsgsy_taiping4');
                  if (event.num) {
                    event.goto(1);
                  }
                  else {
                    event.finish();
                  }
                }
                else {
                  event.finish();
                }
              }
            },
            _taiping: {
              mod: {
                maxHandcard: function (player, num) {
                  if (player.storage['jlsgsy_taiping'] && player.storage['jlsgsy_taiping'] > 0) return num - player.storage['jlsgsy_taiping'];
                }
              }
            },
            jlsgsy_taiping4: {
              forced: true,
              popup: false,
              init: function (player) {
                player.storage['jlsgsy_taiping'] = 0;
              },
              intro: {
                content: 'mark'
              },
              marktext: '平',
              mark: true,
              trigger: { player: 'phaseAfter' },
              filter: function (event, player) {
                return player.storage['jlsgsy_taiping'] > 0;
              },
              content: function () {
                player.storage['jlsgsy_taiping'] = 0;
                player.unmarkSkill('jlsgsy_taiping4');
                player.removeSkill('jlsgsy_taiping4');
              }
            },

            jlsgsy_baonucaifuren: {
              inherit: 'jlsgsy_baonu',
              animationStr: '别想逃出我的手掌心!',
              mode: ['identity', 'guozhan', 'boss', 'stone'],
            },
            jlsgsy_yaohuo: {
              audio: "ext:极略:1", // audio: ['yaohuo'],
              enable: 'phaseUse',
              usable: 1,
              direct: true,
              filterTarget: function (card, player, target) {
                return player != target && target.num('h') > 0 && player.num('h') >= target.num('h');
              },
              unique: true,
              content: function () {
                'step 0'
                player.line(target, 'green');
                var num = target.num('h');
                player.chooseToDiscard(num, 'he', true);
                player.chooseControl('获得手牌', '获得技能',
                  ui.create.dialog('请选择一项', 'hidden')).ai = function () {
                    if (player.num('h') <= 1) return '获得手牌';
                    if (target.num('h') < 3) return '获得技能';
                    if (target.num('h') >= 3) return '获得手牌';
                  };
                'step 1'
                player.logSkill('jlsgsy_yaohuo', target);
                if (result.control == '获得手牌') {
                  player.gain(target.get('h'), target);
                  target.$give(target.get('h'), player);
                }
                'step 2'
                if (result.control == '获得技能') {
                  if (target.name && !target.classList.contains('unseen')) {
                    var skills = lib.character[target.name][3];
                  }
                  if (target.name1 && !target.classList.contains('unseen')) {
                    var skills2 = lib.character[target.name1][3];
                  }
                  if (target.name2 && !target.classList.contains('unseen2')) {
                    var skills3 = lib.character[target.name2][3];
                  }
                  if (skills) {
                    for (var j = 0; j < skills.length; j++) {
                      target.removeSkill(skills[j]);
                      var info = lib.skill[skills[j]];
                      if (!lib.translate[skills[j] + '_info']) continue;
                      if (info && info.unique) continue;
                      player.addTempSkill(skills[j], 'phaseAfter');
                    }
                  }
                  if (skills2) {
                    for (var j = 0; j < skills2.length; j++) {
                      target.removeSkill(skills2[j]);
                      var info = lib.skill[skills2[j]];
                      if (!lib.translate[skills2[j] + '_info']) continue;
                      if (info && info.unique) continue;
                      player.addTempSkill(skills2[j], 'phaseAfter');
                    }
                  }
                  if (skills3) {
                    for (var j = 0; j < skills3.length; j++) {
                      target.removeSkill(skills3[j]);
                      var info = lib.skill[skills3[j]];
                      if (!lib.translate[skills3[j] + '_info']) continue;
                      if (info && info.unique) continue;
                      player.addTempSkill(skills3[j], 'phaseAfter');
                    }
                  }
                  target.storage.yaohuo = true;
                }
              },
              group: ['jlsgsy_yaohuo2'],
              ai: {
                order: 9.5,
                result: {
                  target: function (player, target) {
                    if (target.num('h') < 3) return 0;
                    return jlsg.relu(get.attitude(player, target));
                  }
                },
                expose: 0.2
              },
            },
            jlsgsy_yaohuo2: {
              trigger: { global: 'phaseAfter' },
              forced: true,
              popup: false,
              filter: function (event, player) {
                var targets = [];
                var players = game.players.concat(game.dead);
                for (var j = 0; j < players.length; j++) {
                  if (!players[j].storage.yaohuo) continue;
                  targets.push(players[j]);
                }
                if (targets.length) return true;
                return false;
              },
              content: function () {
                var players = game.players.concat(game.dead);
                for (var i = 0; i < players.length; i++) {
                  if (players[i] == player) continue;
                  if (players[i].classList.contains('unseen')) continue;
                  if (players[i].classList.contains('unseen2')) continue;
                  if (!players[i].storage.yaohuo) continue;
                  if (players[i].name && !players[i].classList.contains('unseen')) {
                    var skills = lib.character[players[i].name][3];
                  }
                  if (players[i].name1 && !players[i].classList.contains('unseen')) {
                    var skills2 = lib.character[players[i].name1][3];
                  }
                  if (players[i].name2 && !players[i].classList.contains('unseen2')) {
                    var skills3 = lib.character[players[i].name2][3];
                  }
                  if (skills) {
                    for (var j = 0; j < skills.length; j++) {
                      players[i].addSkill(skills[j]);
                    }
                  }
                  if (skills2) {
                    for (var j = 0; j < skills2.length; j++) {
                      players[i].addSkill(skills2[j]);
                    }
                  }
                  if (skills3) {
                    for (var j = 0; j < skills3.length; j++) {
                      players[i].addSkill(skills3[j]);
                    }
                  }
                }
                for (var j = 0; j < players.length; j++) {
                  if (!players[j].storage.yaohuo) continue;
                  players[j].storage.yaohuo = false;
                }
              }
            },
            jlsgsy_sanzhi: {
              audio: "ext:极略:1", // audio: ['sanzhi'],
              enable: 'phaseUse',
              usable: 1,
              unique: true,
              complexCard: true,
              filterCard: function (card) {
                var type = get.type(card);
                for (var i = 0; i < ui.selected.cards.length; i++) {
                  if (get.type(ui.selected.cards[i]) == type) return false;
                }
                return true;
              },
              selectCard: [1, 3],
              position: 'he',
              selectTarget: function (card) {
                if (ui.selected.targets.length > ui.selected.cards.length) {
                  game.uncheck('target');
                }
                return ui.selected.cards.length;
              },
              filterTarget: function (card, player, target) {
                return player != target;
              },
              check: function (card) {
                return 5 - ai.get.value(card);
              },
              multiline: true,
              line: 'green',
              content: function () {
                target.damage();
              },
              ai: {
                order: 7.5,
                result: {
                  target: function (player, target) {
                    return ai.get.damageEffect(target, player);
                  }
                },
                expose: 0.2
              },
            },
            jlsgsy_baonuzhangjiao: {
              inherit: 'jlsgsy_baonu',
              animationStr: '招神劾鬼, 统摄天地!',
              mode: ['identity', 'guozhan', 'boss', 'stone'],
            },
            jlsgsy_dihui: {
              audio: "ext:极略:2", // audio: ['dihui', 2],
              enable: 'phaseUse',
              usable: 1,
              unique: true,
              complexCard: true,
              filter: function (event, player) {
                return game.players.length >= 3;
              },
              filterTarget: function (card, player, target) {
                if (player == target) return false;
                if (ui.selected.targets.length == 0) {
                  for (var i = 0; i < game.players.length; i++) {
                    if (game.players[i] == player) continue;
                    if (game.players[i].hp > target.hp) return false;
                  }
                  return true;
                }
                if (ui.selected.targets.length == 1) {
                  return target != ui.selected.targets[0];
                }
              },
              multitarget: true,
              targetprompt: ['造成伤害', '受到伤害'],
              selectTarget: 2,
              prompt: '请选择两个目标（先选择体力最大的目标）',
              content: function () {
                "step 0"
                targets[0].line(targets[1], 'green');
                targets[1].damage(targets[0]);
                event.target = targets[1];
                "step 1"
                player.chooseControl('选项一', '选项二', '不发动', function () {
                  if (player.num('h') < 3) return '选项一';
                  if (!event.target.num('h')) return '选项一';
                  if (event.target.num('h') && event.target.isAlive()) return '选项二';
                  return '选项一';
                }).set('prompt', '诋毁<br><br><div class="text">选项一: 自己摸一张牌</div><br><div class="text">选项二：弃置受到伤害角色的一张牌</div></br>');
                "step 2"
                if (result.control == '选项一') {
                  player.draw();
                }
                else if (result.control == '选项二') {
                  if (event.target.isAlive()) player.discardPlayerCard(event.target, 'he', true);
                }
                else {
                  event.finish();
                }
              },
              ai: {
                order: 9.5,
                result: {
                  target: function (player, target) {
                    var att = ai.get.attitude(player, target);
                    if (att < 0) return att;
                  }
                },
                expose: 0.2
              },
            },
            jlsgsy_luansi: {
              audio: "ext:极略:2", // audio: ['luansi', 2],
              enable: 'phaseUse',
              usable: 1,
              unique: true,
              filterTarget: function (card, player, target) {
                if (player == target || !target.countCards('h')) return false;
                if (ui.selected.targets.length) {
                  return !target.hasSkillTag('noCompareTarget');
                } else {
                  return !target.hasSkillTag('noCompareSource');
                }
              },
              filter: function (event, player) {
                return game.countPlayer(p => p != player && p.countCards('h')) >= 2;
              },
              multitarget: true,
              targetprompt: ['发起拼点', '被拼点'],
              selectTarget: 2,
              prompt: '选择两名拼点目标',
              content: function () {
                "step 0"
                targets[0].line(targets[1], 'green');
                targets[0].chooseToCompare(targets[1]);
                "step 1"
                if (result.bool) {
                  targets[0].useCard({ name: 'juedou' }, targets[1]);
                  if (targets[1].isAlive()) player.discardPlayerCard(targets[1], 'he', 2, true);
                }
                else {
                  targets[1].useCard({ name: 'juedou' }, targets[0]);
                  if (targets[0].isAlive()) player.discardPlayerCard(targets[0], 'he', 2, true);
                }
              },
              ai: {
                order: 8,
                result: {
                  target: function (player, target) {
                    if (game.players.length <= 2) return 0;
                    if (target.num('he') < 1) return 0;
                    var att = ai.get.attitude(player, target);
                    if (att < 0) return -target.num('he');
                  }
                },
              },
            },
            jlsgsy_huoxin: {
              audio: "ext:极略:1", // audio: ['huoxin'],
              trigger: { source: 'damageSource', player: 'damageEnd' },
              unique: true,
              filter: function (event, player, name) {
                if (name == 'damageSource') {
                  return event.player && event.player != player && event.player.isAlive();
                } else {
                  return event.source && event.source != player;
                }
              },
              check: function (event, player) {
                var target = (event.player == player) ? event.source : event.player;
                var att = get.attitude(player, target);
                return att < 0 || (att < 1 && target.countGainableCards(player, 'e'));
              },
              logTarget: function (event, player) {
                if (event.player == player) return event.source;
                return event.player;
              },
              content: function () {
                "step 0"
                event.target = (trigger.player == player) ? trigger.source : trigger.player;
                if (!event.target.countCards('e')) {
                  event.target.loseHp();
                  event.finish();
                  return;
                }
                event.target.chooseCard(`交给${get.translation(player)}一张装备区内的牌或者失去一点体力`, 'e', function (card) {
                  return get.type(card) == 'equip';
                }).ai = function (card, cards2) {
                  if (event.target.hp == event.target.maxHp) {
                    return 6 - get.value(card);
                  }
                  else if (event.target.hp == 1) {
                    return 12 - get.value(card);
                  }
                  else {
                    return 7 - get.value(card);
                  }
                };
                "step 1"
                if (result.bool) {
                  player.gain(result.cards[0], event.target);
                  event.target.$give(result.cards[0], player);
                }
                else {
                  event.target.loseHp();
                }
              },
              ai: {
                maixie_defend: true,
              },
            },
            jlsgsy_shiao: {
              audio: "ext:极略:true", // audio: ['shiao'],
              trigger: { player: 'phaseZhunbeiBegin' },
              direct: true,
              unique: true,
              filter: function (event, player) {
                return game.hasPlayer(function (current) {
                  return current.countCards('h') < player.countCards('h');
                });
              },
              content: function () {
                player.chooseUseTarget(game.filterPlayer(function (current) {
                  return current.countCards('h') < player.countCards('h');
                }), '###是否发动【恃傲】？###视为对一名手牌小于你的角色使用一张【杀】', { name: 'sha' }, false, 'nodistance').logSkill = 'jlsgsy_shiao';
              },
              group: ['jlsgsy_shiao2']
            },
            jlsgsy_shiao2: {
              audio: "ext:极略:true", // audio: ['shiao2'],
              trigger: { player: 'phaseJieshuBegin' },
              direct: true,
              unique: true,
              filter: function (event, player) {
                return game.hasPlayer(function (current) {
                  return current.countCards('h') > player.countCards('h');
                });
              },
              content: function () {
                player.chooseUseTarget(game.filterPlayer(function (current) {
                  return current.countCards('h') > player.countCards('h');
                }), '###是否发动【恃傲】？###视为对一名手牌大于你的角色使用一张【杀】', { name: 'sha' }, false, 'nodistance').logSkill = 'jlsgsy_shiao2';
              }
            },
            jlsgsy_kuangxi: {
              audio: "ext:极略:2", // audio: ['kuangxi', 2],
              trigger: { player: 'useCard' },
              filter: function (event, player) {
                if (_status.currentPhase != player) return false;
                if (!event.targets || !event.card) return false;
                if (event.card.name == 'wuxie') return false;
                if (event.targets.length <= 1 && event.targets.contains(player)) return false;
                var type = get.type(event.card);
                if (type != 'trick') return false;
                return true;
              },
              check: function (event, player) {
                var att = 0;
                for (var i = 0; i < event.targets.length; i++) {
                  if (event.targets[i] != player) {
                    att += ai.get.effect(event.targets[i], { name: 'sha' }, player, player);
                  }
                }
                return att > 1;
              },
              unique: true,
              content: function () {
                "step 0"
                trigger.untrigger();
                trigger.finish();
                "step 1"
                var list = [];
                for (var i = 0; i < trigger.targets.length; i++) {
                  if (trigger.targets[i] != player) {
                    list.push(trigger.targets[i]);
                  }
                }
                player.useCard({ name: 'sha' }, list, false);
              },
              ai: {
                effect: {
                  player: function (card, player, target) {
                    if (get.type(card) == 'trick') return [1, 3];
                  },
                },
              },
            },
            jlsgsy_baonuweiyan: {
              inherit: 'jlsgsy_baonu',
              animationStr: '老子岂能受你们摆布!',
              mode: ['identity', 'guozhan', 'boss', 'stone'],
            },
            jlsgsy_fangu: {
              audio: "ext:极略:1", // audio: ['fangu'],
              trigger: { player: 'damageEnd' },
              forced: true,
              unique: true,
              priority: 100,
              content: function () {
                "step 0"
                player.phase();
                "step 1"
                while (_status.event.name != 'phase') {
                  _status.event = _status.event.parent;
                }
                _status.event.finish();
                _status.event.untrigger(true);
              }
            },
            jlsgsy_canlue: {
              audio: "ext:极略:1", // audio: ['jlsgsy_canlue'],
              trigger: { source: 'gainEnd' },
              forced: true,
              filter: function (event, player) {
                return event.player && event.player != player && event.player.isIn();
              },
              logTarget: 'player',
              content: function () {
                trigger.player.chooseToDiscard('he', trigger.cards.length, true);
              },
              group: ['jlsgsy_canlue2'],
            },
            jlsgsy_canlue2: {
              audio: "jlsgsy_canlue",
              trigger: { player: 'gainEnd' },
              filter: function (event, player) {
                return event.source && event.source != player && event.source.isIn();
              },
              check: function (event, player) {
                return get.damageEffect(event.source, player, player) > 0;
              },
              prompt2: function (event, player) {
                // debugger;
                return `对其造成${event.cards.length}点伤害`;
              },
              logTarget: 'source',
              content: function () {
                trigger.source.damage(trigger.cards.length, player);
              },
            },
            jlsgsy_chanxian: {
              audio: "ext:极略:2", // audio: ['jlsgsy_chanxian', 2],
              enable: 'phaseUse',
              usable: 1,
              unique: true,
              filterCard: true,
              discard: false,
              prepare: 'give',
              position: 'h',
              filter: function (event, player) {
                return player.countCards('h') > 0;
              },
              filterTarget: lib.filter.notMe,
              check: function (card) {
                return 6 - ai.get.value(card);
              },
              content: function () {
                "step 0"
                player.showCards(cards[0]);
                target.gain(cards[0], player);
                "step 1"
                event.player = player;
                var damageEffect = Math.max(...game.filterPlayer(c => c != player).map(c => get.damageEffect(c, target, target)));
                target.chooseCard('交给' + get.translation(player) + '一张大于' + get.number(cards[0]) + '的牌然后弃置一张牌或者对' + get.translation(player) + '以外的一名角色造成1点伤害', function (card) {
                  return get.number(card) > get.number(cards[0]);
                }).ai = function (card, player) {
                  // return 7 - ai.get.value(card);
                  return -damageEffect - get.value(card);
                };
                "step 2"
                if (result.bool) {
                  target.give(result.cards, player);
                  // player.gain(result.cards[0], target);
                  // target.$give(1, player);
                  target.chooseToDiscard('he', true);
                  event.finish();
                }
                else {
                  event.target = target;
                  if (game.players.length <= 2) {
                    target.damage(target);
                    event.finish();
                  }
                  target.chooseTarget('请选择一名目标', function (card, player, target) {
                    return event.player != target;
                  }, true).ai = function (target) {
                    return get.damageEffect(target, event.target);
                  };
                }
                "step 3"
                if (result.bool && result.targets && result.targets.length) {
                  event.target.line(result.targets[0], 'green');
                  result.targets[0].damage(event.target);
                }
              },
              ai: {
                order: 6,
                result: {
                  target: function (player, target) {
                    return ai.get.attitude(player, target);
                  },
                  player: -1,
                },
              },
            },
            jlsgsy_luanzheng: {
              audio: "ext:极略:2", // audio: ['jlsgsy_luanzheng', 2],
              trigger: { target: 'useCardToBegin' },
              filter: function (event, player) {
                if (game.players.length < 3) return false;
                if (event.card.name == 'juedou' || event.card.name == 'sha' || event.card.name == 'shunshou' || event.card.name == 'guohe') return event.player != player;
                return false;
              },
              forced: true,
              unique: true,
              content: function () {
                "step 0"
                event.player = player;
                trigger.player.chooseTarget('乱政：请选择一名额外目标否则' + get.translation(trigger.card) + '无效', function (card, player, target) {
                  return player != target && event.player != target;
                }).ai = function (target) {
                  if (trigger.card.name == 'sha') {
                    if (target.num('e', '2') && target.get('e') != 'baiyin') return 0;
                    if (target.hp <= 1) return Math.random < 0.3;
                    return 0.5;
                  }
                  if (trigger.card.name == 'juedou') {
                    if (target.hp <= 1) return Math.random < 0.3;
                    return 0.5;
                  }
                  if (trigger.card.name == 'guohe' || trigger.card.name == 'shunshou') {
                    if (target.num('h') == 0) return Math.random < 0.3;
                    return 1;
                  }
                };
                "step 1"
                if (result.bool) {
                  for (var i = 0; i < result.targets.length; i++) {
                    trigger.targets.push(result.targets[i]);
                    game.log(result.targets[i], '成为了额外目标');
                    trigger.player.line(trigger.targets);
                  }
                }
                else {
                  trigger.untrigger();
                  trigger.finish();
                }
              },
              ai: {
                effect: {
                  target: function (card, player, target, current) {
                    if (game.players.length < 3) return;
                    if (card.name == 'juedou' || card.name == 'guohe' || card.name == 'shunshou' || card.name == 'sha') return 0.5;
                  },
                },
              },
            },
            jlsgsy_baonuzhangrang: {
              inherit: 'jlsgsy_baonu',
              animationStr: '明帝, 都得叫我一声爹呢!',
              mode: ['identity', 'guozhan', 'boss', 'stone'],
            },
          },
          translate: {
            jlsg_sy: 'SK三英',
            jlsgsy_lvbu: '善战无前',
            jlsgsy_lvbubaonu: '善战无前',
            jlsgsy_dongzhuo: '狱魔祸世',
            jlsgsy_dongzhuobaonu: '狱魔祸世',
            jlsgsy_zhangrang: '祸乱之源',
            jlsgsy_zhangrangbaonu: '祸乱之源',
            jlsgsy_zhangjiao: '大贤良师',
            jlsgsy_zhangjiaobaonu: '大贤良师',
            jlsgsy_caifuren: '蛇蝎美人',
            jlsgsy_caifurenbaonu: '蛇蝎美人',
            jlsgsy_weiyan: '嗜血狂狼',
            jlsgsy_weiyanbaonu: '嗜血狂狼',
            jlsgsy_simayi: '三分归晋',
            jlsgsy_simayibaonu: '三分归晋',
            jlsgsy_sunhao: '末世暴君',
            jlsgsy_sunhaobaonu: '末世暴君',

            jlsgsy_xiuluo: '修罗',
            jlsgsy_shenwei: '神威',
            jlsgsy_shenji: '神戟',
            jlsgsy_zongyu: '纵欲',
            jlsgsy_lingnue: '凌虐',
            jlsgsy_luanzheng: '乱政',
            jlsgsy_chanxian: '馋陷',
            jlsgsy_baozheng: '暴政',
            jlsgsy_nishi: '逆施',
            jlsgsy_hengxing: '横行',
            jlsgsy_baonudongzhuo: '暴怒',
            jlsgsy_bujiao: '布教',
            jlsgsy_taiping: '太平',
            jlsgsy_sanzhi: '三治',
            jlsgsy_yaohuo: '妖惑',
            jlsgsy_baonuzhangjiao: '暴怒',
            jlsgsy_dihui: '诋毁',
            jlsgsy_luansi: '乱嗣',
            jlsgsy_huoxin: '祸心',
            jlsgsy_canlue: '残掠',
            jlsgsy_canlue2: '残掠',
            jlsgsy_baonucaifuren: '暴怒',
            jlsgsy_shiao: '恃傲',
            jlsgsy_shiao2: '恃傲',
            jlsgsy_kuangxi: '狂袭',
            jlsgsy_baonuweiyan: '暴怒',
            jlsgsy_baonuzhangrang: '暴怒',
            jlsgsy_fangu: '反骨',
            jlsgsy_bolue: '博略',
            jlsgsy_qiangxi: '强袭',
            jlsgsy_qicai: '奇才',
            jlsgsy_luanji: '乱击',
            jlsgsy_quanheng: '权衡',


            // jlsgsy_xiuluo_info:'回合开始阶段，你可以弃一张手牌来弃置你判定区中的一张相同花色的延时锦囊牌。',
            // jlsgsy_shenwei_info:'锁定技，摸牌阶段，你额外摸两张牌，你的手牌上限+2。',
            // jlsgsy_shenji_info:'若你未装备武器且武器栏未被废除，你的杀可以额外指定至多两名目标。',
            jlsgsy_luanzheng_info: '锁定技，若场上存活的角色不小于三，则其他角色使用的【杀】、【顺手牵羊】、【过河拆桥】、【决斗】指定你为目标时，须额外指定一名角色（不得是此牌的使用者）为目标，否则对你无效',
            jlsgsy_chanxian_info: '出牌阶段限一次，你可以展示一张手牌并将之交给一名其他角色，该名角色选择一项：交给你一张点数大于此牌的手牌。然后弃置一张牌；或对除你以外的一名角色造成1点伤害',
            jlsgsy_canlue_info: '你从其他角色处获得牌时，可对其造成等量的伤害；锁定技，其他角色获得你的牌时，须弃置等量的牌',
            jlsgsy_zongyu_info: '出牌阶段，你可以主动失去1点体力，视为使用一张【酒】',
            jlsgsy_lingnue_info: '出牌阶段，你每使用【杀】对目标角色造成一次伤害，可以进行一次判定， 若结果为黑色则获得该判定牌且该【杀】不计入每回合使用限制',
            jlsgsy_baozheng_info: '锁定技，其他角色摸牌阶段结束时，若该角色手牌数大于你，须选择一项：交给你一张方块牌；或受到你造成的1点伤害。',
            jlsgsy_nishi_info: '锁定技，摸牌阶段，你摸X张牌(X为你的当前体力值且至多为4)',
            jlsgsy_hengxing_info: '当其他角色使用【杀】指定你为目标时，你可以弃置x张牌(x为你当前体力值)，则该【杀】对你无效',
            jlsgsy_baonudongzhuo_info: '锁定技，当你体力降至4或者更少时，你变身为暴怒董卓并立即开始你的回合',
            jlsgsy_baonuzhangrang_info: '锁定技，当你体力降至4或者更少时，你变身为暴怒张让并立即开始你的回合',
            jlsgsy_bujiao_info: '锁定技，其他角色出牌阶段开始时，该角色须交给你一张手牌，然后摸一张牌',
            jlsgsy_taiping_info: '每当你受到1点伤害后，你可以令一名其他角色获得1枚‘平’标记，其他角色每有1枚‘平’标记，手牌上限便-1，一名角色回合结束后，弃置其拥有的所有‘平’标记',
            jlsgsy_sanzhi_info: '出牌阶段限一次，你可以弃置任意类型不同的牌各一张并对等量的其他角色各造成1点伤害',
            jlsgsy_yaohuo_info: '出牌阶段限一次，你可以指定一名有手牌的其他角色弃置与其手牌等量的牌，然后选择1项：1、获得其所有手牌；2、令其失去所有技能你获得之(你不能获得主公技，限定技，觉醒技)直到回合结束',
            jlsgsy_baonuzhangjiao_info: '锁定技，当你体力降至4或者更少时，你变身为暴怒张角并立即开始你的回合',
            jlsgsy_dihui_info: '出牌阶段限一次，你可令场上(除你外)体力值最多的(或之一)的一名角色对另一名角色造成1点伤害，然后你可以执行下列1项：摸一张牌或者弃置受到伤害角色的一张牌',
            jlsgsy_luansi_info: '出牌阶段限一次，你可以令两名有手牌的其他角色拼点，视为拼点赢的角色对没赢的角色使用一张【决斗】，然后你弃置拼点没赢的角色两张牌',
            jlsgsy_huoxin_info: '你对其他角色造成伤害，或受到其他角色造成的伤害后，你可令该角色交给你一张装备区内的装备牌 ，或者失去一点体力。',
            jlsgsy_baonucaifuren_info: '锁定技，当你体力降至4或者更少时，你变身为暴怒蔡夫人并立即开始你的回合',
            jlsgsy_shiao_info: '回合开始阶段开始时，你可以视为对手牌数少于你的一名其他角色使用一张【杀】；回合结束阶段开始时你可以视为对手牌数大于你的一名其他角色使用一张【杀】',
            jlsgsy_kuangxi_info: '出牌阶段，当你使用非延时锦囊牌指定其他角色为目标后，你可以终止此牌的结算，改为视为对这些目标依次使用一张【杀】(不计入出牌阶段的使用限制)',
            jlsgsy_baonuweiyan_info: '锁定技，当你体力降至4或者更少时，你变身为暴怒魏延并立即开始你的回合',
            jlsgsy_fangu_info: '锁定技，每当你受到一次伤害后，当前回合结束，你执行1个额外回合',

            jlsgsy_bolue_info: '出牌阶段限一次，你可以进行判定并获得判定牌，并根据结果获得以下技能直到本回合结束:红桃：奇才；方块：权衡；黑桃：强袭；梅花：乱击',
            jlsgsy_qiangxi_info: '出牌阶段限一次，你可以失去一点体力或弃置一张武器牌，然后对你攻击范围内的一名其他角色造成一点伤害。',
            jlsgsy_qicai_info: '每当你失去一次手牌时，你可以进行判定，若结果为红色，你摸一张牌。',
            jlsgsy_luanji_info: '出牌阶段，你可以将任意两张相同花色的手牌当做【万箭齐发】使用。',
            jlsgsy_quanheng_info: '出牌阶段限一次，你可以将至少一张手牌当【无中生有】或【杀】使用，若你以此法使用的牌被【无懈可击】或【闪】响应时，你摸等量的牌。',
            jlsgsy_baonusimayi: '暴怒',
            jlsgsy_baonusimayi_info: '锁定技，当你的体力值降至4或更低时，你进入暴怒状态并立即开始你的回合。',
            jlsgsy_biantian: '变天',
            jlsgsy_biantian_info: '锁定技，其他角色的判定阶段开始前，需先进行一次额外的闪电判定',
            jlsgsy_jinji: '忍忌',
            jlsgsy_jinji_info: '每当你受到伤害时，你可以进行判定并获得判定牌，并根据判定结果视为你对伤害来源发动以下技能:红桃或方片：反馈；黑桃：刚烈；梅花：放逐。',
            jlsgsy_tianyou: '天佑',
            jlsgsy_tianyou2: '天佑',
            jlsgsy_tianyou_info: '回合结束阶段开始时，你可以把牌堆顶的一张牌置于你的武将牌上，称为【佑】。直到你的下个回合开始时，将之置入弃牌堆。当你的武将牌上有牌时，你不能成为与【佑】颜色相同牌的目标',
            jlsgsy_mingzheng: '明政',
            jlsgsy_mingzheng_info: '锁定技，任意角色摸牌阶段摸牌时，额外摸一张牌，当你受到一次伤害后，失去该技能，并获得技能【嗜杀】',
            jlsgsy_shisha: '嗜杀',
            jlsgsy_shisha_info: '锁定技，你使用的【杀】不可被【闪】响应，其他角色可以弃置两张牌来抵消你对其使用的【杀】',
            jlsgsy_baonusunhao: '暴怒',
            jlsgsy_baonusunhao_info: '锁定技，当你的体力值降至4或更低时，你进入暴怒状态并立即开始你的回合。',
            jlsgsy_huangyin: '荒淫',
            jlsgsy_huangyin_info: '每当你从牌堆获得牌之前，可放弃之，改为从任意名其他角色出处获得共计等量的牌',
            jlsgsy_zuijiu: '醉酒',
            jlsgsy_zuijiu_info: '出牌阶段限一次，你可以展示所有手牌，若黑色牌不少于红色牌，则视为你使用了一张【酒】',
            jlsgsy_guiming: '归命',
            jlsgsy_guiming_info: '限定技，当你进入濒死状态时，你可以令场上体力最少的一名角色将体力补至体力上限，然后回复体力至4点',
            jlsgsy_huoxin2: '祸心',
            jlsgsy_taiping4: '太平',
          },
        };
        if (lib.device || lib.node) {
          for (var i in jlsg_sy.character) {
            jlsg_sy.character[i][4].push('ext:极略/' + i + '.jpg');
          }
        } else {
          for (var i in jlsg_sy.character) {
            jlsg_sy.character[i][4].push('db:extension-极略:' + i + '.jpg');
          }
        }
        return jlsg_sy;
      });
      var specialRelic = config.qsRelic;
      game.import('card', () => { // 七杀
        var jlsg_qs = {
          name: "jlsg_qs",
          // connect: true,
          card: {
            jlsgqs_kongmingdeng: {
              chongzhu: true,
              fullskin: true,
              type: 'equip',
              subtype: 'equip5',
              skills: ['jlsgqs_kongmingdeng'],
              // loseDelay: false,
              onLose: function () {
                player.recover();
              },
              ai: {
                basic: {
                  equipValue: 8
                }
              }
            },
            jlsgqs_muniu: {
              fullskin: true,
              type: 'equip',
              subtype: 'equip5',
              chongzhu: true,
              skills: ['jlsgqs_muniu'],
              onLose: function () {
                "step 0"
                player.chooseToDiscard('h', '木牛流马：请弃置一张基本牌，否则失去1点体力', function (card) {
                  return get.type(card) == 'basic';
                }).set('ai', function (card) {
                  if (card.name == 'tao') return -10;
                  if (card.name == 'jiu' && player.hp == 1) return -10;
                  if (player.hp == 1) return 15 - ai.get.value(card);
                  return 8 - ai.get.value(card);
                });
                "step 1"
                if (!result.bool) {
                  player.loseHp();
                }
              },
              ai: {
                basic: {
                  equipValue: function (card, player) {
                    if (player.num('h', { type: 'basic' }) < 1) return 5;
                    return 3;
                  }
                }
              }
            },
            jlsgqs_yuxi: {
              fullskin: true,
              type: 'equip',
              chongzhu: true,
              subtype: 'equip5',
              skills: ['jlsgqs_yuxi'],
              ai: {
                basic: {
                  equipValue: 9
                }
              }
            },
            jlsgqs_taipingyaoshu: {
              fullskin: true,
              type: 'equip',
              chongzhu: true,
              subtype: 'equip5',
              enable: function (card, player) {
                if (player == game.me) return true;
                if (player != game.me) {
                  if (player.hp <= 1) return player.num('h', { color: 'red' }) > 1;
                }
              },
              onEquip: specialRelic ? function () {
                "step 0"
                var cards = player.getCards('e', { subtype: ['equip3', 'equip4'] });
                if (cards.length == 2) {
                  player.chooseCard('e', '将进攻坐骑或防御坐骑置入弃牌堆', card => cards.contains(card), true);
                }
                "step 1"
                // 模拟替换
                player.lose(result.cards, false, 'visible').set('type', 'equip').set('getlx', false);
                "step 2"
                player.chooseToDiscard('h', function (card) {
                  return get.color(card) == 'red';
                }).set('ai', function (card) {
                  if (card.name == 'tao') return -10;
                  if (card.name == 'jiu' && player.hp == 1) return -10;
                  if (player.hp == 1) return 15 - ai.get.value(card);
                  return 8 - ai.get.value(card);
                }).set('prompt2', '太平要术：弃置一张红色手牌，否则失去1点体力');
                "step 3"
                if (!result.bool) {
                  player.loseHp();
                }
              } : function () {
                "step 0"
                player.chooseToDiscard('h', '太平要术：弃置一张红色手牌，否则失去1点体力', function (card) {
                  return get.color(card) == 'red';
                }).set('ai', function (card) {
                  if (card.name == 'tao') return -10;
                  if (card.name == 'jiu' && player.hp == 1) return -10;
                  if (player.hp == 1) return 15 - ai.get.value(card);
                  return 8 - ai.get.value(card);
                });
                "step 1"
                if (!result.bool) {
                  player.loseHp();
                }
              },
              skills: ['jlsgqs_taipingyaoshu'],
              ai: {
                basic: {
                  equipValue: function (card, player) {
                    if (player.countCards('h', { color: 'red' }) < 1) return 1;
                    return 6;
                  }
                }
              }
            },
            jlsgqs_dunjiatianshu: {
              fullskin: true,
              type: 'equip',
              subtype: 'equip5',
              chongzhu: true,
              skills: ['jlsgqs_dunjiatianshu'],
              ai: {
                equipValue: 7
              }
            },
            jlsgqs_qixingbaodao: {
              fullskin: true,
              type: 'equip',
              subtype: 'equip5',
              chongzhu: true,
              skills: ['jlsgqs_qixingbaodao'],
              ai: {
                equipValue: 4
              }
            },
            jlsgqs_xiujian: {
              fullskin: true,
              type: 'equip',
              subtype: 'equip5',
              skills: ['jlsgqs_xiujian'],
              chongzhu: true,
              loseDelay: false,
              onLose: function () {
                player.draw();
              },
              ai: {
                order: 9.5,
                basic: {
                  equipValue: function (card, player) {
                    if (player.num('h', 'jlsgqs_xiujian')) return 6;
                    return 1;
                  }
                }
              }
            },
            jlsgqs_jinnangdai: {
              fullskin: true,
              type: 'equip',
              subtype: 'equip5',
              skills: ['jlsgqs_jinnangdai'],
              chongzhu: true,
              loseDelay: false,
              onLose: function () {
                player.logSkill('jlsgqs_jinnangdai');
                player.draw();
              },
              ai: {
                equipValue: 6
              }
            },
            jlsgqs_qingmeizhujiu: {
              audio: true,
              fullskin: true,
              type: 'trick',
              enable: true,
              filterTarget: function (card, player, target) {
                return target.countCards('h') != 0 && player != target;
              },
              content: function () {
                "step 0"
                if (!target.countCards('h')) {
                  event.finish();
                  return;
                }
                target.chooseCard(true).ai = function (card) {
                  var evt = _status.event.getParent();
                  if (get.recoverEffect(evt.target, evt.player, evt.target) >
                    get.recoverEffect(evt.player, evt.player, evt.target)
                  )
                    return get.number(card);
                  else return -get.number(card);
                };
                "step 1"
                event.criteria = get.number(result.cards[0]);
                event.dialog = ui.create.dialog(get.translation(target) + '展示的手牌', result.cards);
                event.videoId = lib.status.videoId++;

                game.broadcast('createDialog', event.videoId, get.translation(target) + '展示的手牌', result.cards);
                game.addVideo('cardDialog', null, [get.translation(target) + '展示的手牌', get.cardsInfo(result.cards), event.videoId]);
                event.card2 = result.cards[0];
                game.log(target, '展示了', event.card2);
                var rand = Math.random() < 0.5;
                player.chooseToDiscard().ai = function (card) {
                  var evt = _status.event.getParent(), value = -get.value(card);
                  value += (evt.criteria >= get.number(card)) ? get.recoverEffect(evt.target, evt.player, evt.player)
                    : get.recoverEffect(evt.player, evt.player, evt.player);
                  return value;
                };
                game.delayx(2);
                "step 2"
                if (result.bool) {
                  // player.showCards(result.cards[0]);
                  // player.discard(result.cards);
                  var number = get.number(result.cards[0]);
                  if (number <= event.criteria) {
                    target.recover();
                  } else {
                    player.recover();
                  }
                }
                event.dialog.close();
                game.addVideo('cardDialog', null, event.videoId);
                game.broadcast('closeDialog', event.videoId);
              },
              ai: {
                basic: {
                  order: 4,
                  useful: [2, 1],
                  value: 1,
                },
                wuxie: function (target, card, player, current, state) {
                  if (ai.get.attitude(current, player) >= 0 && state > 0) return false;
                },
                result: {
                  target: function (player, target) {
                    if (target.hp == target.maxHp) return 0;
                    if (player.hp == player.maxHp) return 0;
                    if (target.hp == 1) return 2;
                    var hs = player.num('h');
                    var bool = false;
                    for (var i = 0; i < hs.length; i++) {
                      if (hs[i].number >= 9 && ai.get.value(hs[i]) < 7) {
                        bool = true;
                        break;
                      }
                    }
                    if (!bool) return ai.get.recoverEffect(target);
                    return 0;
                  },
                },
                tag: {
                  recover: 1,
                },
              },
            },
            jlsgqs_shuiyanqijun: {
              audio: true,
              fullskin: true,
              type: 'delay',
              range: { attack: 1 },
              filterTarget: function (card, player, target) {
                return (lib.filter.judge(card, player, target) && player != target);
              },
              judge: function (card) {
                if (get.suit(card) == 'diamond') return 0;
                return -3;
              },
              effect: function () {
                if (result.bool == false) {
                  player.addTempSkill('jlsgqs_shuiyanqijun_skill');
                }
              },
              ai: {
                basic: {
                  order: 1,
                  useful: 1,
                  value: 7.5,
                },
                result: {
                  target: function (player, target) {
                    var att = ai.get.attitude(player, target);
                    if (att < 0) return -target.num('h');
                    return 0;
                  }
                },
                tag: {
                  discard: 1,
                  loseCard: 1,
                  position: 'h',
                },
              },
            },
            jlsgqs_yuqingguzong: {
              audio: true,
              fullskin: true,
              type: 'trick',
              enable: true,
              range: { attack: 1 },
              selectTarget: 1,
              filterTarget: function (card, player, target) {
                return target != player;
              },
              modTarget: true,
              content: function () {
                "step 0"
                target.draw();
                "step 1"
                if (target.num('h') < 2) {
                  target.damage('fire');
                  event.finish();
                } else {
                  target.chooseControl('获得你两张牌', '对你造成伤害', ui.create.dialog('请选择一项', 'hidden')).set('ai', function () {
                    if (get.attitude(target, player) > 5) return '获得你两张牌';
                    if (get.damageEffect(target, player, target, 'fire') > 0) return '对你造成伤害';
                    if (target.countCards('h', 'tao')) return '对你造成伤害';
                    if (target.countCards('h', 'jiu') && target.hp == 1) return '对你造成伤害';
                    if (target.hp == 1) return '获得你两张牌';
                    // if (target.num('h') > 3) return '获得你两张牌';
                    // if (target.hasSkillTag('nofire')) return '对你造成伤害';
                    // if (target.hasSkillTag('nodamage')) return '对你造成伤害';
                    // if (target.hasSkillTag('notrick')) return '对你造成伤害';
                    return '对你造成伤害';
                  }).set('target', target);
                }
                "step 2"
                if (result.control == '获得你两张牌') {
                  player.gainPlayerCard(target, 'h', 2, true);
                  event.finish();
                } else if (result.control == '对你造成伤害') {
                  target.damage('fire');
                }
              },
              ai: {
                wuxie: function (target, card, player, viewer) {
                  if (ai.get.attitude(viewer, target) > 0) {
                    if (target.hasSkillTag('nofire')) return 0;
                    if (target.hasSkillTag('nodamage')) return 0;
                    if (target.hasSkillTag('notrick')) return 0;
                  }
                },
                basic: {
                  order: 3,
                  value: [6, 1],
                  useful: 3,
                },
                result: {
                  target: function (player, target) {
                    if (target.hasSkillTag('nofire')) return 1;
                    if (player == target) return -2;
                    var nh = target.num('h');
                    if (nh > 2) return -0.5;
                    if (nh == 1) return -1;
                    if (nh == 1 && target.hp == 1) return -2;
                    return -0.8;
                  },
                },
                tag: {
                  damage: 1,
                  fireDamage: 1,
                  natureDamage: 1,
                },
              },
            },
            jlsgqs_caochuanjiejian: {
              audio: true,
              fullskin: true,
              type: 'trick',
              enable: true,
              selectTarget: -1,
              filterTarget: function (card, player, target) {
                return target != player;
              },
              modTarget: true,
              content: function () {
                "step 0"
                target.chooseToUse({ name: 'sha' }, player, -1, '草船借箭：对' + get.translation(player) + '使用一张杀，或令其获得你的一张牌').set('targetRequired', true);
                "step 1"
                if (result.bool == false && target.num('he') > 0) {
                  player.gainPlayerCard(target, 'he', true);
                  event.finish();
                } else {
                  event.finish();
                }
              },
              ai: {
                wuxie: function (target, card, player, viewer) {
                  if (target.hasSha() && get.attitude(target, player) < -2 && Math.random() < 0.5) {
                    return;
                  }
                  if (get.attitude(viewer, target) > 0 && get.effect(target, { name: 'shunshou' }, player, viewer) > 0) {
                    return 0;
                  }
                },
                basic: {
                  order: 6,
                  useful: 3
                },
                result: {
                  target: function (player, target) {
                    var num = 0;
                    for (var i = 0; i < game.players.length; i++) {
                      if (game.players[i].ai.shown == 0) num++;
                    }
                    if (num > 1) return 0;
                    var nh = target.num('h');
                    if (nh > 2) return -0.5;
                    if (nh == 1) return -2;
                    return -0.8;
                  },
                  player: function (player, target) {
                    var num = 0;
                    if (ai.get.attitude(target, player) < -1) num--;
                    if (ai.get.attitude(target, player) > 1) num++;
                    if (target.num('h') == 0) return 0;
                    if (target.num('h') == 1) return -0.5;
                    if (player.hp <= 1) return -2;
                    if (target.num('h', 'sha') == 0 && Math.random() < 0.5) return 1;
                    return num - 1;
                  },
                },
                tag: {
                  multitarget: 1,
                  multineg: 1,
                },
              },
            },
            jlsgqs_wangmeizhike: {
              audio: true,
              fullskin: true,
              type: 'trick',
              enable: true,
              selectTarget: -1,
              filterTarget: true,
              ignoreTarget: function (card, player, target) {
                return target.isHealthy() && target.hp == 1;
              },
              modTarget: true,
              content: function () {
                if (target.hp > 1) target.draw(2, 'nodelay');
                else {
                  target.recover();
                }
              },
              ai: {
                wuxie: function (target, card, player, viewer) {
                  if (ai.get.attitude(viewer, target) < 0 && target.hp == 1) {
                    if (Math.random() < 0.7) return 1;
                    return 0;
                  }
                },
                basic: {
                  order: 6.5,
                  useful: 4,
                  value: 10
                },
                result: {
                  target: function (player, target) {
                    if (target.hp == 1) return 2;
                    if (get.mode() == 'identity') {
                      if (target.isZhu && target.hp <= 1) return 10;
                    }
                    if (target.num('h') < 1) return 1.5;
                    return 1;
                  },
                },
                tag: {
                  draw: 2,
                  recover: 0.5,
                  multitarget: 1,
                },
              },
            },
            jlsgqs_mei: {
              audio: true,
              fullskin: true,
              type: 'basic',
              enable: true,
              savable: function (event, player) {
                return _status.event.dying != player;
              },
              selectTarget: function () {
                if (_status.event.type == 'dying') return -1;
                return 1;
              },
              filterTarget: true,
              modTarget: true,
              content: function () {
                "step 0"
                if (target.hp > 1) target.draw(2);
                else {
                  target.recover();
                }
                "step 1"
                if (target.hp > 0 && event.getParent(2).type == 'dying') target.draw();
              },
              ai: {
                basic: {
                  order: function (card, player) {
                    return get.order({ name: 'tao' }) - 0.5;
                    // if (player.hasSkillTag('pretao')) return 5;
                    // return 2;
                  },
                  useful: [8, 6.5],
                  value: [8, 6.5],
                },
                result: {
                  target: function (player, target) {
                    // if(player==target&&player.hp<=0) return 2;
                    if (target.hp == target.maxHp && target.hp == 1) {
                      return 0;
                    }
                    var nh = target.countCards('h');
                    var keep = false;
                    if (nh <= target.hp) {
                      keep = true;
                    } else if (nh == target.hp + 1 && target.hp >= 2 && target.num('h', 'tao') <= 1) {
                      keep = true;
                    }
                    var mode = get.mode();
                    if (target.hp >= 2 && keep && target.hasFriend()) {
                      if (target.hp > 2) return 0;
                      if (target.hp == 2) {
                        for (var i = 0; i < game.players.length; i++) {
                          if (target != game.players[i] && ai.get.attitude(target, game.players[i]) >= 3) {
                            if (game.players[i].hp <= 1) return 0;
                            if (mode == 'identity' && game.players[i].isZhu && game.players[i].hp <= 2) return 0;
                          }
                        }
                      }
                    }
                    if (target.hp < 0 && target != player && target.identity != 'zhu') return 0;
                    var att = ai.get.attitude(player, target);
                    if (att < 3 && att >= 0 && player != target) return 0;
                    var tri = _status.event.getTrigger();
                    if (mode == 'identity' && player.identity == 'fan' && target.identity == 'fan') {
                      if (tri && tri.name == 'dying' && tri.source && tri.source.identity == 'fan' && tri.source != target) {
                        var num = 0;
                        for (let aplayer of game.players) {
                          if (aplayer.identity == 'fan') {
                            num += aplayer.num('h', 'tao');
                            if (num > 2) return 2;
                          }
                        }
                        if (num > 1 && player == target) return 2;
                        return 0;
                      }
                    }
                    if (mode == 'identity' && player.identity == 'zhu' && target.identity == 'nei') {
                      if (tri && tri.name == 'dying' && tri.source && tri.source.identity == 'zhong') {
                        return 0;
                      }
                    }
                    if (mode == 'stone' && target.isMin() &&
                      player != target && tri && tri.name == 'dying' && player.side == target.side &&
                      tri.source != target.getEnemy()) {
                      return 0;
                    }
                    return 2;
                  },
                },
                tag: {
                  recover: 1,
                  save: 1,
                },
              },
            },
          },
          skill: {
            jlsgqs_relic: {
              trigger: { player: 'equipEnd' },
              forced: true,
              filter: function (event, player) {
                if (!event.card) return false;
                if (get.position(event.card) != 'e') return false;
                return ['3', '4'].contains(get.subtype(event.card, player)[5]);
              },
              content: function () {
                'step 0'
                var type = get.subtype(trigger.card, player)[5];
                var card = null, cards = [];
                if (type == '3') {
                  card = player.getCards('e', { subtype: "equip4" });
                } else {
                  card = player.getCards('e', { subtype: "equip3" });
                }
                if (!card) {
                  event.finish(); return;
                }
                cards = cards.concat(card);
                card = player.getCards('e', { subtype: "equip5" });
                if (!card) {
                  event.finish(); return;
                }
                cards = cards.concat(card);
                var prompt = "将" + cards.map(card => get.translation(card)).join("或") + "置入弃牌堆";
                player.chooseCard('e', prompt, card => cards.contains(card), true);
                'step 1'
                player.lose(result.cards, false, 'visible').set('type', 'equip').set('getlx', false);
              },
            },
            jlsgqs_kongmingdeng: {
              equipSkill: true,
              popname: true,
              enable: ['chooseToUse', 'chooseToRespond'],
              filterCard: function (card) {
                return _status.event.player.getCards('e', 'jlsgqs_kongmingdeng').contains(card);
              },
              check: () => true,
              selectCard: -1,
              position: 'e',
              // filter: function (event, player) {
              //   var card = player.get('e', '5');
              //   if (card) {
              //     var name = card.name;
              //     if (name && name.indexOf('jlsgqs_kongmingdeng') == -1) return false;
              //     return _status.event.type == 'dying';
              //   }
              // },
              viewAsFilter: function (player) {
                return player.countCards('e', 'jlsgqs_kongmingdeng') && _status.event.type == 'dying';
                // var card = player.get('e', '5');
                // if (card) {
                //   var name = card.name;
                //   return name == 'jlsgqs_kongmingdeng';
                // }
              },
              viewAs: { name: 'tao' },
              prompt: '将孔明灯当【桃】使用',
              ai: {
                skillTagFilter: function (player) {
                  var card = player.get('e', '5');
                  if (card) {
                    var name = card.name;
                    return name && name.indexOf('jlsgqs_kongmingdeng') != -1;
                  }
                },
                threaten: 1.5,
                save: true,
              },
            },
            jlsgqs_muniu: {
              equipSkill: true,
              enable: 'phaseUse',
              usable: 1,
              prompt: '请选择一名角色交给其一张牌然后你摸一张牌',
              filterTarget: function (card, player, target) {
                return player != target;
              },
              filter: function (event, player) {
                return player.countCards('h') != 0;
              },
              filterCard: true,
              discard: false,
              lose: true,
              check: function (card) {
                var player = get.owner(card);
                return 6 - ai.get.value(card);
                if (!ui.selected.cards.length && card.name == 'du'
                  && game.hasPlayer(p => get.attitude(player, p) < 0 && !p.hasSkillTag('nodu'))) return 20;
                return 8 - get.value(card);
              },
              content: function () {
                target.gain(cards[0], player);
                player.$give(1, target);
                player.draw();
              },
              ai: {
                expose: 0.1,
                order: 8,
                result: {
                  target: function (player, target) {
                    if (target.hasSkillTag('nogain')) return 0;
                    if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') {
                      if (target.hasSkillTag('nodu')) return 0;
                      return -10;
                    }
                    if (target.hasJudge('lebu')) return 0;
                    var nh = target.countCards('h');
                    return Math.max(1, 5 - nh);
                  }
                },
              }
            },
            jlsgqs_yuxi: {
              equipSkill: true,
              trigger: { player: 'phaseBegin' },
              forced: true,
              content: function () {
                player.draw();
              },
              mod: {
                maxHandcard: function (player, current) {
                  return current + 2;
                }
              }
            },
            _jlsgqs_yuxi2: {
              equipSkill: true,
              trigger: { player: 'shaHit' },
              forced: true,
              filter: function (event, player) {
                if (player != event.player) return false;
                var card = event.target.get('e', '5');
                if (card) {
                  var name = card.name;
                  if (name && name.indexOf('jlsgqs_yuxi') != -1) return true;
                }
                return false;
              },
              // prompt: function (event, player) {
              //   var str = '';
              //   str += '是否获得' + get.translation(event.target) + '装备区中的【玉玺】？';
              //   return str;
              // },
              // check: function (event, player) {
              //   return 1;
              // },
              content: function () {
                var card = trigger.target.get('e', '5');
                if (card) {
                  var name = card.name;
                  if (name && name.indexOf('jlsgqs_yuxi') != -1 && card) {
                    trigger.player.gain(card, trigger.target);
                    trigger.target.$give(card, trigger.player);
                  }
                }
              }
            },
            jlsgqs_xiujian: {
              equipSkill: true,
              trigger: { player: 'phaseBegin' },
              direct: true,
              filter: function (event, player) {
                var card = player.get('e', '5');
                if (card) {
                  var name = card.name;
                  if (name && name.indexOf('jlsgqs_xiujian') != -1) return true;
                }
                return false;
              },
              content: function () {
                "step 0"
                player.chooseTarget(function (card, player, target) {
                  return player != target;
                }, '是否发动【袖箭】？').ai = function (target) {
                  return ai.get.damageEffect(target, player, player);
                };
                "step 1"
                if (result.bool && result.targets) {
                  player.line(result.targets, 'green');
                  player.logSkill('jlsgqs_xiujian', result.targets);
                  var card = player.get('e', '5');
                  if (card) {
                    var name = card.name;
                    if (name && name.indexOf('jlsgqs_xiujian') != -1 && card) {
                      player.discard(card);
                      result.targets[0].damage();
                    }
                  }
                }
              }
            },
            jlsgqs_qixingbaodao: {
              equipSkill: true,
              trigger: { player: 'shaMiss' },
              filter: function (event, player) {
                return event.target && event.target.countGainableCards(player, 'e');
              },
              // prompt: function (event, player) {
              //   return `###是否发动【七星宝刀】?###获得${get.translation(event.target)}装备区中的一张牌并将【七星宝刀】交给他`;
              // },
              check: function (event, player) {
                return 1;
              },
              content: function () {
                'step 0'
                var card = player.getEquip('jlsgqs_qixingbaodao');
                if (card) {
                  player.give(card, trigger.target);
                }
                if (trigger.target.countGainableCards(player, 'e') == 0) {
                  event.finish();
                }
                'step 1'
                player.gainPlayerCard('e', trigger.target, true);
              },
            },
            jlsgqs_dunjiatianshu: {
              equipSkill: true,
              mod: {
                globalTo: function (from, to, distance) {
                  var e1 = to.get('e', '3');
                  var e2 = to.get('e', '4');
                  if (!e1 && !e2) return distance + 1;
                },
                globalFrom: function (from, to, distance) {
                  var e1 = from.get('e', '3');
                  var e2 = from.get('e', '4');
                  if (!e1 && !e2) return distance - 1;
                },
                maxHandcard: function (player, current) {
                  var e1 = player.get('e', '3');
                  var e2 = player.get('e', '4');
                  if (e1 || e2) return current + 1;
                },
              },
            },
            jlsgqs_taipingyaoshu: {
              equipSkill: true,
              enable: 'phaseUse',
              usable: 1,
              prompt: '请选择一名角色令其摸一张牌',
              filterTarget: true,
              content: function () {
                target.draw();
              },
              ai: {
                expose: 0.1,
                order: 9,
                result: {
                  target: function (player, target) {
                    var att = ai.get.attitude(player, target);
                    if (target.num('h') >= 4) return 0;
                    if (target.num('h') == 0 && att > 0) return 2;
                    var num = target.num('h');
                    if (att > 0) return att - num;
                  },
                },
              }
            },
            jlsgqs_shuiyanqijun_skill: {
              audio: 'ext:极略:1',
              trigger: { player: 'phaseUseBegin' },
              hidden: true,
              forced: true,
              content: function () {
                var num = Math.ceil(player.num('h') / 2);
                player.chooseToDiscard(num, 'h', true);
              }
            },
            jlsgqs_jinnangdai: {
              equipSkill: true,
              mod: {
                maxHandcard: function (player, current) {
                  return current + 1;
                },
              },
            }
          },
          translate: {
            jlsg_qs: '七杀包',
            jlsgqs_kongmingdeng: '孔明灯',
            jlsgqs_muniu: '木牛流马',
            jlsgqs_taipingyaoshu: '太平要术',
            jlsgqs_dunjiatianshu: '遁甲天书',
            jlsgqs_qixingbaodao: '七星宝刀',
            jlsgqs_xiujian: '袖箭',
            _jlsgqs_yuxi2: '玉玺',
            jlsgqs_yuxi: '玉玺',
            jlsgqs_jinnangdai: '锦囊袋',
            jlsgqs_jinnangdai_info: '锁定技，你的手牌上限+1；你失去装备区里的【锦囊袋】时，摸一张牌。',
            jlsgqs_kongmingdeng_info: '任意角色处于濒死状态时，你可以将你装备区的【孔明灯】当【桃】使用；锁定技，当你从装备区中失去【孔明灯】时，回复1点体力',
            jlsgqs_muniu_info: '出牌阶段限一次，你可以将一张手牌交给一名其他角色，然后摸一张牌；锁定技，当你从装备区中失去【木牛流马】时，须弃置一张基本牌或者失去1点体力',
            jlsgqs_taipingyaoshu_info: '出牌阶段限一次，你可以令一名角色摸一张牌；锁定技，当【太平要术】置入你的装备区时，你须弃置一张红色手牌或者失去1点体力',
            jlsgqs_dunjiatianshu_info: '锁定技，若你的装备区没有坐骑牌，其他角色计算与你的距离时，始终+1，你计算与其他角色的距离时，始终-1；锁定技，若你的装备区有坐骑牌，你的手牌上限+1',
            jlsgqs_qixingbaodao_info: '当你使用的【杀】被目标角色的【闪】响应后，你可以将装备区的【七星宝刀】交给该名角色，然后获得其装备区的一张牌',
            jlsgqs_xiujian_info: '回合开始阶段开始时，你可以弃置你装备区中的【袖箭】，然后对一名其他角色造成一点伤害；锁定技，当你从装备区失去【袖箭】时，你摸一张牌',
            _jlsgqs_yuxi2_info: '一名角色使用【杀】对你造成伤害时，可获得你装备区中的【玉玺】',
            jlsgqs_yuxi_info: '锁定技，你的手牌上限+2，回合开始阶段开始时，你摸一张牌；一名角色使用【杀】对你造成伤害时，可获得你装备区中的【玉玺】',
            jlsgqs_qingmeizhujiu: '青梅煮酒',
            jlsgqs_qingmeizhujiu_info: '出牌阶段对一名有手牌的其他角色使用，该角色展示一张手牌，然后你可以弃置一张大于此牌的手牌并回复一点体力，或者弃置一张不大于此牌的手牌令其回复一点体力',
            jlsgqs_shuiyanqijun: '水淹七军',
            jlsgqs_shuiyanqijun_info: '出牌阶段，对对你攻击范围内的一名其他角色使用。若判定结果不为方片，则该角色出牌阶段开始时须弃置一半数量的手牌（向上取整）',
            jlsgqs_yuqingguzong: '欲擒故纵',
            jlsgqs_yuqingguzong_info: '出牌阶段，对你攻击范围内的一名其他角色使用。你令该角色摸一张牌，然后其选择一项：令你获得其两张手牌，或受到1点火焰伤害',
            jlsgqs_caochuanjiejian: '草船借箭',
            jlsgqs_caochuanjiejian_info: '出牌阶段，对除你以外的所有角色使用。每名目标角色须依次选择一项：对你使用一张【杀】；或令你获得其一张牌。',
            jlsgqs_wangmeizhike: '望梅止渴',
            jlsgqs_wangmeizhike_info: '出牌阶段，对所有人使用。每名角色按下列规则依次结算：若体力值为1，则回复1点体力；若体力值大于1，则摸两张牌',
            jlsgqs_mei: '梅',
            jlsgqs_mei_info: '出牌阶段，对一名角色使用，若其体力值大于1，则摸两张牌；否则其回复一点体力。一名其他角色处于濒死状态时，对其使用，其回复1点体力，若因此脱离濒死状态，该角色摸一张牌。',
          },
          list: [
            ["heart", 5, "sha", "fire"],
            ["heart", 12, "sha", "fire"],
            ["heart", 6, "sha", "fire"],
            ["diamond", 9, "sha", "fire"],
            ["heart", 6, "sha"],
            ["spade", 7, "sha"],
            ["heart", 8, "sha"],
            ["club", 5, "sha"],
            ["diamond", 6, "sha"],
            ["diamond", 7, "sha"],
            ["heart", 8, "sha"],
            ["club", 3, "jiu"],
            ["heart", 12, "shan"],
            ["diamond", 6, "shan"],
            ["diamond", 5, "shan"],
            ["heart", 2, "shan"],
            ["heart", 4, "shan"],
            ["diamond", 8, "shan"],
            ["heart", 8, "jlsgqs_kongmingdeng"],
            ["heart", 2, "jlsgqs_muniu"],
            ["diamond", 9, "jlsgqs_taipingyaoshu"],
            ["club", 5, "jlsgqs_dunjiatianshu"],
            ["spade", 8, "jlsgqs_qixingbaodao"],
            ["diamond", 3, "jlsgqs_xiujian"],
            ["spade", 12, "jlsgqs_yuxi"],
            ["heart", 4, "jlsgqs_mei"],
            ["heart", 6, "jlsgqs_mei"],
            ["diamond", 5, "jlsgqs_mei"],
            ["diamond", 12, "jlsgqs_mei"],
            ["heart", 9, "jlsgqs_mei"],
            ["heart", 11, "jlsgqs_mei"],
            ["heart", 5, "jlsgqs_qingmeizhujiu"],
            ["diamond", 3, "jlsgqs_qingmeizhujiu"],
            ["diamond", 8, "jlsgqs_qingmeizhujiu"],
            ["club", 8, "jlsgqs_shuiyanqijun"],
            ["diamond", 9, "jlsgqs_shuiyanqijun"],
            ["diamond", 7, "jlsgqs_wangmeizhike"],
            ["spade", 10, "jlsgqs_caochuanjiejian"],
            ["heart", 6, "jlsgqs_caochuanjiejian"],
            ["diamond", 10, "jlsgqs_yuqingguzong"],
            ["heart", 12, "jlsgqs_yuqingguzong"],
            ["diamond", 8, "jlsgqs_yuqingguzong"],
            ["heart", 5, "jlsgqs_yuqingguzong"],
            ["heart", 13, "wuxie"],
            ["club", 12, "wuxie"],
            ["diamond", 3, "jlsgqs_jinnangdai"],
          ]
        };
        var extname = _status.extension;
        for (var cardName in jlsg_qs.card) {
          var card = jlsg_qs.card[cardName];
          if (card.fullskin) {
            if (_status.evaluatingExtension) {
              card.image = `db:extension-${extname}:${cardName}.png`;
            }
            else {
              card.image = `ext:${extname}/${cardName}.png`;
            }
          }
          if (card.audio === true) {
            card.audio = `ext:${extname}`;
          }
          if (card.chongzhu && config.qsRelic) { // 七杀特殊宝物规则
            if (!card.onEquip) {
              card.onEquip = function () { // remember to sync with onEquip of jlsgqs_taipingyaoshu!
                "step 0"
                var cards = player.getCards('e', { subtype: ['equip3', 'equip4'] });
                if (cards.length == 2) {
                  player.chooseCard('e', '将进攻坐骑或防御坐骑置入弃牌堆', card => cards.contains(card), true);
                }
                "step 1"
                // 模拟替换
                player.lose(result.cards, false, 'visible').set('type', 'equip').set('getlx', false);
              };
            }
            if (!card.skills) {
              card.skills = [];
            }
            card.skills.push("jlsgqs_relic");
          }
        }
        return jlsg_qs;
      });
      // jlsg library
      lib.arenaReady.push(function () {
        lib.element.player.hasSkills = function (skills) {
          var skill = skills.split("|");
          for (var i = 0; i < skill.length; i++) {
            if (this.hasSkill(skill[i])) return true;
          }
          return false;
        }
      });
      var jlsg = {
        debug: {
          logCurrentRanks() {
            var logC = function (name) {
              console.log(`${name} ${get.translation(name)} ${get.rank(name)}`);
            };
            Array.from(document.getElementsByClassName('character')).filter(
              c => c.link
            ).forEach(
              c => logC(c.link)
            );
            if (!game.players || !game.players.forEach) return;
            game.players.forEach(
              p => {
                if (p.name1) logC(p.name1);
                if (p.name2) logC(p.name2);
              }
            )
          },
          debugProperty(obj, name, get = true, set = true) {
            if (name in obj) {
              console.log(name, 'found in', obj);
              obj['__' + name + '__'] = obj[name];
              delete obj[name];
            } else {
              console.log(name, 'not found in', obj);
            }
            Object.defineProperty(obj, name, {
              get() {
                debugger;
                return this['__' + name + '__'];
              },
              set(value) {
                debugger;
                return (this['__' + name + '__'] = value);
              },
            })
          },
        },
        relu(num) {
          return num >= 0 ? num : 0;
        },
        showRepo() {
          var mirrorURL = lib.extensionPack["极略"] && lib.extensionPack["极略"].mirrorURL;
          if (!mirrorURL) return;
          if (window.cordova) {
            if (cordova.InAppBrowser) {
              return cordova.InAppBrowser.open(mirrorURL, '_system');
            }
            return;
          }
          if (window.require) {
            return require('electron').shell.openExternal(mirrorURL);
          }
          return window.open(mirrorURL);
        },
        checkUpdate(refNode) {
          if (!('noModule' in HTMLScriptElement.prototype)) {
            alert("游戏运行时/系统webview过老无法自动更新");
            return;
          }
          import('./modules/idb-keyval.js')
          var version = lib.extensionPack['极略'].version;
          refNode.insertAdjacentHTML('afterend',
            `<div>当前版本${version}<br>正在获取最新版本号</div>`
          );
          var cNode = refNode.nextSibling;
          var responsePromise = fetch("https://api.github.com/repos/xiaoas/jilue/releases/latest", {
            "headers": {
              "accept": "application/vnd.github.v3+json",
              "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
              "cache-control": "no-cache",
              "pragma": "no-cache"
            },
            "method": "GET",
          });
          // TODO: only update to version with same major version
          let successHandler = (response) => {
            if (response.status >= 300) {
              cNode.innerHTML += ` 失败<br>${response.status} ${response.statusText}`;
              return Promise.reject(response);
            } else {
              cNode.innerHTML += ' 成功';
              return response;
            }
          }
          let errorHandler = (error) => {
            cNode.innerHTML += ` 失败<br>${error}`;
            console.log(error);
            return Promise.reject(error);
          };
          responsePromise.then(successHandler, errorHandler)
            .then(response => response.json())
            .then(data => {
              var latestVersion = data.tag_name;
              if (latestVersion.startsWith('v')) {
                latestVersion = latestVersion.slice(1)
              }
              if (latestVersion > version) {
                refNode.innerHTML = `更新至 ${latestVersion}<br>`;
                window.jlsg.updateData = data;
                var newFunc = `jlsg.updateGuard(this)`;
                refNode.setAttribute("onClick", newFunc);
              } else {
                refNode.innerHTML = `当前已经是最新版<br>`;
              }
            })
        },
        async updateGuard(refNode) {
          if (!this.update) {
            return;
          }
          if (!this.update.guard) {
            this.update.guard = true;
            await this.update(refNode);
            this.update.guard = false;
          }
        },
        async update(refNode) {
          // TODO
          var latestTag = window.jlsg.updateData.tag_name;
          var currentTag = 'v' + lib.extensionPack['极略'].version;
          var response = await fetch("https://api.github.com/repos/xiaoas/jilue/tags", {
            "headers": {
              "accept": "application/vnd.github.v3+json",
              "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
            },
            "method": "GET",
          });
          var tags = await response.json()
          tags = tags.map(t => t.name)
          if (!tags.contains(currentTag)) {
            if (tags.every(t => t > currentTag)) {
              refNode.insertAdjacentHTML('afterend',
                `<div>没有找到适用当前版本的更新讯息${currentTag}</div>`
              );
            }
            currentTag = tags.filter(t => t < currentTag).reduce((a, b) => a < b ? b : a);
          }
          // var compareURI = `https://api.github.com/repos/xiaoas/jilue/compare/v2.1.0208...v2.2.0631`
          var compareURI = `https://api.github.com/repos/xiaoas/jilue/compare/${currentTag}...${latestTag}`
          var cNode, data;
          try {
            refNode.insertAdjacentHTML('afterend',
              `<div>获取文件列表</div>`
            ); cNode = refNode.nextSibling;
            let response = await fetch(compareURI, {
              "headers": {
                "accept": "application/vnd.github.v3+json",
                "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
              },
              "method": "GET",
            });
            data = await response.json();
            cNode.innerHTML += ' 成功';
          } catch (e) {
            console.log(e);
            cNode.innerHTML += ' 失败';
            return
          }
          var files = data.files;
          game.saveExtensionConfig('极略', 'pendingFiles', JSON.stringify(files))
          var idbKeyval;
          try {
            idbKeyval = await import('./modules/idb-keyval.js')
          }
          catch (e) {
            idbKeyval = await import('https://cdn.jsdelivr.net/npm/idb-keyval@5/+esm')
          }
          var required = files.filter(f => ['added', 'modified'].includes(f.status))
          var blobs = await idbKeyval.getMany(required.map(f => f.sha))
          // var downloads = required.map((f,i) => blobs[i] || fetch(f.raw_url))
          var myMap = new Map()
          var waitBuffer = []
          // for (let f of required) {
          //   if (f.raw_url.includes("raw.githubusercontent.com")) {
          //     f.raw_url.replace("raw.githubusercontent.com", "raw.fastgit.org")
          //   }
          // }
          const maxConcurrent = 5, maxRetry = 3;
          for (let [i, f] of required.entries()) {
            if (!blobs[i]) {
              if (myMap.size < maxConcurrent) {
                myMap.set(fetch(f.raw_url), f)
              } else {
                waitBuffer.push(f)
              }
            }
          }
          // required.forEach((f, i) => blobs[i] || myMap.set(fetch(f.raw_url), f))
          refNode.insertAdjacentHTML('afterend',
            `<div>正在下载<span>0</span>/${required.length}请耐心等待</div><br>`
          ); cNode = refNode.nextSibling;
          var [valNode] = cNode.getElementsByTagName('span')
          var finishedCnt = {
            _v: null,
            get v() {
              return this._v;
            },
            set v(_v) {
              this._v = _v;
              valNode.innerHTML = _v.toString();
            },
          };
          var downloadError = 0
          finishedCnt.v = required.length - myMap.size - waitBuffer.length
          while (myMap.size) {
            let [completed] = await Promise.any(Array.from(myMap.keys()).map(p => p.then(res => [p], res => [p])))
            let f = myMap.get(completed)
            myMap.delete(completed)
            try {
              let value = await completed;
              // value = await value.blob()
              // save as arrayBuffer
              value = await value.arrayBuffer()
              ++finishedCnt.v;
              idbKeyval.set(f.sha, value)
              console.log(`${f.filename} downloaded and stored.`)
            } catch (e) {
              // console.log(f, e)
              f.retry = f.retry || 0;
              ++f.retry;
              console.log(`${f.filename} download No.${f.retry} failed`)
              if (f.retry >= maxRetry) {
                ++downloadError;
              } else {
                let nextURL = f.raw_url
                nextURL = nextURL.replace('github.com', 'hub.fastgit.org')
                myMap.set(fetch(nextURL), f)
              }
            } finally {
              if (myMap.size < maxConcurrent && waitBuffer.length) {
                let f = waitBuffer.pop()
                myMap.set(fetch(f.raw_url), f)
              }
            }
          }
          if (downloadError != 0) {
            cNode.innerHTML += `失败${downloadError} 下次运气会更好`
            return;
          }
          // actually array Buffers
          blobs = await idbKeyval.getMany(required.map(f => f.sha))
          if (blobs.some(b => !b)) {
            cNode.innerHTML += ' 失败<br> Error blob not found';
            return;
          }
          let blobMap = new Map(required.map((f, i) => [f.sha, blobs[i]]))
          if (!game.download) {
            throw "Not implemented";
          }
          cNode.innerHTML += ' 成功<br>请酌情等待五秒后再重启不是不可以探测安装完了但是我太懒了';
          console.log('writing files');
          if (lib.node && lib.node.fs) {
            let prefix = __dirname + '/extension/极略/'
            for (let [i, f] of files.entries()) {
              switch (f.status) {
                case 'added':
                case 'modified':
                  let blob = blobMap.get(f.sha)
                  lib.node.fs.writeFile(prefix + f.filename, Buffer.from(blob), e => e && console.log(f, e))
                  break;
                case 'removed':
                  lib.node.fs.rm(prefix + f.filename, e => e && console.log(f, e))
                  break;
                case 'renamed':
                  lib.node.fs.rename(prefix + f.previous_filename, prefix + f.filename, e => e && console.log(f, e))
                  break;
                default:
                  console.log(f)
                  break;
              }
            }
          } else {
            window.resolveLocalFileSystemURL(lib.assetURL, function (entry) {
              entry.getDirectory('extension/极略/', {}, function (dirEntry) {
                for (let [i, f] of files.entries()) {
                  switch (f.status) {
                    case 'added':
                    case 'modified':
                      let blob = blobMap.get(f.sha)
                      dirEntry.getFile(f.filename, { create: true }, function (fileEntry) {
                        fileEntry.createWriter(function (fileWriter) {
                          fileWriter.write(blob);
                        });
                      });
                      break;
                    case 'removed':
                      dirEntry.getFile(f.filename, function (fileEntry) {
                        fileEntry.remove();
                      });
                      break;
                    case 'renamed':
                      dirEntry.getFile(f.previous_filename, function (fileEntry) {
                        fileEntry.moveTo(dirEntry, f.filename);
                      });
                      break;
                    default:
                      console.log(f)
                      break;
                  }
                }
              });
            });
          }
          idbKeyval.clear()
        },
        showRepoElement(refElement) {
          let potentialRepo = refElement.nextElementSibling;
          if (potentialRepo && potentialRepo.id == "repo-link") {
            potentialRepo.remove();
          } else {
            refElement.insertAdjacentHTML('afterend', `<a id="repo-link" onclick="lib.jlsg.showRepo()" style="cursor: pointer;text-decoration: underline;display:block">Visit Repository</a>`);
            // refElement.nextElementSibling.scrollIntoView({
            //   behavior: 'smooth',
            //   block: 'nearest',
            // });
          }
        },
        getLoseHpEffect(player) {
          var loseHpEffect = -3;
          if (player.hp == 1) loseHpEffect *= 2.5;
          if (player.hp == 2) loseHpEffect *= 1.8;
          if (player.hp == 4) loseHpEffect *= 0.9;
          if (player.hp == 5) loseHpEffect *= 0.8;
          if (player.hp > 5) loseHpEffect *= 0.6;
          if (player.hasSkillTag('maihp')) loseHpEffect += 3;
          return loseHpEffect;
        },
        ai: {
          skill: {
            lose_equip: 'xiaoji|xuanfeng',
            need_kongcheng: 'shangshix|shangshi|jlsg_ruya|jlsg_qicai|lianying|relianying|kongcheng|sijian|hengzheng',
            rejudge: 'guicai|jlsg_guicai|guidao|jilve|nos_zhenlie|huanshi|midao',
            save: 'jlsg_guagu|jlsg_fangxin|jlsg_renxin|jijiu|buyi|chunlao|longhun|jlsg_longhun',
            need_card: 'jlsg_youdi|jlsg_rende|jlsg_liuyun|jlsg_yansha|jlsg_huiqu|jlsg_zhaoxiang|kanpo|guicai|jlsg_guicai|guidao|beige|xiaoguo|liuli|tianxiang|jijiu|leiji|releiji|qingjian|zhuhai|qinxue|danqi',
            recover: 'jlsg_liuyun|jlsg_zhishi|rerende|rende|kuanggu|zaiqi|jieyin|qingnang|yinghun|hunzi|shenzhi|longhun|zishou|ganlu|xueji|shangshi|chengxiang|buqu|quji',
            use_lion: 'longhun|duanliang|qixi|guidao|relijian|lijian|xinjujian|jujian|zhiheng|mingce|yongsi|fenxun|gongqi|yinling|jilve|qingcheng',
            need_equip: 'shensu|mingce|jujian|jlsg_liuyun|beige|yuanhu|huyuan|gongqi|gongji|yanzheng|qingcheng|longhun|shuijian|yinbing',
            straight_damage: 'jlsg_chouxi|jlsg_zhishi|qiangxi|duwu|danshou',
            double_sha: 'paoxiao|fuhun|tianyi|xianzhen|zhaxiang|lihuo|jiangchi|shuangxiong|qiangwu|luanji',
            need_maxhp: 'jlsg_ruya|yingzi|zaiqi|yinghun|hunzi|juejing|ganlu|zishou|miji|chizhong|xueji|quji|xuehen|jushou|tannang|fangzhu|shangshi|miji',
            bad_skills: 'benghuai|jlsg_wumou|shiyong|jlsg_shiyong|yaowu|chanyuan|chouhai',
            break_sha: 'jlsg_zhaoxiang|jlsg_yansha',
            maixie_skill: 'guixin|yiji|fankui|jieming|xuehen|neoganglie|ganglie|vsganglie|enyuan|fangzhu|nosenyuan|langgu|quanji|zhiyu|renjie|tanlan|tongxin|huashen|duodao|chengxiang|benyu',
          }
        },
        sort: {
          hp: function (a, b) {
            var c1 = a.hp;
            var c2 = b.hp;
            if (c1 == c2) {
              return jlsg.sort.threat(a, b);
            }
            return c1 > c2;
          },
          handcard: function (a, b) {
            var c1 = a.num('h');
            var c2 = b.num('h');
            if (c1 == c2) {
              return jlsg.sort.defense(a, b);
            }
            return c1 < c2;
          },
          value: function (a, b) {
            return jlsg.getValue(a) < jlsg.getValue(b);
          },
          chaofeng: function (a, b) {
            return jlsg.getDefense(a) > jlsg.getDefense(b);
          },
          defense: function (a, b) {
            return jlsg.getDefenseSha(a) < jlsg.getDefenseSha(b);
          },
          threat: function (a, b) {
            var d1 = a.num('h');
            for (var i = 0; i < game.players.length; i++) {
              if (a.canUse('sha', game.players[i]) && a != game.players[i]) {
                d1 = d1 + 10 / (jlsg.getDefense(game.players[i]))
              }
            }
            var d2 = b.num('h');
            for (var i = 0; i < game.players.length; i++) {
              if (b.canUse('sha', game.players[i]) && b != game.players[i]) {
                d2 = d2 + 10 / (jlsg.getDefense(game.players[i]))
              }
            }
            return d1 > d2;
          }
        },
        isKongcheng: function (player) {
          return player.countCards('h') == 0;
        },
        needKongcheng: function (player, keep) {
          if (keep) {
            return jlsg.isKongcheng(player) && (player.hasSkill('kongcheng') || (player.hasSkill('zhiji') && !player.storage.zhiji));
          }
          if (!jlsg.hasLoseHandcardEffective(player) && !jlsg.isKongcheng(player)) return true;
          if (player.hasSkill('zhiji') && !player.storage.zhiji) return true;
          return player.hasSkills(jlsg.ai.skill.need_kongcheng);
        },
        hasBaguaEffect: function (player) {
          if (player.countCards('e', 'bagua')) return true;
          if (player.hasSkill('bazhen') && !player.get('e', '2')) return true;
          if (player.hasSkill('linglong') && !player.get('e', '2')) return true;
          return false;
        },
        hasBuquEffect: function (player) {
          if (player.hasSkill('buqu')) {
            if (player.storage.buqu == undefined) return true;
            if (player.storage.buqu && player.storage.buqu.length <= 4) return true;
            return false;
          }
          return false;
        },
        hasZhuqueEffect: function (player) {
          var cards = player.get('h');
          for (var i = 0; i < cards.length; i++) {
            if (cards[i].name == 'sha' && cards[i].nature == 'fire') return true;
            if (player.countCards('e', 'zhuque') && cards[i].name == 'sha' && !cards[i].nature) return true;
          }
          return false;
        },
        hasJiuEffect: function (player) {
          if (player.hasSkills('jiu|boss_zuijiu|luoyi2|reluoyi2|jie|nuzhan2|anjian|jlsg_huxiao|jlsg_jiwu_buff1|jlsg_wenjiu3')) return true;
          if (player.hasSkills('jlsg_ganglie_damage|jlsg_fenwei')) return true;
          if (player.hasSkill('jieyuan') && player.countCards('h') >= 2)
            if (player.hasSkill('chouhai') && jlsg.isKongcheng(player)) return true;
          if (player.hasSkill('qingxi')) {
            var num = 1;
            var info = get.info(player.get('e', '1'));
            if (info && info.distance && info.distance.attackFrom) {
              num -= info.distance.attackFrom;
            }
            return num > 1;
          }
          return false;
        },
        hasWushuangEffect: function (player) {
          if (player.hasSkills('wushuang|jlsg_shejing')) return true;
          return false;
        },
        hasZhugeEffect: function (player) {
          if (player.countCards('e', 'zhuge')) return true;
          if (player.hasSkills('paoxiao|tianyi2|zhanlong2|xianzhen2|jlsg_shayi')) return true;
          return false;
        },
        loseCardEffect: function (player) {
          if (jlsg.needKongcheng(player)) return 3;
          if (jlsg.getLeastHandcardNum(player) > 0) return 1;
          return -player.countCards('h');
        },
        gainCardEffect: function (player) {
          if (jlsg.needKongcheng(target, true)) return -1;
          if (jlsg.getOverflow(player)) return 0;
          return 3;
        },
        getLeastHandcardNum: function (player) {
          var least = 0;
          if (player.hasSkills('lianying|relianying') && least < 1) least = 1;
          if (player.hasSkill('jlsg_ruya') && least < player.maxHp) least = player.maxHp;
          if (player.hasSkill('shangshix') && least < 4) least = 4;
          var jwfy = jlsg.findPlayerBySkillName('shoucheng');
          if (least < 1 && jwfy && jlsg.isFriend(player, jwfy)) least = 1;
          if (player.hasSkill('shangshi') && least < Math.min(2, jlsg.getLostHp(player))) least = Math.min(2, jlsg.getLostHp(player));
          return least;
        },
        hasLoseHandcardEffective: function (player) {
          return player.countCards('h') > jlsg.getLeastHandcardNum(player);
        },
        isWeak: function (player) {
          if (jlsg.hasBuquEffect(player)) return false;
          if (player.hasSkill('longhun') && player.countCards('he') > 2) return false;
          if (player.hasSkill('jlsg_longhun') && player.countCards('he') > 2) return false;
          if (player.hasSkill('hunzi') && !player.storage.hunzi && player.hp > 1) return false;
          if ((player.hp <= 2 && player.countCards('h') <= 2) || player.hp <= 1) return true;
          return false;
        },
        getLostHp: function (player) {
          return player.maxHp - player.hp;
        },
        getBestHp: function (player) {
          var arr = {
            ganlu: 1, yinghun: 2, xueji: 1,
            baobian: Math.max(0, player.maxHp - 3),
          };
          if (player.hasSkill('longhun') && player.countCards('he') > 2) return 1;
          if (player.hasSkill('hunzi') && !player.storage.hunzi) return 2;
          for (var i in arr) {
            if (player.hasSkill(i)) {
              return Math.max((player.isZhu && 3 || 2), player.maxHp - arr[i])
            }
          }
          if (player.hasSkill('renjie') && player.hasSkill('sbaiyin')) return player.maxHp - 1;
          if (player.hasSkill('quanji') && player.hasSkill('zili')) return player.maxHp - 1;
          return player.maxHp;
        },
        getValue: function (player) {
          return player.hp * 2 + player.countCards('h');
        },
        isGoodHp: function (player) {
          if (player.hp > 1 || jlsg.getCardsNum('tao', player) >= 1 || jlsg.getCardsNum('jiu', player) >= 1) return true;
          if (jlsg.hasBuquEffect(player)) return true;
          if (player.hasSkill('niepan') && !player.storage.niepan) return true;
          if (player.hasSkill('reniepan') && !player.storage.reniepan) return true;
          if (player.hasSkill('jlsg_zhuizun') && !player.storage.jlsg_zhuizun) return true;
          if (player.hasSkill('fuli') && !player.storage.fuli) return true;
          return false;
        },
        isScure: function (player) {
          if (player.hp > jlsg.getBestHp(player)) return true;
          if (jlsg.countCanShaMe(player) <= 0) return true;
          if (jlsg.isGoodHp(player)) return true;
          return false;
        },
        needBear: function (player) {
          return (player.hasSkill('renjie') && player.hasSkill('sbaiyin') && !player.hasSkill('jilue') && player.storage.renjie < 4) || (player.hasSkill('qinxue') && !player.storage.qinxue);
        },
        cardNeed: function (card, player) {
          if (player == undefined || get.itemtype(player) != 'player') player = get.owner(card);
          var friends = jlsg.getFriends(player).sort(jlsg.sort.hp);
          if (!friends.length) return null;
          if (card.name == 'tao') {
            friends.sort(jlsg.sort.hp);
            if (friends[0].hp < 2) return 10;
            if (player.hp < 3 || (jlsg.getLostHp(player) > 1 && !player.hasSkills('longhun|buqu|jlsg_longhun')) || player.hasSkills('kurou|benghuai')) return 14;
            return jlsg.getUseValue(card, player);
          }
          var wuguotai = jlsg.findPlayerBySkillName('buyi');
          if (wuguotai && jlsg.isFriend(player, wuguotai) && get.type(card) != 'basic') {
            if (player.hp < 3 || (jlsg.getLostHp(player) > 1 && !player.hasSkills('longhun|buqu|jlsg_longhun')) || player.hasSkills('kurou|benghuai')) return 13;
          }
          if (jlsg.isWeak(player) && card.name == 'shan' && jlsg.getCardsNum('shan', player, player) < 1) return 12;
          return 0;
        },
        getOverflow: function (player, getMaxCards) {
          var kingdom_num = 0;
          if (player.hasSkill('yongsi') && _status.currentPhase == player && !(player.hasSkill('keji') && get.cardCount({ name: 'sha' }, player) == 0)) {
            var list = ['wei', 'shu', 'wu', 'qun'];
            for (var i = 0; i < game.players.length && list.length; i++) {
              if (list.contains(game.players[i].group)) {
                list.remove(game.players[i].group);
                kingdom_num++;
              }
            }
          }
          var MaxCards = 0;
          if (player.hasSkill('qiaobian')) MaxCards = Math.max(player.countCards('h') - 1, player.getHandcardLimit());
          if (player.hasSkill('keji') && get.cardCount({ name: 'sha' }, player) == 0) MaxCards = player.countCards('h');
          if (getMaxCards && MaxCards > 0) return MaxCards;
          MaxCards = player.getHandcardLimit();
          if (kingdom_num > 0) {
            if (player.countCards('he') <= kingdom_num) MaxCards = 0;
            else MaxCards = Math.min(player.getHandcardLimit(), player.countCards('he') - kingdom_num);
            if (getMaxCards) return MaxCards;
          }
          if (getMaxCards) return player.getHandcardLimit();
          return player.countCards('h') - MaxCards;
        },
        willSkipPhaseUse: function (player) {
          var friend_wuxie = 0;
          for (var i = 0; i < game.players.length; i++) {
            if (jlsg.isFriend(player, game.players[i])) friend_wuxie = friend_wuxie + jlsg.getCardsNum('wuxie', game.players[i], player);
            if (jlsg.isEnemy(player, game.players[i])) friend_wuxie = friend_wuxie - jlsg.getCardsNum('wuxie', game.players[i], player);
          }
          if (player.skipList.contains('phaseUse')) return true;
          if (player.hasJudge('lebu') && !player.hasSkill('yanxiao2') && friend_wuxie <= 0) {
            if (!player.hasSkills('zongshi|keji|guanxing|qiaobian') && player.countCards('h') >= player.hp + 1) return true;
            return false;
          }
          return false;
        },
        willSkipPhaseDraw: function (player) {
          var friend_wuxie = 0;
          for (var i = 0; i < game.players.length; i++) {
            if (jlsg.isFriend(player, game.players[i])) friend_wuxie = friend_wuxie + jlsg.getCardsNum('wuxie', game.players[i], player);
            if (jlsg.isEnemy(player, game.players[i])) friend_wuxie = friend_wuxie - jlsg.getCardsNum('wuxie', game.players[i], player);
          }
          if (player.hasJudge('bingliang') && !player.hasSkill('yanxiao2') && friend_wuxie <= 0) {
            if (!player.hasSkills('guanxing|qiaobian') && player.countCards('h') <= player.hp + 2) return true;
            return false;
          }
          if (player.skipList.contains('phaseDraw')) return true;
          return false;
        },
        getViewAsCard: function (card, player) {
          var skills = player.get('s', true).concat(lib.skill.global);
          game.expandSkills(skills);
          var list = [];
          for (var i = 0; i < skills.length; i++) {
            var ifo = get.info(skills[i]);
            if (ifo.viewAs && ifo.viewAs.name && ifo.filterCard) {
              var filtercard = get.filter(ifo.filterCard);
              var pos = jlsg.getCardPlace(card);
              if ((ifo.selectCard == 1 || ifo.selectCard == undefined) && filtercard(card, player) && ((ifo.position && ifo.position.indexOf(pos) == 0) || !ifo.position && pos == 'h')) {
                return game.createCard({ name: ifo.viewAs.name, suit: card.suit, number: card.number });
              }
            }
          }
          return null;
        },
        getSkillViewCard: function (card, name, player, place) {
          var skills = player.get('s', true).concat(lib.skill.global);
          game.expandSkills(skills);
          for (var i = 0; i < skills.length; i++) {
            var ifo = get.info(skills[i]);
            if (ifo.viewAs && ifo.viewAs.name == name) {
              if (ifo.filterCard) {
                var filtercard = get.filter(ifo.filterCard);
                if (filtercard(card, player) && (ifo.selectCard == 1 || ifo.selectCard == undefined)) {
                  if (ifo.position && ifo.position.indexOf(place) == 0) return true;
                  if (!ifo.position) return place == 'h';
                }
              }
            }
          }
          return false;
        },
        getCardPlace: function (card) {
          var owner = get.owner(card);
          if (owner) {
            if (owner.get('h').contains(card)) return 'h';
            if (owner.get('e').contains(card)) return 'e';
            if (owner.get('j').contains(card)) return 'j';
            return 's';
          }
          return 's';
        },
        isCard: function (name, card, player) {
          if (!player || !card) return false;
          if (card.name != name) {
            var owner = get.owner(card);
            var place;
            if (!owner || player != owner) {
              place = 'h';
            }
            else {
              place = jlsg.getCardPlace(card);
            }
            if (jlsg.getSkillViewCard(card, name, player, place)) return true;
            if (player.hasSkill('wushen') && get.suit(card) == 'heart' && card.name != 'sha') return false;
            if (player.hasSkill('jinjiu') && card.name == 'jiu') return true;
          }
          else {
            if (player.hasSkill('wushen') && get.suit(card) == 'heart' && card.name == 'sha') return true;
            if (player.hasSkill('jinjiu') && card.name == 'jiu') return true;
            if (lib.filter.cardUsable(card, player)) return true;
          }
          return false;
        },
        getKnownCard: function (player, from, card_name, viewAs, flags) {
          flags = flags || 'h';
          var forbid = false;
          if (!from && player == _status.event.player) forbid = true;
          from = from || _status.event.player;
          var cards = player.get(flags);
          var know = 0;
          for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            if ((!forbid && player == from)) {
              if ((viewAs && jlsg.isCard(card_name, card, player)) || card.name == card_name || get.suit(card) == card_name || get.color(card) == card_name) {
                know++;
              }
            }
          }
          return know;
        },
        getDefenseSha: function (player, attacker) {
          if (attacker == undefined || get.itemtype(attacker) != 'player') attacker = _status.event.player;
          var defense = jlsg.getCardsNum('shan', player, attacker);
          var knownShan = jlsg.getKnownCard(player, attacker, 'shan', true);

          defense = defense + knownShan * 1.2;

          if (attacker.hasSkill('liegong')) {
            var length = player.countCards('h');
            if (length >= attacker.hp || length <= get.attackRange(attacker)) return 0;
          }
          if (attacker.hasSkill('reliegong')) {
            var num = 0;
            if (player.countCards('h') >= attacker.num('h')) num++;
            if (player.hp >= attacker.hp) num++;
            if (get.attackRange(player) <= get.attackRange(attacker)) num++;
            if (num > 0) return 0;
          }

          if (jlsg.hasBaguaEffect(player)) {
            defense += 1.3;
            if (player.hasSkill('tiandu')) defense += 0.6;
            if (player.hasSkill('leiji')) defense += 0.4;
            if (player.hasSkill('boss_leiji')) defense += 0.5;
            if (player.hasSkill('releiji')) defense += 0.4;
            if (player.hasSkill('hongyan')) defense += 0.2;
          }

          if (jlsg.getCardsNum('shan', player, _status.event.player) > 1) {
            if (player.hasSkill('mingzhe')) defense += 0.2;
            if (player.hasSkill('tuntian') && player.hasSkill('zaoxian')) defense += 1.5;
          }

          if (player.hasSkill('aocai') && _status.currentPhase !== player) defense += 0.5;
          if (player.hasSkill('jlsg_zhenlie')) defense += 0.5;
          if (player.hasSkill('jlsg_danshou') && !jlsg.isKongcheng(player) && !jlsg.isKongcheng(attacker)) defense += 0.5;

          var jlsgsk_zhuran = jlsg.findPlayerBySkillName('jlsg_yonglie');
          if (jlsgsk_zhuran && jlsg.isGoodHp(jlsgsk_zhuran)) {
            if (player.inRangeOf(jlsgsk_zhuran) && jlsg.isFriend(player, jlsgsk_zhuran)) defense += 0.5;
          }
          var jlsgsr_zhangliao = jlsg.findPlayerBySkillName('jlsg_yansha');
          if (jlsgsr_zhangliao && jlsgsr_zhangliao.storage.jlsg_yansha2 && jlsgsr_zhangliao.storage.jlsg_yansha2.length) {
            if (jlsg.isFriend(player, jlsgsr_zhangliao) && get.attitude(jlsgsr_zhangliao, attacker) < 0 && attacker.num('he')) defense += 0.5;
          }

          if (player.hasZhuSkill('hujia')) {
            var caocao = player;
            var list = game.filterPlayer(function (target) {
              return jlsg.isFriend(target, caocao) && target.group == 'wei' && target != caocao;
            });
            if (list.length > 0) {
              var hujiaShan = 0;
              for (var i = 0; i < list.length; i++) {
                hujiaShan += jlsg.getCardsNum('shan', list[i], _status.event.player);
                if (jlsg.hasBaguaEffect(list[i])) hujiaShan += 0.8;
              }
              defense += hujiaShan;
            }
          }
          defense = defense + Math.min(player.hp * 0.45, 10);
          if (attacker && !attacker.hasSkill('jueqing')) {
            if (player.hasSkillTag('maixie') && jlsg.isGoodHp(player)) defense++;

            if (player.hasSkill('jieming')) defense += 4;
            if (player.hasSkills('yiji|jlsg_yiji')) defense += 4;
            if (player.hasSkill('guixin')) defense += 4;
            if (player.hasSkill('yuce')) defense += 2;
          }

          if (player.hasSkills('rende|rerende') && player.hp > 2) defense++;
          if (player.hasSkill('kuanggu') && player.hp > 1) defense += 0.2;
          if (player.hasSkill('tianming') && player.hp > 1) defense += 0.1;
          if (player.hasSkills('zaiqi|rezaiqi') && player.hp > 1) defense += 0.35;
          if (player.hp > jlsg.getBestHp(player)) defense += 0.8;
          if (player.hp <= 2) defense -= 0.4;
          if (player.hasSkill('tianxiang')) defense += player.countCards('h') * 0.5;

          if (player.countCards('e', 'tengjia') && jlsg.hasZhuqueEffect(attacker) && !attacker.hasSkill('unequip')) defense -= 0.6;
          if (player.isZhu) {
            defense -= 0.4;
            if (jlsg.isZhuInDanger()) defense -= 0.7;
          }
          if (player.isTurnedOver() && !player.hasSkill('jlsg_youxia')) defense -= 0.35;

          if (player.countCards('j', 'lebu') && !player.hasSkill('yanxiao2')) defense -= 0.15;
          if (player.countCards('j', 'bingliang') && !player.hasSkill('yanxiao2')) defense -= 0.15;
          if (player.countCards('j', 'caomu') && !player.hasSkill('yanxiao2')) defense -= 0.15;

          if ((attacker.hasSkill('roulin') && player.sex == 'female') || (attacker.sex == 'female' && player.hasSkill('roulin'))) defense = defense - 2.4;

          if (!jlsg.hasBaguaEffect(player)) {
            if (player.hasSkill('jijiu')) defense -= 3;
            if (player.hasSkill('dimeng')) defense -= 2.5;
            if (player.hasSkill('guzheng') && !jlsg.getCardsNum('shan', player, attacker)) defense -= 2.5;
            if (player.hasSkill('qiaobian')) defense -= 2.4;
            if (player.hasSkill('jieyin')) defense -= 2.3;
            if (player.hasSkills('lijian|jlsg_lijian')) defense -= 2.2;
          }
          return defense;
        },
        getDefense: function (player) {
          if (player == undefined || get.itemtype(player) != 'player') {
            return 0;
          }
          var current_player = _status.event.player;
          if (!current_player) return jlsg.getValue(player);

          var defense = jlsg.getValue(player);

          if (player.get('e', '2')) defense += 2;
          if (player.get('e', '3')) defense++;
          if (player.countCards('e', 'muniu') && player.get('e', '5').cards) defense += player.get('e', '5').cards.length;

          if (jlsg.hasBaguaEffect(player)) {
            if (player.hasSkill('tiandu')) defense++;
            if (player.hasSkill('leiji')) defense += 2;
            if (player.hasSkill('boss_leiji')) defense += 2;
            if (player.hasSkill('releiji')) defense += 2;
            if (player.hasSkill('hongyan')) defense += 2;
          }
          var maixie = jlsg.ai.skill.maixie_skill.split("|");
          for (var i = 0; i < maixie.length; i++) {
            if (player.hasSkill(maixie[i]) && jlsg.isGoodHp(player)) defense++;
          }

          if (player.hasSkill('jieming')) defense += 3;
          if (player.hasSkills('yiji|jlsg_yiji')) defense += 3;
          if (player.hasSkill('guixin')) defense += game.players.length - 1;
          if (player.hasSkill('yuce')) defense += 2;
          if (player.hasSkill('chengxiang')) defense++;

          if (player.hasZhuSkill('shichou')) {
            var current = jlsg.findPlayerBySkillName('shichou_dying');
            if (current) defense += current.hp;
          }

          if (player.hasSkill('rende') && player.countCards('h') > 1 && player.hp > 2) defense++;
          if (player.hasSkill('rerende') && player.countCards('h') > 1 && player.hp > 2) defense++;
          if (player.hasSkill('kuanggu') && player.hp > 1) defense += 0.5;
          if (player.hasSkill('diykuanggu') && player.hp > 1) defense += 0.5;
          if (player.hasSkill('zaiqi') && player.hp > 1) defense = defense + ((player.maxHp - player.hp) * 0.5);
          if (player.hasSkill('tianming')) defense += 0.5;
          if (player.hasSkill('keji')) defense += player.countCards('h') * 0.25;
          if (player.hasSkill('aocai') && _status.currentPhase !== player) defense += 0.5;
          if (player.hasSkill('tianxiang')) defense += player.countCards('h') * 0.5;

          if (player.hp > jlsg.getBestHp(player)) defense += 0.8;
          if (player.hp <= 2) defense = defense - 0.4;
          if (player.hasSkill('benghuai') && player.maxHp <= 5) defense--;
          if (player.hasSkills(jlsg.ai.skill.bad_skills)) defense--;

          if (player.isZhu) {
            defense = defense - 0.4;
            if (jlsg.isZhuInDanger()) defense = defense - 0.7;
          }

          var invaliditySkill = ['yijue', 'boss_hujia', 'retieji', 'pozhou', 'jlsg_zhenhun'];
          for (var i = 0; i < invaliditySkill.length; i++) {
            if (player.disabledSkills[invaliditySkill[i]] && player.disabledSkills[invaliditySkill[i]].length > 0)
              defense -= 5;
          }

          if (player.isTurnedOver()) defense--;

          if (player.countCards('j', 'lebu') && !player.hasSkill('yanxiao2')) defense -= 0.5;
          if (player.countCards('j', 'bingliang') && !player.hasSkill('yanxiao2')) defense -= 0.5;
          if (player.countCards('j', 'caomu') && !player.hasSkill('yanxiao2')) defense -= 0.5;

          if (player.hasSkill('jijiu')) defense += 2;
          if (player.hasSkill('qingnang')) defense += 2;
          if (player.hasSkill('dimeng')) defense += 2.5;
          if (player.hasSkill('guzheng')) defense += 2.5;
          if (player.hasSkill('qiaobian')) defense += 2.4;
          if (player.hasSkill('jieyin')) defense += 2.3;
          if (player.hasSkills('jlsg_lijian|lijian')) defense += 2.1;
          if (player.hasSkill('yishe')) defense += 2;
          if (player.hasSkill('paiyi')) defense += 1.5;
          if (player.hasSkill('yongsi')) defense += 2;

          defense = defense + (game.players.length - (get.distance(player, _status.currentPhase, 'absolute')) % game.players.length) / 4;

          defense = defense + player.get('s').length * 0.25;

          return defense;
        },
        findCardInCardPile: function (name) {
          var card;
          for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
            card = ui.cardPile.childNodes[i];
            if (typeof name == 'string') {
              if (card.name == name) {
                return card;
              }
            }
            else if (typeof name == 'function') {
              if (name(card)) {
                return card;
              }
            }
          }
          return null;
        },
        findCardInDiscardPile: function (name) {
          var cards = [];
          var card = false;
          for (var i = 0; i < ui.discardPile.childNodes.length; i++) {
            card = ui.discardPile.childNodes[i];
            if (typeof name == 'string') {
              if (card.name == name) {
                return card;
              }
            }
            else if (typeof name == 'function') {
              if (name(card)) {
                return card;
              }
            }
            else {
              cards = cards.concat(card);
            }
          }
          if (cards.length) return cards.randomGet();
          return null;
        },
        isZhuHealthy: function () {
          var zhu = get.zhu();
          if (!zhu) return false;
          var zhu_hp;
          if (zhu.hasSkill('benghuai') && zhu.hp > 4) {
            zhu_hp = 4;
          }
          else {
            zhu_hp = zhu.hp;
          }
          return zhu_hp > 3 || (zhu_hp > 2 && jlsg.getDefense(zhu) > 3);
        },
        isZhuInDanger: function () {
          var zhu = get.zhu();
          if (!zhu) return false;
          var zhu_hp;
          if (zhu.hasSkill('benghuai') && zhu.hp > 4) {
            zhu_hp = 4;
          }
          else {
            zhu_hp = zhu.hp;
          }
          return zhu_hp < 3;
        },
        findPlayerBySkillName: function (skills) {
          return game.findPlayer(function (player) {
            return player.hasSkills(skills);
          });
        },
        isFriend: function (other, another) {
          return get.attitude(other, another) > 0;
        },
        isEnemy: function (other, another) {
          return get.attitude(other, another) < 0;
        },
        getFriends: function (player) {
          return game.filterPlayer(function (target) {
            return jlsg.isFriend(player, target);
          });
        },
        getFriendsNoself: function (player) {
          return game.filterPlayer(function (target) {
            return jlsg.isFriend(player, target) && player != target;
          });
        },
        getEnemies: function (player) {
          return game.filterPlayer(function (target) {
            return jlsg.isEnemy(player, target);
          });
        },
        filterFriend: function (player, func) {
          var friends = jlsg.getFriends(player);
          for (var i = 0; i < friends.length; i++) {
            if (func(friends[i])) {
              return game.players[i];
            }
          }
          return null;
        },
        filterFriends: function (player, func) {
          var list = [];
          var friends = jlsg.getFriends(player);
          for (var i = 0; i < friends.length; i++) {
            if (func(friends[i])) {
              list.push(game.players[i]);
            }
          }
          return list;
        },
        filterEnemy: function (player, func) {
          var enemies = jlsg.getEnemies(player);
          for (var i = 0; i < enemies.length; i++) {
            if (func(enemies[i])) {
              return game.players[i];
            }
          }
          return null;
        },
        filterEnemies: function (player, func) {
          var list = [];
          var enemies = jlsg.getEnemies(player);
          for (var i = 0; i < enemies.length; i++) {
            if (func(enemies[i])) {
              list.push(game.players[i]);
            }
          }
          return list;
        },
        countFriends: function (player) {
          return game.countPlayer(function (target) {
            return jlsg.isFriend(player, target) && target != player;
          });
        },
        countEnemies: function (player) {
          return game.countPlayer(function (target) {
            return jlsg.isEnemy(player, target);
          });
        },
        countNextEmenies: function (from, to) {
          var num = 0;
          var current = from.getNext();
          for (var i = 0; i < 10 && current != to; i++) {
            if (jlsg.isEnemy(to, current)) {
              num++;
            }
            current = current.getNext();
          }
          return num;
        },
        getNextEmenies: function (from, to) {
          var list = [];
          var current = from.getNext();
          for (var i = 0; i < 10 && current != to; i++) {
            if (jlsg.isEnemy(to, current)) {
              list.push(current);
            }
            current = current.getNext();
          }
          return list;
        },
        countCanShaMe: function (player) {
          return game.countPlayer(function (target) {
            return jlsg.isEnemy(player, target) && target.canUse('sha', player) && get.effect(target, { name: 'sha' }, player) > 0;
          });
        },
        getCanShaMe: function (player) {
          return game.filterPlayer(function (target) {
            return jlsg.isEnemy(player, target) && target.canUse('sha', player) && get.effect(player, { name: 'sha' }, target) > 0;
          });
        },
        getWillShaTarget: function (player) {
          var target = game.filterPlayer(function (target1) {
            return player.canUse('sha', target1) && get.effect(target1, { name: 'sha' }, player) > 0;
          });
          target.sort(function (a, b) {
            return get.effect(a, { name: 'sha' }, player) < get.effect(a, { name: 'sha' }, player);
          });
          return target[0];
        },
        getCardsNum: function (class_name, player, from) {
          if (player == undefined || get.itemtype(player) != 'player') player = _status.event.player;
          var cards = player.get('h');
          if (player.countCards('e', 'muniu') && player.get('e', '5').cards && player.get('e', '5').cards.length) {
            cards = cards.concat(player.get('e', '5').cards);
          }
          var num = 0, shownum = 0, redtao = 0, redsha = 0, rencard = 0, blackcard = 0, blackwuxie = 0, equipwuxie = 0;
          var equipcard = 0, heartsha = 0, hearttao = 0, spadewuxie = 0, spadejiu = 0, spadecard = 0, diamondcard = 0;
          var clubcard = 0, shashan = 0, jiunum = 0;
          var forbid = false;
          if (!from && _status.event.player != player) forbid = true;
          from = from || _status.event.player;
          for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            if (!forbid && player == from) {
              shownum++;
              if (card.name == class_name) num++;
              if (card.name == 'jiu') jiunum++;
              if (get.type(card) == 'equip') equipcard++;
              if (card.name == 'sha' || card.name == 'shan') shashan++;
              if (get.color(card) == 'red') {
                rencard++;
                if (card.name != 'sha') redsha++;
                if (card.name != 'tao') redtao++;
              }
              if (get.color(card) == 'black') {
                blackcard++;
                if (card.name != 'wuxie') blackwuxie++;
              }
              if (get.suit(card) == 'heart') {
                if (card.name != 'sha') heartsha++;
                if (card.name != 'tao') redtao++;
              }
              if (get.suit(card) == 'spade') {
                if (card.name != 'wuxie') spadewuxie++;
                if (card.name != 'jiu') spadejiu++;
              }
              if (get.suit(card) == 'diamond' && card.name != 'sha') diamondcard++;
              if (get.suit(card) == 'club') clubcard++;
            }
          }
          var ecards = player.get('e');
          for (var i = 0; i < ecards.length; i++) {
            var card = ecards[i];
            equipcard++;
            if (player.countCards('h') > player.hp) equipwuxie++;
            if (get.color(card) == 'red') {
              redtao++; redsha++;
            }
            if (get.suit(card) == 'heart') hearttao++;
            if (get.suit(card) == 'spade') spadecard++;
            if (get.suit(card) == 'diamond') diamondcard++;
            if (get.suit(card) == 'club') clubcard++;
          }
          if (class_name == 'sha') {
            var shanum;
            if (player.hasSkill('wusheng')) {
              shanum = redsha + num + (player.countCards('h') - shownum) * 0.69;
            }
            if (player.hasSkill('shizhi') && player.hp == 1) {
              shanum = shashan + (player.countCards('h') - shownum) * 0.3;
            }
            else if (player.hasSkill('wushen')) {
              shanum = heartsha + num + (player.countCards('h') - shownum) * 0.5;
            }
            else if (player.hasSkill('jinjiu')) {
              shanum = jiunum + num + (player.countCards('h') - shownum) * 0.5;
            }
            else if (player.hasSkills('longhun|jlsg_longhun')) {
              shanum = diamondcard + num + (player.countCards('h') - shownum) * 0.5;
            }
            else if (player.hasSkill('nos_gongji')) {
              shanum = equipcard + num + (player.countCards('h') - shownum) * 0.5;
            }
            else if (player.hasSkills('longdan|chixin')) {
              shanum = shashan + (player.countCards('h') - shownum) * 0.72;
            }
            else if (player.countCards('e', 'zhangba')) {
              shanum = num + (player.countCards('h') - shownum) * 0.2;
            }
            else {
              shanum = num + (player.countCards('h') - shownum) * 0.35;
            }
            return (jlsg.hasWushuangEffect(player) && shanum * 2) || shanum;
          }
          else if (class_name == 'shan') {
            if (player.hasSkill('qingguo')) {
              return blackcard + num + (player.countCards('h') - shownum) * 0.8;
            }
            else if (player.hasSkills('longdan|chixin')) {
              return shashan + (player.countCards('h') - shownum) * 0.72;
            }
            else if (player.hasSkills('longhun|jlsg_longhun')) {
              return clubcard + num + (player.countCards('h') - shownum) * 0.65;
            }
            else if (player.hasSkill('jieyue3')) {
              return rencard + num + (player.countCards('h') - shownum) * 0.5;
            }
            else {
              return num + (player.countCards('h') - shownum) * 0.6;
            }
          }
          else if (class_name == 'tao') {
            if (player.hasSkill('jijiu')) {
              return num + redtao + (player.countCards('h') - shownum) * 0.6;
            }
            else if (player.hasSkills('longhun|jlsg_longhun')) {
              return hearttao + num + (player.countCards('h') - shownum) * 0.5;
            }
            else {
              return num;
            }
          }
          else if (class_name == 'jiu') {
            if (player.hasSkill('jiuchi')) {
              return num + spadejiu + (player.countCards('h') - shownum) * 0.3;
            }
            else if (player.hasSkill('jiushi')) {
              return num + 1;
            }
            else {
              return num;
            }
          }
          else if (class_name == 'wuxie') {
            if (player.hasSkill('kanpo')) {
              return num + blackwuxie + (player.countCards('h') - shownum) * 0.5;
            }
            else if (player.hasSkill('yanzheng')) {
              return num + equipwuxie;
            }
            else if (player.hasSkill('ruzong')) {
              return num * 3;
            }
            else {
              return num;
            }
          }
          else {
            return num;
          }
        },
        getCards: function (name, player) {
          player = player || _status.event.player;
          return player.countCards('he', name);
        },
      };
      if (!lib.config["extension_极略_initEnable"]) {
        game.saveConfig("extension_极略_initEnable", true);
        game.saveConfig('characters', lib.config.characters.concat('jlsg_sk', 'jlsg_sr', 'jlsg_soul', 'jlsg_sy'));
        lib.config.characters
      }
      lib.jlsg = jlsg;
      window.jlsg = jlsg;
      console.timeEnd(_status.extension + 'pre');
    },
    config: {
      srlose: {
        name: "srlose",
        intro: "是否要求SR武将弃置技能",
        init: true,
      },
      qsRelic: {
        name: "七杀宝物特殊规则",
        intro: "锁定技，当你同时装备了七杀宝物、进攻马与防御马时，你选择将你装备区中的一张坐骑或是七杀宝物置入弃牌堆。",
        init: false,
      },
      jlsg_identity_music_image: {
        name: "身份模式背景＆音乐",
        init: false
      },
      jlsg_boss_music_image: {
        name: "挑战模式背景＆音乐",
        init: false
      },
      simple_name: {
        name: '武将前缀',
        intro: '选择是否显示SK、SR、SC武将前缀',
        init: 'hide',
        item: {
          hide: '隐藏',
          show: '显示',
        }
      },
      oldCharacterReplace: {
        name: '旧版替换',
        intro: '设置是否将本扩展某些武将的技能替换为旧版极略三国的武将技能',
        init: false,
      },
      debug: {
        name: "<span style='color:#808080'>debug</span>",
        intro: "禁用所有其他武将包 <span style='color:#FF0000'>测试用！</span>",
        init: false,
      }
    },
    help: {
      "极略": `\
本拓展基于民间极略的某魔改版，因为当时那位作者说“修复了所有的bug”<br>
事实证明这种说法比较离谱<br>
需要打开武将包才能看到对应的武将图片<br>
主要在两个QQ群中发布更新<br>
无名杀官方群Ⅱ 348943983 (推荐)<br>
无名杀极略拓展交流群 915469500<br>
无名杀扩展极略自用交流群 574935857(已死)<br>
——xiaoas`
    },
    package: {
      character: {
        character: {},
        translate: {},
      },
      card: {
        card: {},
        translate: {},
        list: [],
      },
      skill: {
        skill: {},
        translate: {},
      },
      intro: `<div>\
<img src="${lib.assetURL}extension/极略/logo.webp" alt="极略三国"\
style="width:100%;text-align:center;font-size:larger;font-family: 'STXinwei','xinwei';"\
onclick="if (lib.jlsg) lib.jlsg.showRepoElement(this)"></img>
<ul><li>极略全部武将·附带七杀卡包+极略三英武将，不需要请记得关闭。<li>帮助中查看更多内容</ul>
<a onclick="if (jlsg) jlsg.checkUpdate(this)" style="cursor: pointer;text-decoration: underline;font-weight: bold;">
检查更新Beta<br></a>
</div>`,
      author: "可乐，赵云，青冢，萧墨(17岁)",
      diskURL: "",
      forumURL: "",
      mirrorURL: "https://github.com/xiaoas/jilue",
      version: "2.4.0317",
      changelog: `
<a onclick="if (jlsg) jlsg.showRepo()" style="cursor: pointer;text-decoration: underline;">
Visit Repository</a><br>
新QQ群：392224094<br>
2022.03.18更新<br>
&ensp; 更新武将<div style="display:inline; font-family: xingkai, xinwei;" data-nature="metalmm">SK董白</div><br>
&ensp; 更新武将<div style="display:inline; font-family: xingkai, xinwei;" data-nature="woodmm">SK徐氏</div><br>
&ensp; 优化SK黄月英 木牛 流马 UX<br>
&ensp; 修复SR孙权 权衡 雄略<br>
&ensp; 修复SK戏志才 竭心 描述<br>
&ensp; 优化SK全琮 邀名 UX。<br>
&ensp; 修复同心语音 修复SK鲍三娘 性别<br>
<span style="font-size: large;">历史：</span><br>
2022.02.15更新<br>
&ensp; 更新武将<div style="display:inline; font-family: xingkai, xinwei;" data-nature="soilmm">SK关索</div><br>
&ensp; 更新武将<div style="display:inline; font-family: xingkai, xinwei;" data-nature="soilmm">SK鲍三娘</div><br>
&ensp; 修复SK卞夫人 母仪 暗将触发。<br>
&ensp; 修复部分获得牌的技能无法触发毒。<br>
&ensp; 修复SR司马懿 鬼才 无法触发天妒。<br>
&ensp; 修复七杀包 欲擒故纵 描述。<br>
&ensp; 优化SR郭嘉 天殇 UX。<br>
&ensp; 修复多个限定技的技能标识。<br>
&ensp; 优化SK张任 伏射 UX。<br>
&ensp; 优化SK于吉 蛊惑 使用延时锦囊。<br>
&ensp; 优化SR刘备 仇袭 AI。<br>
`
      ,
    }, files: { "character": [], "card": [], "skill": [] }
  }
})