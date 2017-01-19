/**
 * Created by congchen on 1/16/17.
 */

const url = require('url');
const Song = require('./Song');

const request = require('request');

const Encoder = require('node-html-encoder').Encoder;
const encoder = new Encoder('entity');
class QQ{
    constructor(){

    }

    static origin_search(keyword,page=1,limit=10){
        var urlObj = {
            protocol: 'http:',
            slashes: true,
            hostname: 'c.y.qq.com',
            query: {
                cr:1,
                format:'json',
                n:limit,
                p:page,
                w:keyword,
                lossless:1,
            },
            pathname: '/soso/fcgi-bin/search_cp'
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

    static search_old(keyword,page=1,limit=10){

        return new Promise((y,n)=>{
            QQ.origin_search(keyword,page,limit).then(b=>{
                let song_list = b.data.song.list;
                let songs = [];

                for(let song of song_list){
                    let url = `http://ws.stream.qqmusic.qq.com/${song.songid}.m4a?fromtag=46`;
                    let singer = encoder.htmlDecode(song.singer[0].name);
                    songs.push(new Song(singer,song.songname,song.albumname,url));
                }
                y(songs);
            });
        });
    }

    static search(keyword,page=1,limit=10){

        return new Promise((y,n)=>{
            QQ.origin_search(keyword,page,limit).then(b=>{
                let song_list = b.data.song.list;
                let songs = [];

                geneKey().then(r=>{
                    let [key,guid] = r;

                    for(let song of song_list){
                        let url = downloadUrl(song.songmid,"M800","mp3",key,guid);
                        let singer = encoder.htmlDecode(song.singer[0].name);
                        songs.push(new Song(singer,song.songname,song.albumname,url,picUrl(song.albummid)));
                    }
                    y(songs);
                });

            });
        });
    }
}

function geneKey() {
    let max = 2147483647;
    let min = 0;
    let guid = parseInt(Math.random() * (max - min)) + min;

    var urlObj = {
        protocol: 'http:',
        slashes: true,
        hostname: 'c.y.qq.com',
        query: {
            guid:guid,
            format:'json',
            json:3
        },
        pathname: '/base/fcgi-bin/fcg_musicexpress.fcg'
    };
    var result = url.format(urlObj);

    return new Promise((y,n)=>{
        request.get({url:result}, function (e, r, body) {
            if(e){
                n(e);
            }else{
                // console.log(body);
                let json_result = JSON.parse(body);
                let key = json_result.key;


                y([key,guid]);

            }
        })

    });
}

function downloadUrl(mid,level,extension,key,guid) {
    //
    // let types= {
    //     'size_320mp3': [320, 'M800', 'mp3'],
    //     'size_128mp3': [128, 'M500', 'mp3'],
    //     'size_96aac': [96, 'C400', 'm4a'],
    //     'size_48aac': [48, 'C200', 'm4a'],
    // };
    //
    // for(let i in types){
    //     let url = `http://dl.stream.qqmusic.qq.com/${types[i][1]}${mid}.${types[i][2]}?vkey=${key}&guid=${guid}&fromtag=30`;
    // }

    let url = `http://dl.stream.qqmusic.qq.com/${level}${mid}.${extension}?vkey=${key}&guid=${guid}&fromtag=30`;
    return  url;
}

function picUrl(aid) {
    let size = 90;
    return `https://y.gtimg.cn/music/photo_new/T002R${size}x${size}M000${aid}.jpg?max_age=2592000`;
}

module.exports = QQ;

// QQ.origin_search("爱").then(s=>console.log(s.data.song.list));
// QQ.search("LUV").then(s=>console.log(s));