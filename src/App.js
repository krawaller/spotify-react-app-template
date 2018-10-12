import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import React, { Component } from 'react';
import './App.css';
import fetchPlayer from './fetchPlayer';
import spfetch from './spfetch';

class App extends Component {
  state = { isLoggedIn: spfetch.isLoggedIn() };

  handleLoginClick = async () => {
    this.setState({
      isLoggedIn: await spfetch.login()
    });
  };

  render() {
    const { isLoggedIn } = this.state;
    return isLoggedIn ? (
      <LoggedInScreen />
    ) : (
      <div className="login">
        <Button
          variant="contained"
          color="primary"
          className={''}
          onClick={this.handleLoginClick}
        >
          Log In With Spotify
        </Button>
      </div>
    );
  }
}

class LoggedInScreen extends Component {
  state = {
    isLoaded: false,
    name: null,
    href: null,
    imageUrl: null,
    numFollowers: null,
    player: null,
    playerState: {}
  };

  async componentDidMount() {
    await this.getMe();
    this.initPlayer();
  }

  async initPlayer() {
    const player = (global.player = await fetchPlayer());
    this.setState({ player });
    player.addListener('player_state_changed', playerState =>
      this.setState({
        playerState
      })
    );
  }

  async getMe() {
    const response = await spfetch('/v1/me');
    const {
      display_name: name,
      href,
      images: [{ url: imageUrl } = {}] = [],
      followers: { total: numFollowers }
    } = await response.json();

    this.setState({ isLoaded: true, name, href, imageUrl, numFollowers });
    return true;
  }

  handlePlayTopTracks = async () => {
    const response = await spfetch('/v1/me/top/tracks');
    const { items } = await response.json();
    this.state.player.play(items.map(({ uri }) => uri));
  };

  handlePlayPreviousTrack = () => this.state.player.previousTrack();
  handlePlayNextTrack = () => this.state.player.nextTrack();
  handleResume = () => this.state.player.resume();
  handlePause = () => this.state.player.pause();

  render() {
    const {
      name,
      imageUrl,
      numFollowers,
      player,
      playerState: {
        paused = true,
        context,
        track_window: { current_track: { name: currentTrackName } = {} } = {},
        restrictions: {
          disallow_pausing_reasons: [pauseRestrictedReason] = [],
          disallow_skipping_prev_reasons: [skipPreviousRestrictedReason] = [],
          disallow_skipping_next_reasons: [skipNextRestrictedReason] = []
        } = {}
      }
    } = this.state;

    const hasPlayer = !!player;
    const hasContext = context;

    return (
      <div className="App">
        <CssBaseline />

        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              {currentTrackName || 'Not playing anything yet'}
            </Typography>

            <div className="grow" />

            <IconButton
              color="inherit"
              disabled={
                !hasPlayer || !hasContext || !!skipPreviousRestrictedReason
              }
              onClick={this.handlePlayPreviousTrack}
            >
              <SkipPreviousIcon />
            </IconButton>

            {paused ? (
              <IconButton
                color="inherit"
                disabled={!hasPlayer || !hasContext}
                onClick={this.handleResume}
              >
                <PlayArrowIcon />
              </IconButton>
            ) : (
              <IconButton
                color="inherit"
                disabled={!hasPlayer || !hasContext || !!pauseRestrictedReason}
                onClick={this.handlePause}
              >
                <PauseIcon />
              </IconButton>
            )}

            <IconButton
              color="inherit"
              disabled={!hasPlayer || !hasContext || !!skipNextRestrictedReason}
              onClick={this.handlePlayNextTrack}
            >
              <SkipNextIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {name && (
          <Card className="Card">
            <CardActionArea>
              <CardMedia className="CardMedia" image={imageUrl} title={name} />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {name}
                </Typography>
                <Typography component="p">Followers: {numFollowers}</Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button
                size="small"
                color="primary"
                onClick={this.handlePlayTopTracks}
              >
                Play Top Tracks!
              </Button>
            </CardActions>
          </Card>
        )}
      </div>
    );
  }
}

export default App;
