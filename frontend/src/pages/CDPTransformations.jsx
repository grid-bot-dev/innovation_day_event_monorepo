// import React, { useState, useEffect } from 'react';
// import { Layout, Menu, Typography, ConfigProvider, Card } from 'antd';
// import { HomeOutlined, BarChartOutlined, UserOutlined, AppstoreOutlined } from '@ant-design/icons';
// import Plotly from 'plotly.js-dist-min';
// import mermaid from 'mermaid';
// import { useNavigate } from 'react-router-dom';
// import Sider from "antd/es/layout/Sider";
// import { Header, Content } from "antd/es/layout/layout";
// import Item from 'antd/es/menu/MenuItem';

// const { Title } = Typography;

// const customTheme = {
//   token: {
//     colorPrimary: '#FFC107',
//     colorLink: '#FFC107',
//     colorLinkHover: '#FFD54F',
//     colorBgLayout: '#ffffff',
//     colorInfo: '#FFC107'
//   },
//   components: {
//     Layout: {
//       siderBg: 'rgb(245,245,245)',
//       triggerBg: 'rgb(241,241,241)'
//     }
//   }
// };

// const MermaidDiagram = ({ mermaidCode }) => {
//   useEffect(() => {
//     mermaid.initialize({
//       startOnLoad: true,
//       theme: 'base',
//       themeVariables: {
//         primaryColor: '#fff3cd',
//         primaryTextColor: '#000',
//         primaryBorderColor: '#000',
//         lineColor: '#000',
//         secondaryColor: '#fff3cd',
//         tertiaryColor: '#fff3cd',
        
//       },      
//     });

//     mermaid.contentLoaded();
//   }, []);

//   return (
//     <div className="mermaid" dangerouslySetInnerHTML={{ __html: mermaidCode }} />
//   );
// };

// const SankeyDiagram = () => {
//   const [collapsed, setCollapsed] = useState(true);
//   const navigate=useNavigate();

//   useEffect(() => {
//     const data = [
//       {
//         type: 'sankey',
//         orientation: 'h',
//         node: {
//           pad: 15,
//           thickness: 30,
//           line: { color: 'black', width: 0.5 },
//           label: [
//             'customer_info', 'purchase_transactions', 'product_catalog', 'customer_service',
//             'campaign_responses', 'marketing_campaigns', 'website_behavior',
//             'temp_basic_info', 'temp_purchase_stats', 'temp_product_preferences',
//             'temp_customer_service_stats', 'temp_campaign_engagement', 'temp_website_behavior',
//             'customer_360'
//           ],
//           color: [
//             '#FFC107', '#FFD54F', '#FFEB3B', '#FFF176', '#FFEE58', '#FFF59D', '#FFF9C4',
//             '#FFE082', '#FFCA28', '#FFB300', '#FFA000', '#FF8F00', '#FF6F00',
//             '#FFE57F'
//           ]
//         },
//         link: {
//           source: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
//           target: [7, 8, 9, 10, 11, 11, 12, 13, 13, 13, 13, 13, 13],
//           value: [100, 80, 60, 70, 50, 40, 90, 95, 75, 55, 65, 45, 85],
//           color: 'rgba(255, 193, 7, 0.2)'
//         }
//       }
//     ];

//     const layout = {
//       title: 'CDP Data Flow Sankey Diagram',
//       font: { size: 16 },
//       autosize: true,
//       height: 600,
//       margin: { l: 0, r: 0, b: 0, t: 40 }
//     };

//     const config = {
//       responsive: true,
//       displayModeBar: true,
//       modeBarButtonsToAdd: ['zoom2d', 'pan2d', 'resetScale2d']
//     };

//     Plotly.newPlot('sankeyDiagram', data, layout, config);

//     const sankeyPlot = document.getElementById('sankeyDiagram');

//     sankeyPlot.on('plotly_hover', (eventData) => {
//       if (eventData && eventData.points && eventData.points[0]) {
//         const hoveredNode = eventData.points[0].label;
//         const hoveredNodeIndex = eventData.points[0].pointNumber;
        
//         const updatedColors = data[0].node.color.map((color, index) =>
//           index === hoveredNodeIndex ? '#FF6F00' : color
//         );

