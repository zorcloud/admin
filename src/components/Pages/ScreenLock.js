// import React, { PureComponent, useState } from 'react';
// import { QuestionCircleOutlined } from '@ant-design/icons';
// import { Layout, Button } from 'antd';
// import PatternLock from '../PatternLock';
// import Clock from '../Clock';
// import Mask from '../Mask';
// import logoImg from 'assets/images/logo-r.png';
// import pattern from 'assets/images/pattern.png';
// import CSSAnimate from '../CSSAnimate';
// import { useNavigate } from 'react-router-dom';
// const { Content } = Layout;
// // import { router } from 'dva';
// // const { withRouter } = router;

// /**
//  * 锁屏界面
//  */
// // @withRouter
// const ScreenLock = props => {
//   const { title } = props;

//   const [showPattern, setShowPattern] = useState(false);
//   const [patternError, setPatternError] = useState(null);
//   const navigate = useNavigate();
//   const onChange = lock => {
//     if (lock) {
//       navigate('/dashboard', { replace: true });
//     } else {
//       setPatternError(true);
//     }
//   };

//   const togglePattern = () => {
//     setShowPattern(!showPattern);
//   };

//   return (
//     <Layout className="full-layout screen-lock-page">
//       <Content>
//         <div className="container">
//           <div className="pattern-logo">
//             <img src={logoImg} alt="logo" />
//             <b>LANIF</b>
//             <span>Admin</span>
//           </div>
//           <div className="patter-container">
//             <div className="patter-title">{title || '欢迎您回来'}</div>
//             <p>使用图案进行解锁</p>
//             <CSSAnimate
//               className="animated-short"
//               type={patternError ? 'shake' : ''}
//               callback={_ => setPatternError(false)}
//             >
//               <PatternLock lock="14753" onChange={onChange} />
//             </CSSAnimate>
//           </div>
//           <div className="patter-tip">
//             <Button
//               type="primary"
//               icon={<QuestionCircleOutlined />}
//               onClick={togglePattern}
//             >
//               图案提示
//             </Button>
//           </div>
//         </div>
//         <Clock />
//       </Content>
//       <Mask visible={showPattern} onClose={togglePattern}>
//         <CSSAnimate
//           className="animated-short pattern-tip-modal"
//           type={showPattern ? 'flipInY' : 'fadeOutUp'}
//         >
//           <img src={pattern} alt="14753" />
//         </CSSAnimate>
//       </Mask>
//     </Layout>
//   );
// };

// export default ScreenLock;
