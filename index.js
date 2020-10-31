const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.argv.length == 2 ? process.env.token : "";
const moment = require("moment");
require("moment-duration-format");
const momenttz = require('moment-timezone');
const welcomeChannelName = "👋ㅣ환영합니다";
const byeChannelName = "👋ㅣ환영합니다";
const welcomeChannelComment = "```👋ㅣ본 서버에 오신것을 환영합니다. 규칙은 #📜ㅣ규칙 채널을 확인바라며, 꼭 숙지 부탁드립니다.```";
const byeChannelComment = " ```👋ㅣ다음에도 또 뵈면 좋겠습니다. 안녕히가십시오.```";
const adminUserId = 250693463065100298;

client.on('ready', () => {
  console.log('켰다.');
  client.user.setPresence({ game: { name: '❎ㅣ11월 패치' }, status: 'dnd' })

  let state_list = [
    '!help',
    '도움말 !help',
    'Wjddnjs Bot',
  ]
  let state_list_index = 1;
  let change_delay = 30000; // 이건 초입니당. 1000이 1초입니당.

  function changeState() {
    setTimeout(() => {
      // console.log( '상태 변경 -> ', state_list[state_list_index] );
      client.user.setPresence({ game: { name: state_list[state_list_index] }, status: 'online' })
      state_list_index += 1;
      if(state_list_index >= state_list.length) {
        state_list_index = 0;
      }
      changeState()
    }, change_delay);
  }

  // changeState();
});

client.on("guildMemberAdd", (member) => {
  const guild = member.guild;
  const newUser = member.user;
  const welcomeChannel = guild.channels.find(channel => channel.name == welcomeChannelName);

  welcomeChannel.send(`<@${newUser.id}> ${welcomeChannelComment}\n`);

  member.addRole(guild.roles.find(role => role.name == "[ 평민 ]"));
});

client.on("guildMemberRemove", (member) => {
  const guild = member.guild;
  const deleteUser = member.user;
  const byeChannel = guild.channels.find(channel => channel.name == byeChannelName);

  byeChannel.send(`<@${deleteUser.id}> ${byeChannelComment}\n`);
});

client.on("messageUpdate", (message) => {
  MessageSave(message, true)
});