//         const updatedLinkColors = data[0].link.source.map((sourceIndex, index) =>
//           sourceIndex === hoveredNodeIndex || data[0].link.target[index] === hoveredNodeIndex 
//             ? 'rgba(255,111,0,0.5)'
//             : 'rgba(255, 193, 7, 0.2)'
//         );

//         Plotly.restyle('sankeyDiagram', {
//           'node.color': [updatedColors],
//           'link.color': [updatedLinkColors]
//         });

//         const tooltipContent = `
//           <strong>${hoveredNode}</strong><br>
//           Data Volume: ${eventData.points[0].value}<br>
//           Connected Nodes: ${(eventData.points[0].sourceLinks || []).length + (eventData.points[0].targetLinks || []).length}
//         `;
        
//         Plotly.Fx.hover('sankeyDiagram', [{ curveNumber: 0, pointNumber: hoveredNodeIndex }], ['', tooltipContent]);
//       }
//     });

//     sankeyPlot.on('plotly_unhover', () => {
//       Plotly.restyle('sankeyDiagram', {
//         'node.color': [data[0].node.color],
//         'link.color': ['rgba(255, 193, 7, 0.2)']
//       });
//     });
//   }, []);
//   const mermaidCode = `
//     erDiagram
//     customer_info {
//         INTEGER customer_id PK
//         TEXT first_name
//         TEXT last_name
//         TEXT email
//         TEXT phone_number
//         DATE date_of_birth
//         DATE registration_date
//     }
//     product_catalog {
//         INTEGER product_id PK
//         TEXT product_name
//         TEXT category
//         TEXT brand
//         REAL price
//         DATE launch_date
//     }
//     purchase_transactions {
//         INTEGER transaction_id PK
//         INTEGER customer_id FK
//         INTEGER product_id FK
//         DATE purchase_date
//         INTEGER quantity
//         REAL total_amount
//         INTEGER store_id
//     }
//     customer_service {
//         INTEGER interaction_id PK
//         INTEGER customer_id FK
//         DATE interaction_date
//         TEXT interaction_type
//         INTEGER product_id FK
//         TEXT resolution_status
//         INTEGER satisfaction_score
//     }
//     marketing_campaigns {
//         INTEGER campaign_id PK
//         TEXT campaign_name
//         DATE start_date
//         DATE end_date
//         TEXT channel
//         TEXT target_audience
//     }
//     campaign_responses {
//         INTEGER response_id PK
//         INTEGER campaign_id FK
//         INTEGER customer_id FK
//         DATE response_date
//         TEXT response_type
//     }
//     website_behavior {
//         INTEGER session_id PK
//         INTEGER customer_id FK
//         DATE visit_date
//         INTEGER pages_viewed
//         INTEGER time_spent
//         TEXT source
//     }
//     customer_info ||--o{ purchase_transactions : has
//     product_catalog ||--o{ purchase_transactions : includes
//     customer_info ||--o{ customer_service : receives
//     product_catalog ||--o{ customer_service : relates_to
//     marketing_campaigns ||--o{ campaign_responses : generates
//     customer_info ||--o{ campaign_responses : provides
//     customer_info ||--o{ website_behavior : exhibits
//   `;

//   return (
//     <ConfigProvider theme={customTheme}>
//       <Layout style={{ minHeight: '100vh' }}>
//         <Sider
//           collapsible
//           collapsed={collapsed}
//           onCollapse={setCollapsed}
//           style={{
//             backgroundColor: '#ffffff',
//             boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)'
//           }}
//           theme="light"
//           width="20%"
//         >
//           <div className="logo" style={{ padding: '16px', textAlign: 'center' }}>
//             <AppstoreOutlined style={{ fontSize: '32px', color: '#EAB308' }} />
//           </div>
//           <Menu
//             theme="light"
//             defaultSelectedKeys={['2']}
//             mode="inline"
//             style={{
//               '& .ant-menu-item': {
//                 margin: '4px 0',
//                 borderRadius: '4px',
//                 '&:hover': {
//                   boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
//                 }
//               }
//             }}
//           >
//             <Item key="1" icon={<HomeOutlined />} onClick={()=>{
//               console.log("clicked")
//               navigate('/dashboard');
//             }}>
//               Dashboard
//             </Item>
//             <Item key="2" icon={<BarChartOutlined />}>
//               Transformation Tables
//             </Item>
//             <Item key="3" icon={<UserOutlined />} onClick={()=>{
//               navigate('/userflow');
//             }}>
//               User Flow
//             </Item>
//           </Menu>
//         </Sider>
//         <Layout>
//           <Header style={{ background: '#fff', padding: 0, borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
//             <Title level={3} style={{ margin: '0 0 0 16px' }}>Transformation Tables</Title>
//           </Header>
//           <Content style={{ margin: '24px 16px 0' }}>
//             <Card style={{ marginBottom: '24px' }}>
//               <div id="sankeyDiagram" style={{ width: '100%', height: '600px' }}></div>
//             </Card>
//             <Card title="Database Schema">
//               <MermaidDiagram mermaidCode={mermaidCode} />
//             </Card>
//           </Content>
//         </Layout>
//       </Layout>
//     </ConfigProvider>
//   );
// };

