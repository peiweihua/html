var homePage = document.getElementsByClassName('homePage')[0];
var playPage = document.getElementsByClassName('playPage')[0];
var searchPage = document.getElementsByClassName('searchPage')[0];
var morePage = document.getElementsByClassName('morePage')[0];
var delBox = document.getElementsByClassName('del-box')[0];
var player = document.getElementById('player');
var back = document.getElementById('back');
var currPage = [homePage,'homePage'];
var playSongList = [];
var isplay = false;

document.addEventListener('click',function(e){
	e.stopPropagation();
	e.preventDefault();
})
/*=======首页=======*/
OhomePage(json_data_t,'热歌榜','json_data_t');
OhomePage(json_data_f,'流行榜','json_data_f');
OhomePage(json_data_w,'网络歌曲','json_data_w');
OhomePage(json_data_g,'港台歌曲','json_data_g');
OhomePage(json_data_n,'内地歌曲','json_data_n');
//生成首页页面
function OhomePage(obj,title,id){
	var songArr = obj.showapi_res_body.pagebean.songlist;
	var str = '<div class="center">';
		str += '<div>';
			str += '<div class="ovf title">';
				str += '<h4 class="float-l">'+title+'</h4>';
				str += '<div class="float-r" id="'+id+'"><a>更多&gt;&gt;</a></div>'
			str += '</div>'
			str += '<ul class="ovf song-tj">';
				for(var i = 0; i < 9; i++){
					str += '<li class="float-l" onclick="playListAddSong(this);" data-arr="' + id +'" data-i = "' + i + '">';
						str += '<a>';
							str += '<div><img src="'+ songArr[i].albumpic_big +'" width="100%" height="auto"/></div>';
							str += '<div><span>'+songArr[i].songname+'</span></div>';
						str += '</a>';
					str += '</li>';
				}
			str += '</ul>';
		str += '</div>';
	str += '</div>';
	homePage.innerHTML += str;
}
function $(id){
	return document.getElementById(id);
}
$('json_data_t').addEventListener('click',function(){
	songList(json_data_t,morePage,'json_data_t');
});
$('json_data_f').addEventListener('click',function(){
	songList(json_data_f,morePage,'json_data_f');
});
$('json_data_w').addEventListener('click',function(){
	songList(json_data_w,morePage,'json_data_w');
});
$('json_data_g').addEventListener('click',function(){
	songList(json_data_g,morePage,'json_data_g');
});
$('json_data_n').addEventListener('click',function(){
	songList(json_data_n,morePage,'json_data_n');
});
//生成更多歌曲列表
function songList(obj,e,id){
	e.innerHTML = '';
	var songArr = obj.showapi_res_body.pagebean.songlist;
	var str = e.innerHTML;
		str += '<div class="center">';
			str += '<ul class="msg-box">';
				for(var i = 0; i < 16; i++){
					str += '<li onclick="playListAddSong(this);" data-arr="' + id +'" data-i = "' + i + '">';
						str += '<div class="float-l">';
							str += '<img src="'+ songArr[i].albumpic_small +'" width="40" height="40"/>';
						str += '</div>';
						str += '<div class="msg">';
							str += '<h5>'+songArr[i].songname+'</h5>';
							str += '<p>'+songArr[i].singername+'</p>';
						str += '</div>';
					str += '</li>';
				}
			str += '</ul>';
		str += '</div>';
	e.innerHTML = str;
	currPage[0].className = currPage[1] + ' pageToLeft';
	morePage.className = 'morePage pageFromRight';
	back.style.display = 'block';
	currPage = [morePage,'morePage'];
	back.addEventListener('click',function(e){
		e.stopPropagation();
		e.preventDefault();
		currPage[0].className = currPage[1] + ' pageToRight';
		homePage.className = 'homePage pageFromLeft';
		back.style.display = 'none';
		currPage = [homePage,'homePage'];
	});
}
function pageQh(e){
	switch(e){
		case 1:
			//要么当前页就是本页
			//return;
			if(currPage[0]===homePage){
				return;
			}
			//要么当前页是其他页
			//1.当前页去右侧
			currPage[0].className = currPage[1] + ' pageToRight';
			//2.首页从左侧进入
			homePage.className = 'homePage pageFromLeft';
			//3.去掉返回按钮
			back.style.display = 'none';
			//4.让前页等于home页
			currPage = [homePage,'homePage'];
			break;
		case 2:
			if(currPage[0]===playPage){
				return;
			}
			if(currPage[0]===homePage){
				//1.播放页从右侧进入
				playPage.className = 'playPage pageFromRight';
				//2.当前页滚粗
				currPage[0].className = currPage[1] + ' pageToLeft';
			}
			else if(currPage[0]===searchPage){
				currPage[0].className = currPage[1] + ' pageToRight';
				playPage.className = 'playPage pageFromLeft';
			}
			else if(currPage[0]===morePage){
				back.style.display = 'none';
				playPage.className = 'playPage pageFromRight';
				currPage[0].className = currPage[1] + ' pageToLeft';				
			}
			//3.当前页重新赋值
			currPage = [playPage,'playPage'];
			break;
		case 3:
			if(currPage[0]===searchPage){
				return;
			}
			back.style.display = 'none';
			//1.搜索页从右侧进来
			searchPage.className = 'searchPage pageFromRight';
			//2.当前页滚粗
			currPage[0].className = currPage[1] + ' pageToLeft';
			//3.当前页重新赋值
			currPage = [searchPage,'searchPage'];
			break;
	}
	
}
function playList(index,endTime){
	index = index||0;
	var songName = 'null';
	var singername = 'null';
	var startTime = '00:00:00';
	endTime = endTime||'00:00:00';
	playPage.innerHTML = '';
	if(playSongList.length){
		songName = playSongList[index].songname;
		singername = playSongList[index].singername;
	}
	var str = '<div class="center">';
			str += '<div class="controlBox">';
				str += '<ul class="msg-box">';
					str += '<li>';
						if(playSongList.length){
							str += '<div class="float-l songCover" style="background-image: url('+playSongList[index].albumpic_small+');"></div>';
						}
						else{
							str += '<div class="float-l songCover"></div>';
						}
						str += '<div class="msg">';
							str += '<h5>'+songName+'</h5>';
							str += '<p>'+singername+'</p>';
						str += '</div>';
					str += '</li>';
				str += '</ul>';
				str += '<div class="ovf">';
					str += '<div class="out">';
						str += '<div class="inner" id="innerLine"></div>';
					str += '</div>';
					str += '<div class="float-l" id="startTime">'+startTime+'</div>';
					str += '<div class="float-r" id="endTime">'+endTime+'</div>';
				str += '</div>';
				str += '<div class="playBtn">';
					str += '<button id="playAndpause">暂停</button>';
					str += '<button id="lastSong">上一曲</button>';
					str += '<button id="nextSong">下一曲</button>';
				str += '</div>';
			str += '</div>';
			str += '<ul class="msg-box">';
				for(var i = 0; i < playSongList.length; i++){
					str += '<li ontouchstart="langClick(this)" data-i="'+ i +'">';
						str += '<div class="float-l">';
							str += '<img src="' + playSongList[i].albumpic_small + '" width="40" height="40"/>';
						str += '</div>';
						str += '<div class="msg">';
							str += '<h5>'+playSongList[i].songname+'</h5>';
							str += '<p>'+playSongList[i].singername+'</p>';
						str += '</div>';
					str += '</li>';
				}
			str += '</ul>';
		str += '</div>';
	playPage.innerHTML += str;
	function formatTime(t){
		var h = 0,m = 0,s = 0;
		h = Math.floor(t/3600);
		m = Math.floor((t-h*3600)/60);
		s = Math.floor(t%60);
		h = h>9?h:'0'+h;
		m = m>9?m:'0'+m;
		s = s>9?s:'0'+s;
		return (h + ':' + m + ':' + s);
	}
	var playdata = function(){
		endTime = Math.ceil(player.duration);
		endTime = formatTime(endTime);
		document.getElementById('endTime').innerHTML = endTime;
		player.removeEventListener('canplaythrough',playdata);
	}
	var playtimeupdate = function(){
		if(startTime == Math.ceil(player.currentTime)){
			return;
		}
		startTime = Math.ceil(player.currentTime);
		startTime = formatTime(startTime);
		document.getElementById('startTime').innerHTML = startTime;
		document.getElementById('innerLine').style.width = Math.ceil(player.currentTime)/Math.ceil(player.duration)*100 + '%';
		player.addEventListener('abort',function(){
			player.removeEventListener('timeupdate',playtimeupdate);
		})
	}
	player.addEventListener('canplaythrough',playdata);
	player.addEventListener('timeupdate',playtimeupdate);
	player.addEventListener('ended',playNextSong);
	document.getElementById('playAndpause').onclick = function (){
		if(isplay){
			isplay = false;
			player.pause();
			document.getElementById('playAndpause').innerHTML = '播放';
			return;
		}
		isplay = true;
		player.play();
		document.getElementById('playAndpause').innerHTML = '暂停';
	}
	document.getElementById('nextSong').onclick = playNextSong;
	function playNextSong(){
		index++;
		if(index > playSongList.length - 1){
			index = 0;
		}
		player.src = playSongList[index].url;
		player.play();
		isplay = true;
		playList(index);
		player.removeEventListener('ended',playLastSong);
	}
	document.getElementById('lastSong').onclick = playLastSong;
	function playLastSong(){
		index--;
		if(index < 0){
			index = playSongList.length - 1;
		}
		player.src = playSongList[index].url;
		player.play();
		isplay = true;
		playList(index);
	}
}
function playListAddSong(o){
	var key = o.getAttribute('data-arr');
	var i = o.getAttribute('data-i');
	var obj = window[key].showapi_res_body.pagebean.songlist[i];
	for(var i = 0; i < playSongList.length; i++){
		if(playSongList[i].songid === obj.songid){
			playSongList.splice(i,1);
		}
	}
	playSongList.unshift(obj);
	player.src = playSongList[0].url;
	player.play();
	isplay = true;
	playList();
}
function langClick(e){
	var num = e.getAttribute('data-i');
	var timer1 = setTimeout(function(){
		player.src = playSongList[num].url;
		playList(num);
		isplay = true;
		player.play();
	},300);
	var timer = setTimeout(function(){
		delBox.innerHTML = '';
		delBox.style.display = "block";
		var str = '<div class="hint-box">';
				str += '<h4>您确定删除吗？</h4>';
				str += '<ul class="center msg-box">';
					str += '<li>';
						str += '<div class="float-l">';
							str += '<img src="'+playSongList[num].albumpic_small+'" width="40" height="40"/>';
						str += '</div>';
						str += '<div class="msg">';
							str += '<h5>'+playSongList[num].songname+'</h5>';
							str += '<p>'+playSongList[num].singername+'</p>';
						str += '</div>';
					str += '</li>';
				str += '</ul>';
				str += '<div class="no" onclick="noRemoveE()">取消</div>';
				str += '<div class="yes" onclick="removeE(this)" data-i="'+num+'">删除</div>';
			str += '</div>';
		delBox.innerHTML += str;
	},1000);
	var fun = function(){
		clearTimeout(timer1);
		clearTimeout(timer);
		e.removeEventListener('touchend',fun);
	}
	e.addEventListener('touchend',fun);
}
function removeE(e){
	var i = e.getAttribute('data-i');
	playSongList.splice(i,1);
	if(playSongList.length > 0){
		if(i > playSongList.length-1){
			i = 0;
		}
		player.src = playSongList[i].url;
		player.play();
		playList(i);
	}
	else{
		playPage.innerHTML = '<h3>没有可播放的列表</h3>';
		player.pause();
	}
	delBox.innerHTML = '';
	delBox.style.display = "none";
}
function noRemoveE(){
	delBox.innerHTML = '';
	delBox.style.display = "none";
}

//<div class="center">
//	<div class="search-box">
//		<input type="text" value="" /><input type="button" value="搜索" />
//	</div>
//	<ul class="msg-box">
//		<li>
//			<div class="float-l">
//				<img src="img/logo_index.png" width="40" height="40"/>
//			</div>
//			<div class="msg">
//				<h5>刘德华</h5>
//				<p>爱你一万年</p>
//			</div>
//		</li>
//	</ul>
//</div>
