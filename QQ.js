/**
 * Created by congchen on 1/16/17.
 */

const url = require('url');
const Song = require('./Song');

const request = require('request');


class QQ{
    constructor(){

    }

    static origin_search(keyword,page=1,limit=10){
        var urlObj = {
            protocol: 'http:',
            slashes: true,
            hostname: 's.music.qq.com',
            query: {
                cr:1,
                format:'json',
                n:limit,
                p:page,
                w:keyword
            },
            pathname: '/fcgi-bin/music_search_new_platform'
        };
        var result = url.format(urlObj);
        // console.log(result);

        return new Promise((y,n)=>{
            request.get({url:result}, function (e, r, body) {
                if(e){
                    n(e);
                }else{
                    y(JSON.parse(body));
                }
            })

        });
    }

    static search(keyword,page=1,limit=10){

        return new Promise((y,n)=>{
            QQ.origin_search(keyword,page,limit).then(b=>{
                let song_list = b.data.song.list;
                let songs = [];

                for(let song of song_list){
                    let message = song.f.split('|');
                    let url = `http://ws.stream.qqmusic.qq.com/${message[0]}.m4a?fromtag=46`
                    songs.push(new Song(song.fsinger,song.fsong,message[5],url));
                }
                y(songs);
            });
        });
    }
}

module.exports = QQ;
// let qq = new QQ();
// qq.search("爱").then(s=>console.log(s));