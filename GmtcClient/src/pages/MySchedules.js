import React, { Component, PropTypes } from 'react'
import PureListView from '../components/PureListView'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import TopicsCarousel from './TopicsCarousel'
import Topic from './Topic'
import {genSubscribedData} from '../helper/dataHelper'
import SubscribeButton from '../components/SubscribeButton'
import ListContainer from '../components/ListContainer'
import {EMPTY_CELL_HEIGHT} from '../components/ListContainer'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native'

class MySchedules extends Component {
  static propTypes = {
    navigator: PropTypes.object,
    days: PropTypes.array.isRequired,
    topics: PropTypes.object,
    emptyOperation: PropTypes.func
  };

  render () {
    let profilePicture = (
      <Image source={require('../assets/avatar.png')}
        style={{height: 90, width: 90, borderRadius: 45, backgroundColor: 'white'}}
      />
    )
    return (
      <ListContainer
        title='我的订阅'
        parallaxContent={profilePicture}
        backgroundImage={require('../assets/my-g8-background.png')}
        backgroundColor='#A8D769'>
        <PureListView data={this.props.topics}
          enableEmptySections
          renderSectionHeader={this.renderSectionHeader}
          renderRow={this.renderRow}
          renderEmptyView={this.renderEmptyView}/>
      </ListContainer>
    )
  }

  renderEmptyView = () => {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: EMPTY_CELL_HEIGHT}}>
        <Image source={require('../assets/no-topics-added.png')} />
        <Text style={styles.message}>您订阅的主题将会{'\n'}展现于此</Text>
        <SubscribeButton style={{width: 220, marginTop: 15}} onPress={this.props.emptyOperation}/>
      </View>
    )
  }

  renderRow = (item, index, renderSeparator) => {
    return (
      <TouchableOpacity onPress={() => this.goToCarousel(item)}>
        <Topic topic={item} isSubscribed/>
      </TouchableOpacity>
    )
  }

  goToCarousel = (item) => {
    this.props.navigator.push({
      component: TopicsCarousel,
      day: this.props.days[item.room.day_id - 1],
      topic: item
    })
  }

  renderSectionHeader = (sectionData, time) => {
    const dayName = ['第一天', '第二天']
    if (sectionData.length === 0) {
      return null
    }
    return (
      <View key={time} style={{backgroundColor: '#eeeeee'}}>
        <Text style={[{margin: 6, marginLeft: 8}, styles.font]}>{dayName[time - 1]}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  font: {
    fontSize: 12.5,
    color: '#555555'
  },
  title: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center'},
  message: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
    color: '#7a8698'
  }
})

const mapStateToProps = state => ({
  days: state.data.days,
  topics: genSubscribedData(state.data.days, state.schedule.subscription)
})

module.exports = connect(mapStateToProps)(MySchedules)