// export default SankeyDiagram;
import React, { useState, useEffect } from 'react';
import Plotly from 'plotly.js-dist-min';
import Item from 'antd/es/menu/MenuItem';
import { useNavigate } from 'react-router-dom';

import {
	Layout,
	Menu,
	Card,
	Row,
	Col,
	Table,
	Typography,
	ConfigProvider,
} from 'antd';
import {
	AppstoreOutlined,
	DashboardOutlined,
	BarChartOutlined,
	UserOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const Dashboard = () => {
	const [collapsed, setCollapsed] = useState(true);
	const [portfolioOverview, setPortfolioOverview] = useState(null);
	const [assetAllocation, setAssetAllocation] = useState(null);
	const [riskMetrics, setRiskMetrics] = useState([]);
	const [topPerformers, setTopPerformers] = useState([]);
	const [complianceSummary, setComplianceSummary] = useState([]);
	const [transactionAnalysis, setTransactionAnalysis] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		fetchPortfolioOverview();
		fetchAssetAllocation();
		fetchRiskMetrics();
		fetchPerformanceDashboard();
		fetchComplianceSummary();
		fetchTransactionAnalysis();
	}, []);

  const fetchPortfolioOverview = async () => {
    console.log("entered")
    const response = await fetch('/api/get_portfolio_overview');
        console.log('entered');
        console.log(response)
    const data = await response.json();
        console.log('entered');

		setPortfolioOverview(data);

		if (data.risk_distribution) {
			const labels = data.risk_distribution.map((item) => item.risk_category);
			const values = data.risk_distribution.map((item) => item.count);
			Plotly.newPlot(
				'riskDistributionChart',
				[{ labels, values, type: 'pie' }],
				{ title: 'Risk Distribution' }
			);
		}
	};

	const fetchAssetAllocation = async () => {
		const response = await fetch('/api/get_asset_allocation');
		const data = await response.json();
		setAssetAllocation(data);

		Plotly.newPlot('assetAllocationChart', data.data, data.layout);
	};

	const fetchRiskMetrics = async () => {
		const response = await fetch('/api/get_risk_metrics');
		const data = await response.json();
		setRiskMetrics(data);
	};

	const fetchPerformanceDashboard = async () => {
		const response = await fetch('/api/get_performance_dashboard');
		const data = await response.json();
		setTopPerformers(data.top_performers);
	};

	const fetchComplianceSummary = async () => {
		const response = await fetch('/api/get_compliance_summary');
		const data = await response.json();
		setComplianceSummary(data);
	};

	const fetchTransactionAnalysis = async () => {
		const response = await fetch('/api/get_transaction_analysis');
		const data = await response.json();
		setTransactionAnalysis(data);

		Plotly.newPlot('transactionVolumeChart', data.data, data.layout);
	};

	const riskColumns = [
		{ title: 'Asset ID', dataIndex: 'asset_id', key: 'asset_id' },
		{ title: 'Name', dataIndex: 'asset_name', key: 'asset_name' },
		{ title: 'VaR', dataIndex: 'var', key: 'var' },
		{ title: 'Beta', dataIndex: 'beta', key: 'beta' },
		{ title: 'Sharpe Ratio', dataIndex: 'sharpe_ratio', key: 'sharpe_ratio' },
	];

	const complianceColumns = [
		{ title: 'Asset Name', dataIndex: 'asset_name', key: 'asset_name' },
		{
			title: 'Violations',
			dataIndex: 'active_violations',
			key: 'active_violations',
		},
		{
			title: 'Last Check',
			dataIndex: 'last_compliance_check',
			key: 'last_compliance_check',
		},
	];

	const performerColumns = [
		{ title: 'Asset Name', dataIndex: 'asset_name', key: 'asset_name' },
		{ title: 'Total Return', dataIndex: 'total_return', key: 'total_return' },
		{
			title: 'Daily Return',
			dataIndex: 'avg_daily_return',
			key: 'avg_daily_return',
		},
		{ title: 'Volatility', dataIndex: 'avg_volatility', key: 'avg_volatility' },
		{
			title: 'Category',
			dataIndex: 'performance_category',
			key: 'performance_category',
		},
	];

	return (
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: '#EAB308',
					colorLink: '#EAB308',
					colorLinkHover: '#f7931f',
					colorBgLayout: '#ffffff',
					colorInfo: '#EAB308',
				},
				components: {
					Layout: { siderBg: '#ffffff', triggerBg: '#EAB308' },
				},
			}}>
			<Layout style={{ minHeight: '100vh' }}>
				<Sider
					collapsible
					collapsed={collapsed}
					onCollapse={setCollapsed}
					style={{
						backgroundColor: '#ffffff',
						boxShadow: '2px 0 8px rgba(29,35,41,0.05)',
					}}
					theme="light">
					<div style={{ padding: '16px', textAlign: 'center' }}>
						<AppstoreOutlined style={{ fontSize: '32px', color: '#EAB308' }} />
					</div>
					<Menu
						theme="light"
						defaultSelectedKeys={['1']}
						mode="inline"
						style={{
							'& .ant-menu-item': {
								margin: '4px 0',
								borderRadius: '4px',
								'&:hover': {
									boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
								},
							},
						}}>
						<Item key="1" icon={<DashboardOutlined />}>
							Dashboard
						</Item>
						<Item
							key="2"
							icon={<BarChartOutlined />}
							onClick={() => {
								console.log('clicked');
								navigate('/cdp-transformation');
							}}>
							Transformation Tables
						</Item>
						<Item
							key="3"
							icon={<UserOutlined />}
							onClick={() => {
								console.log('clicked');
								navigate('/userflow');
							}}>
							User Flow
						</Item>
					</Menu>
				</Sider>
				<Layout>
					<Header style={{ padding: '0', background: '#fff' }}>
						<Row
							justify="space-between"
							align="middle"
							style={{ height: '100%' }}>
							<Col>
								<Title level={3} style={{ margin: '0 16px' }}>
									Dashboard
								</Title>
							</Col>
						</Row>
					</Header>
					<Content style={{ margin: '16px' }}>
						<Row gutter={[16, 16]}>
							<Col span={24}>
								<Card title="Portfolio Overview">
									{/* <p>Total Assets: {portfolioOverview.total_assets}</p>
										<p>Total Value: ${portfolioOverview.total_value}</p>
										<p>Average Return: {portfolioOverview.average_return}%</p> */}
									<div
										style={{ width: '100%', minHeight: 300 }}
										id="riskDistributionChart"></div>
								</Card>
							</Col>
							<Col span={12}>
								<Card title="Asset Allocation">
									<div
										id="assetAllocationChart"
										style={{ width: '100%', minHeight: 300 }}></div>
								</Card>
							</Col>
							<Col span={12}>
								<Card title="Risk Metrics">
									<Table
										style={{ width: '100%', minHeight: 300 }}
										dataSource={riskMetrics}
										columns={riskColumns}
										rowKey="asset_id"
										pagination={false}
									/>
								</Card>
							</Col>
							<Col span={12}>
								<Card title="Top Performers">
									<Table
										style={{ width: '100%', minHeight: 300 }}
										dataSource={topPerformers}
										columns={performerColumns}
										rowKey="asset_name"
										pagination={false}
									/>
								</Card>
							</Col>
							<Col span={12}>
								<Card title="Compliance Summary">
									<Table
										style={{ width: '100%', minHeight: 300 }}
										dataSource={complianceSummary}
										columns={complianceColumns}
										rowKey="asset_name"
										pagination={false}
									/>
								</Card>
							</Col>
							<Col span={24}>
								<Card title="Transaction Volume Analysis">
									<div
										id="transactionVolumeChart"
										style={{ width: '100%', minHeight: 300 }}></div>
								</Card>
							</Col>
						</Row>
					</Content>
				</Layout>
			</Layout>
		</ConfigProvider>
	);
};

export default Dashboard;