client.on('message', (message) => {
  MessageSave(message)
  if(message.author.bot) return;

  if(message.channel.type == 'dm') {
    if(message.author.id == adminUserId) return;

    /* not use embed */
    let msg = message.author+'이(가) 메세지를 보냈습니다.\n'+message.content;
    client.users.find(x => x.id == adminUserId).send(msg)

    // /* use embed */
    // let embed = new Discord.RichEmbed()
    // let img = message.author.avatar ? `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp?size=256` : undefined;
    // let user = message.author.username+'#'+message.author.discriminator
    // let msg = message.content;
    // embed.setColor('#186de6')
    // embed.setAuthor(user+'이(가) 메세지를 보냈습니다.', img)
    // embed.setFooter(`콜라곰 BOT ❤️`)
    // embed.addField('메세지 내용', msg, true);
    // embed.setTimestamp()
    // client.users.find(x => x.id == adminUserId).send(embed);
  }

  if(message.content.startsWith('!역할추가')) {
    if(message.channel.type == 'dm') {
      return message.reply('❌ㅣdm에서 사용할 수 없는 명령어 입니다.');
    }
    if(message.channel.type != 'dm' && checkPermission(message)) return

    if(message.content.split('<@').length == 3) {
      if(message.content.split(' ').length != 3) return;

      var userId = message.content.split(' ')[1].match(/[\u3131-\uD79D^a-zA-Z^0-9]/ugi).join('')
      var role = message.content.split(' ')[2].match(/[\u3131-\uD79D^a-zA-Z^0-9]/ugi).join('')

      message.member.guild.members.find(x => x.id == userId).addRole(role);
    }
  }

  if(message.content == 'ping') {
    return message.reply('✅ㅣ현재 봇은 `정상` 상태입니다.');
  }

  if(message.content == '밥상 키') {
    return message.reply('🧍🏻ㅣ밥상 키는 쏘대장보다 2cm 작은, 145cm 입니다.');
  }

  if(message.content == '밥상 애미') {
    return message.reply('🧍🏻ㅣ밥상 애미는 김치, 김치찌개, 닭볶음탕, 미역국, 사골곰탕, 콩나물국 장인입니다.');
  }

  if(message.content == '태승 몸무게') {
    return message.reply('🧍🏻ㅣ태승의 몸무게는 1T 입니다.');
  }
  
  if(message.content == '네이버') {
    return message.reply('🌐ㅣ네이버의 주소는 다음과 같습니다. https://naver.com/');
  }

  if(message.content == '코로나') {
    return message.reply('🌐ㅣ코로나의 정보는 다음과 같습니다. http://ncov.mohw.go.kr/');
  }
  
  if(message.content == '밥상 애비') {
    return message.reply('🧍🏻ㅣ밥상 애비는 잘생겼습니다.');
  }

  if(message.content == '할로윈') {
    return message.reply('🎃ㅣ할로윈을 맞이하여 자그만 선물을 준비하였습니다 !! `정원#1566`으로 디엠주시면 월요일 맛있는 사탕이 기다릴겁니다 !! ( 남중 권한 소지자, 혹은 주변 거주자만 가능하며, 선착순 3명임을 알려드립니다. ) @here');
  }

  if(message.content == '유튜브') {
    return message.reply('🌐ㅣ유튜브의 주소는 다음과 같습니다. https://youtube.com/');
  

  }if(message.content == '!봇 상태') {
    let embed = new Discord.RichEmbed()
    let img = 'https://cdn.discordapp.com/icons/419671192857739264/6dccc22df4cb0051b50548627f36c09b.webp?size=256';
    var duration = moment.duration(client.uptime).format(" D [일], H [시간], m [분], s [초]");
    embed.setColor('#186de6')
    embed.setAuthor('🤖ㅣBot information ( By Wjddnjs )', img)
    embed.setFooter(`🤖ㅣWjddnjs Bot`)
    embed.addBlankField()
    embed.addField('RAM usage',    `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true);
    embed.addField('running time', `${duration}`, true);
    embed.addField('user',         `${client.users.size.toLocaleString()}`, true);
    embed.addField('server',       `${client.guilds.size.toLocaleString()}`, true);
    // embed.addField('channel',      `${client.channels.size.toLocaleString()}`, true);
    embed.addField('Discord.js',   `v${Discord.version}`, true);
    embed.addField('Node',         `${process.version}`, true);
    
    let arr = client.guilds.array();
    let list = '';
    list = `\`\`\`css\n`;
    
    for(let i=0;i<arr.length;i++) {
      // list += `${arr[i].name} - ${arr[i].id}\n`
      list += `${arr[i].name}\n`
    }
    list += `\`\`\`\n`
    embed.addField('list:',        `${list}`);

    embed.setTimestamp()
    message.channel.send(embed);
  }

  if(message.content == 'embed') {
    let img = 'https://cdn.discordapp.com/icons/419671192857739264/6dccc22df4cb0051b50548627f36c09b.webp?size=256';
    let embed = new Discord.RichEmbed()
      .setTitle('Wjddnjs Bot')
      .setURL('http://www.naver.com')
      .setAuthor('정원', img, 'http://www.naver.com')
      .setThumbnail(img)
      .addBlankField()
      .addField('본 서버 규칙입니다.', '📜ㅣ규칙')
      .addBlankField()
      .setTimestamp()
      .setFooter('🙇🏻ㅣ정원#1566이 만듬', img)

    message.channel.send(embed)
  } else if(message.content == '!help') {
    let helpImg = 'https://images-ext-1.discordapp.net/external/RyofVqSAVAi0H9-1yK6M8NGy2grU5TWZkLadG-rwqk0/https/i.imgur.com/EZRAPxR.png';
    let commandList = [
      {name: '!help', desc: '도움말을 확인할 수 있습니다.'},
      {name: 'ping', desc: '현재 핑 상태를 확인할 수 있습니다.'},
      {name: `!봇 상태`, desc: `봇의 상세적인 상태를 볼 수 있습니다.`},
      {name: '!청소', desc: '텍스트를 지울 수 있습니다.'},
      {name: `네이버`, desc: `네이버의 주소를 알 수 있습니다.`},
      {name: `코로나`, desc: `한국 및 세계 코로나의 확진자 현황을 알 수 있습니다.`},
      {name: `유튜브`, desc: `유튜브의 주소를 알 수 있습니다.`}
    ];
    let commandStr = '';
    let embed = new Discord.RichEmbed()
      .setAuthor('Help ( By Wjddnjs )', helpImg)
      .setColor('#186de6')
      .setFooter(`🙇🏻ㅣWjddnjs Bot`)
      .setTimestamp()
    
    commandList.forEach(x => {
      commandStr += `• \`\`${changeCommandStringLength(`${x.name}`)}\`\` : **${x.desc}**\n`;
    });

    embed.addField('Commands: ', commandStr);

    message.channel.send(embed)
  } else if(message.content == '!초대코드2') {
    client.guilds.array().forEach(x => {
      x.channels.find(x => x.type == 'text').createInvite({maxAge: 0}) // maxAge: 0은 무한이라는 의미, maxAge부분을 지우면 24시간으로 설정됨
        .then(invite => {
          message.channel.send(invite.url)
        })
        .catch((err) => {
          if(err.code == 50013) {
            message.channel.send('**'+x.channels.find(x => x.type == 'text').guild.name+'** ❌ㅣ채널 권한이 없어 초대코드 발행 실패')
          }
        })
    });
  } else if(message.content == '!초대코드') {
    if(message.channel.type == 'dm') {
      return message.reply('❌ㅣdm에서 사용할 수 없는 명령어 입니다.');
    }
    message.guild.channels.get(message.channel.id).createInvite({maxAge: 0}) // maxAge: 0은 무한이라는 의미, maxAge부분을 지우면 24시간으로 설정됨
      .then(invite => {
        message.channel.send(invite.url)
      })
      .catch((err) => {
        if(err.code == 50013) {
          message.channel.send('**'+message.guild.channels.get(message.channel.id).guild.name+'** ❌ㅣ채널 권한이 없어 초대코드 발행 실패')
        }
      })
  } else if(message.content.startsWith('!전체공지2')) {
    if(checkPermission(message)) return
    if(message.member != null) { // 채널에서 공지 쓸 때
      let contents = message.content.slice('!전체공지2'.length);
      let embed = new Discord.RichEmbed()
        .setAuthor('🙇🏻ㅣ공지 ( By Wjddnjs )')
        .setColor('#186de6')
        .setFooter(`🤖ㅣWjddnjs Bot`)
        .setTimestamp()
  
      embed.addField('공지: ', contents);
  
      message.member.guild.members.array().forEach(x => {
        if(x.user.bot) return;
        x.user.send(embed)
      });
  
      return message.reply('✅ㅣ전체 공지를 정상적으로 전송하였습니다.');
    } else {
      return message.reply('❌ㅣ채널에서 실행해주시길 바랍니다.');
    }
  } else if(message.content.startsWith('!전체공지')) {
    if(checkPermission(message)) return
    if(message.member != null) { // 채널에서 공지 쓸 때
      let contents = message.content.slice('!전체공지'.length);
      message.member.guild.members.array().forEach(x => {
        if(x.user.bot) return;
        x.user.send(`<@${message.author.id}> ${contents}`);
      });
  
      return message.reply('✅ㅣ전체 공지를 정상적으로 전송하였습니다.');
    } else {
      return message.reply('❌ㅣ채널에서 실행해주시길 바랍니다.');
    }
  } else if(message.content.startsWith('!청소')) {
    if(message.channel.type == 'dm') {
      return message.reply('❌ㅣdm에서 사용할 수 없는 명령어 입니다.');
    }
    
    if(message.channel.type != 'dm' && checkPermission(message)) return

    var clearLine = message.content.slice('!청소 '.length);
    var isNum = !isNaN(clearLine)

    if(isNum && (clearLine <= 0 || 100 < clearLine)) {
      message.channel.send("❌ㅣ1부터 100까지의 숫자만 입력해주세요.")
      return;
    } else if(!isNum) { // c @나긋해 3
      if(message.content.split('<@').length == 2) {
        if(isNaN(message.content.split(' ')[2])) return;

        var user = message.content.split(' ')[1].split('<@!')[1].split('>')[0];
        var count = parseInt(message.content.split(' ')[2])+1;
        let _cnt = 0;

        message.channel.fetchMessages().then(collected => {
          collected.every(msg => {
            if(msg.author.id == user) {
              msg.delete();
              ++_cnt;
            }
            return !(_cnt == count);
          });
        });
      }
    } else {
      message.channel.bulkDelete(parseInt(clearLine)+1)
        .then(() => {
          AutoMsgDelete(message, `<@${message.author.id}> ` + parseInt(clearLine) + "개의 메시지를 삭제했습니다. ```(이 메세지는 잠시 후에 사라집니다.)```");
        })
        .catch(console.error)
    }
  } else if(message.content.startsWith('!강퇴')) {
    if(message.channel.type == 'dm') {
      return message.reply('❌ㅣdm에서 사용할 수 없는 명령어 입니다.');
    }
    
    if(message.channel.type != 'dm' && checkPermission(message)) return

    console.log(message.mentions);

    let userId = message.mentions.users.first().id;
    let kick_msg = message.author.username+'#'+message.author.discriminator+'이(가) 강퇴시켰습니다.';
    
    message.member.guild.members.find(x => x.id == userId).kick(kick_msg)
  } else if(message.content.startsWith('!밴')) {
    if(message.channel.type == 'dm') {
      return message.reply('❌ㅣdm에서 사용할 수 없는 명령어 입니다.');
    }
    
    if(message.channel.type != 'dm' && checkPermission(message)) return

    console.log(message.mentions);

    let userId = message.mentions.users.first().id;
    let kick_msg = message.author.username+'#'+message.author.discriminator+'이(가) 강퇴시켰습니다.';

    message.member.guild.members.find(x => x.id == userId).ban(kick_msg)
  }
});

function checkPermission(message) {
  if(!message.member.hasPermission("MANAGE_MESSAGES")) {
    message.channel.send(`<@${message.author.id}> ` + "❌ㅣ명령어를 수행할 관리자 권한을 소지하고 있지않습니다.")
    return true;
  } else {
    return false;
  }
}

function changeCommandStringLength(str, limitLen = 8) {
  let tmp = str;
  limitLen -= tmp.length;

  for(let i=0;i<limitLen;i++) {
      tmp += ' ';
  }

  return tmp;
}

async function AutoMsgDelete(message, str, delay = 3000) {
  let msg = await message.channel.send(str);

  setTimeout(() => {
    msg.delete();
  }, delay);
}

function getEmbedFields(message, modify=false) {
  if(message.content == '' && message.embeds.length > 0) {
    let e = message.embeds[0].fields;
    let a = [];

    for(let i=0;i<e.length;i++) {
        a.push(`\`${e[i].name}\` - \`${e[i].value}\`\n`);
    }

    return a.join('');
  } else if(modify) {
    return message.author.lastMessage.content;
  } else {
    return message.content;
  }
}

function MessageSave(message, modify=false) {
  imgs = []
  if (message.attachments.array().length > 0) {
    message.attachments.array().forEach(x => {
      imgs.push(x.url+'\n')
    });
  }

  username = message.author.username.match(/[\u3131-\uD79D^a-zA-Z^0-9]/ugi)
  channelName = message.channel.type != 'dm' ? message.channel.name : ''
  try {
    username = username.length > 1 ? username.join('') : username
  } catch (error) {}

  try {
    channelName = channelName.length > 1 ? channelName.join('') : channelName
  } catch (error) {}
}

client.login(token);