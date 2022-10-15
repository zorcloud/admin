import React from 'react';
import { Layout, Tabs, Tag } from 'antd';
import CSSAnimate from '@/components/CSSAnimate';
import Icon from '@/components/Icon';
import './index.less';
import { useState, useRef } from 'react';

const { Content, Sider } = Layout;
const TabPane = Tabs.TabPane;

const Index = () => {
  const [animateName, setAnimateName] = useState('fadeInRight');
  const [tagColor, setTagColor] = useState('blue');
  const [tagVisited, setTagVisited] = useState('#2db7f5');
  const [time, setTime] = useState(0);

  const animateMe = e => {
    setAnimateName(e.target.innerText);
    setTime(time + 1);
  };
  const sidebarStyle = {
    borderRight: '1px solid #ddd',
    background: '#f5f5f5'
  };
  return (
    <Layout className="full-layout page css-animate-page">
      <Sider
        width={350}
        className="css-animate-page-sider"
        style={sidebarStyle}
      >
        <div className="header">
          <h3>Animations.CSS</h3>
          <ul className="icon-list">
            <li>
              <Icon type="ExclamationCircleOutlined" antd />
              <b>作者：</b> Daniel Eden.
            </li>
            <li>
              <p>
                <Icon type="ExclamationCircleOutlined" antd />
                <b>网站：</b>
                <a href="http://daneden.github.io/animate.css/">
                  www.github.com/animate
                </a>
              </p>
            </li>
          </ul>
          <hr />
        </div>
        <Tabs onChange={() => {}} type="card">
          <TabPane tab="进场" key="1">
            <div className="pane">
              <h6>Rotating Entrances:</h6>
              <div className="content">
                <Tag onClick={animateMe} color="blue">
                  rotateIn
                </Tag>
                <Tag onClick={animateMe} color="blue">
                  rotateInDownLeft
                </Tag>
                <Tag onClick={animateMe} color="blue">
                  rotateInDownRight
                </Tag>
                <Tag onClick={animateMe} color="blue">
                  rotateInUpLeft
                </Tag>
                <Tag onClick={animateMe} color="blue">
                  rotateInUpRight
                </Tag>
              </div>
              <h6>Fading Entrances:</h6>
              <div className="content">
                <Tag onClick={animateMe} color="magenta">
                  fadeIn
                </Tag>
                <Tag onClick={animateMe} color="magenta">
                  fadeInUp
                </Tag>
                <Tag onClick={animateMe} color="magenta">
                  fadeInDown
                </Tag>
                <Tag onClick={animateMe} color="magenta">
                  fadeInLeft
                </Tag>
                <Tag onClick={animateMe} color="magenta">
                  fadeInRight
                </Tag>
                <Tag onClick={animateMe} color="magenta">
                  fadeInUpBig
                </Tag>
                <Tag onClick={animateMe} color="magenta">
                  fadeInDownBig
                </Tag>
                <Tag onClick={animateMe} color="magenta">
                  fadeInLeftBig
                </Tag>
                <Tag onClick={animateMe} color="magenta">
                  fadeInRightBig
                </Tag>
              </div>
              <h6>Bouncing Entrances:</h6>
              <div className="content">
                <Tag onClick={animateMe} color="red">
                  bounceIn
                </Tag>
                <Tag onClick={animateMe} color="red">
                  bounceInDown
                </Tag>
                <Tag onClick={animateMe} color="red">
                  bounceInUp
                </Tag>
                <Tag onClick={animateMe} color="red">
                  bounceInRight
                </Tag>
                <Tag onClick={animateMe} color="red">
                  bounceInLeft
                </Tag>
              </div>
            </div>
          </TabPane>
          <TabPane tab="退场" key="2">
            <div className="pane">
              <h6>Rotating Exits:</h6>
              <div className="content">
                <Tag onClick={animateMe} color="blue">
                  rotateOut
                </Tag>
                <Tag onClick={animateMe} color="blue">
                  rotateOutDownLeft
                </Tag>
                <Tag onClick={animateMe} color="blue">
                  rotateOutDownRight
                </Tag>
                <Tag onClick={animateMe} color="blue">
                  rotateOutUpLeft
                </Tag>
                <Tag onClick={animateMe} color="blue">
                  rotateOutUpRight
                </Tag>
              </div>
              <h6>Fading Exits:</h6>
              <div className="content">
                <Tag onClick={animateMe} color="magenta">
                  fadeOut
                </Tag>
                <Tag onClick={animateMe} color="magenta">
                  fadeOutUp
                </Tag>
                <Tag onClick={animateMe} color="magenta">
                  fadeOutDown
                </Tag>
                <Tag onClick={animateMe} color="magenta">
                  fadeOutLeft
                </Tag>
                <Tag onClick={animateMe} color="magenta">
                  fadeOutRight
                </Tag>
                <Tag onClick={animateMe} color="magenta">
                  fadeOutUpBig
                </Tag>
                <Tag onClick={animateMe} color="magenta">
                  fadeOutDownBig
                </Tag>
                <Tag onClick={animateMe} color="magenta">
                  fadeOutLeftBig
                </Tag>
                <Tag onClick={animateMe} color="magenta">
                  fadeOutRightBig
                </Tag>
              </div>
              <h6>Bouncing Exits:</h6>
              <div className="content">
                <Tag onClick={animateMe} color="red">
                  bounceOut
                </Tag>
                <Tag onClick={animateMe} color="red">
                  bounceOutDown
                </Tag>
                <Tag onClick={animateMe} color="red">
                  bounceOutUp
                </Tag>
                <Tag onClick={animateMe} color="red">
                  bounceOutRight
                </Tag>
                <Tag onClick={animateMe} color="red">
                  bounceOutLeft
                </Tag>
              </div>
            </div>
          </TabPane>
          <TabPane tab="效果" key="3">
            <div className="pane">
              <h6>Attention Seekers:</h6>
              <div className="content">
                <Tag onClick={animateMe} color="blue">
                  bounce
                </Tag>
                <Tag onClick={animateMe} color="blue">
                  shake
                </Tag>
                <Tag onClick={animateMe} color="blue">
                  tada
                </Tag>
                <Tag onClick={animateMe} color="blue">
                  swing
                </Tag>
                <Tag onClick={animateMe} color="blue">
                  wobble
                </Tag>
                <Tag onClick={animateMe} color="blue">
                  pulse
                </Tag>
                <Tag onClick={animateMe} color="blue">
                  flash
                </Tag>
              </div>
              <h6>Flippers:</h6>
              <div className="content">
                <Tag onClick={animateMe} color="magenta">
                  flip
                </Tag>
                <Tag onClick={animateMe} color="magenta">
                  flipInX
                </Tag>
                <Tag onClick={animateMe} color="magenta">
                  flipOutX
                </Tag>
                <Tag onClick={animateMe} color="magenta">
                  flipInY
                </Tag>
                <Tag onClick={animateMe} color="magenta">
                  flipOutY
                </Tag>
              </div>
              <h6>Sliders:</h6>
              <div className="content">
                <Tag onClick={animateMe} color="red">
                  slideInDown
                </Tag>
                <Tag onClick={animateMe} color="red">
                  slideInLeft
                </Tag>
                <Tag onClick={animateMe} color="red">
                  slideInRight
                </Tag>
                <Tag onClick={animateMe} color="red">
                  slideOutUp
                </Tag>
                <Tag onClick={animateMe} color="red">
                  slideOutLeft
                </Tag>
                <Tag onClick={animateMe} color="red">
                  slideOutRight
                </Tag>
              </div>
              <h6>Specials:</h6>
              <div className="content">
                <Tag onClick={animateMe} color="purple">
                  lightSpeedIn
                </Tag>
                <Tag onClick={animateMe} color="purple">
                  lightSpeedOut
                </Tag>
                <Tag onClick={animateMe} color="purple">
                  hinge
                </Tag>
                <Tag onClick={animateMe} color="purple">
                  rollIn
                </Tag>
                <Tag onClick={animateMe} color="purple">
                  rollOut
                </Tag>
              </div>
            </div>
          </TabPane>
          <TabPane tab="用法" key="4">
            <div className="pane">
              <p>
                动画组件CSSAnimate可以使用Animate.css的动画名称，也可以用自已的动画
              </p>
              <pre>
                <code>
                  {`<CSSAnimate
                    type="动画名称"
                    duration="持续时间"
                    delay="延时执行"
                    callback="结束后回调"
                  >
                    Animate Me!
                  </CSSAnimate>`}
                </code>
              </pre>
            </div>
          </TabPane>
        </Tabs>
      </Sider>
      <Content>
        <CSSAnimate id="animateMe" type={animateName}>
          <strong>Animate</strong> Me<strong>!</strong>
        </CSSAnimate>
      </Content>
    </Layout>
  );
};

export default Index;
