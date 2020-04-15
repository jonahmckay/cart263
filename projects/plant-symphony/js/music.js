"use strict";

class SoundUnit
{
  constructor(type, length, options)
  {
    this.type = type;
    this.length = length;
    //used for Pizzicato sound objects
    this.options = options;

    this.timeStarted = null;
    this.playing = false;

    this.initialize();
  }

  initialize()
  {
    this.sound = new Pizzicato.Sound({
      source: "wave",
      options: this.options
    });
  }

  lengthCheck(currentTime)
  {
    if ((currentTime-this.length) < this.timeStarted)
    {
      return false;
    }
    return true;
  }

  play()
  {
    this.sound.play();
    this.timeStarted = Date.now();
    this.playing = true;
  }

  stop()
  {
    this.sound.stop();
    //be responsible and free the sound from memory
    this.sound.disconnect();
    this.sound = null;
    this.playing = false;
  }

  getCopy()
  {
    let newSound = new SoundUnit(this.type, this.length, this.options);
    return newSound;
  }
}

class MusicScore
{
  constructor()
  {
    this.sounds = [];
    this.timeline = [];
  }

  addSound(sound, time)
  {
    this.sounds.push(sound);
    this.timeline.push(time);
  }

  getCopy()
  {
    let newScore = new MusicScore();

    for (let i = 0; i < this.sounds.length; i++)
    {
      newScore.sounds.push(this.sounds[i].getCopy());
    }
    for (let i = 0; i < this.sounds.length; i++)
    {
      newScore.timeline.push(this.timeline[i]);
    }

    return newScore;
  }
}

class Song
{
  constructor()
  {
    this.storedScore = null;
    this.activeScore = null;

    this.activeSounds = [];
    this.lastSoundPlayed = -1;
    this.timeStarted = null;

    this.updateInterval = null;
  }

  setScore(score)
  {
    this.storedScore = score;
  }

  playSound(sound)
  {
    this.activeSounds.push(sound);
    sound.play();
  }

  songTick()
  {
    //Find sounds that need to be played
    let currentTime = Date.now();
    let songProgress = currentTime-this.timeStarted;
    for (let i = this.lastSoundPlayed+1; i < this.activeScore.timeline.length; i++)
    {
      if (this.activeScore.timeline[i] < songProgress)
      {
        this.playSound(this.activeScore.sounds[i]);
        this.lastSoundPlayed = i;
      }
      else
      {
        break;
      }
    }

    //Remove complete sounds

    let soundsToRemove = [];

    for (let i = 0; i < this.activeSounds.length; i++)
    {
      if (this.activeSounds[i].lengthCheck(currentTime))
      {
        this.activeSounds[i].stop();
        soundsToRemove.push(i);
      }
    }

    for (let i = this.activeSounds.length-1; i >= 0; i--)
    {
      for (let removeIndex = 0; removeIndex < soundsToRemove.length; removeIndex++)
      {
        if (i === soundsToRemove[removeIndex])
        {
          this.activeSounds.splice(i, 1);
        }
      }
    }
    //TODO: Check that song is complete
  }

  play()
  {
    this.activeScore = this.storedScore.getCopy();
    this.timeStarted = Date.now();
    //TODO: implement
  }

  stop()
  {
    for (let i = 0; i < this.activeScore.sounds.length; i++)
    {
      if (this.activeScore.sounds[i].playing)
      {
        this.activeScore.sounds[i].stop();
      }
    }

    this.activeScore = null;
  }
}

class MusicPlayer
{
  constructor()
  {
    this.songs = [];
    this.updateInterval = null;
  }

  addSong(song)
  {
    this.songs.push(song);
  }

  removeSong(index)
  {
    this.songs.splice(index, 1);
  }

  play(index)
  {
    this.songs[index].play();

    //dear gods this is clunky, but basically it's a hack to get setInterval working
    //because it messes with what "this" is. bind() solves this.
    //https://stackoverflow.com/a/43014276
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
    this.updateInterval = setInterval(function () {this.songs[index].songTick() }.bind(this), 100);
  }

  stop()
  {
    this.songs[index].stop();
    clearInterval(this.updateInterval);
  }
}

class MusicFactory
{
  constructor()
  {

  }

  makeSongFromPlant(plant, callback)
  {
    let song = new Song();

    callback(song);
  }

  makeTestSong()
  {
    let song = new Song()

    let score = new MusicScore()

    score.addSound(new SoundUnit("wave", 4000, {frequency: 440}), 0);
    score.addSound(new SoundUnit("wave", 1000, {frequency: 880}), 2000);

    song.setScore(score);

    return song;
  }
}

let musicPlayer = new MusicPlayer();
let musicFactory =  new MusicFactory();

function testMusic()
{
  musicPlayer.addSong(musicFactory.makeTestSong());
  musicPlayer.play(0);
}
