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
		fetchSectorExposure();
		fetchGeographicDistribution();
	}, []);
	const fetchPortfolioOverview = async () => {
		console.log('entered');
		const response = await fetch('/api/get_portfolio_overview');
		console.log('entered');
		console.log(response);
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

	const fetchSectorExposure = async () => {
		const response = await fetch('/api/get_sector_exposure');
		const data = await response.json();

		const sectors = data.data[0].labels; // Sector labels
		const percentages = data.data[0].values.map((value) => value * 100); // Convert to percentage values

		// Plot the grouped bar chart
		Plotly.newPlot(
			'sectorExposureChart',
			[
				{
					x: sectors,
					y: percentages,
					type: 'bar',
					marker: { color: '#31b0f2' },
				},
			],
			{
				title: {
					text: 'Sector Exposure as Percentage',
					font: { size: 20 },
				},
				xaxis: { title: 'Sectors' },
				yaxis: { title: 'Percentage Share (%)', tickformat: '.0%' },
				margin: { t: 40, l: 90, r: 10, b: 80 },
			}
		);
	};

	const fetchGeographicDistribution = async () => {
		const response = await fetch('/api/get_geographic_distribution');
		const data = await response.json();

		const countries = data.data[0].labels; // Country names
		const values = data.data[0].values.map((value) => value * 100); // Convert to percentage

		// Plot the choropleth map
		Plotly.newPlot(
			'geographicDistributionChart',
			[
				{
					type: 'choropleth',
					locationmode: 'country names', // Matches country names in labels
					locations: countries,
					z: values,
					colorscale: 'YlOrRd',
					colorbar: {
						title: 'Percentage Share (%)',
					},
				},
			],
			{
				title: {
					text: 'Geographic Distribution of Investment',
					font: { size: 20 },
				},
				geo: {
					projection: { type: 'natural earth' },
					showcoastlines: true,
					coastlinecolor: 'gray',
					landcolor: '#FFFFFF',
					countrycolor: 'white',
				},
				margin: { t: 40, l: 10, r: 10, b: 10 },
			}
		);
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
							<Col span={12}>
								<Card title="Portfolio Overview">
									<div
										style={{ minHeight: 300 }}
										id="riskDistributionChart"></div>
								</Card>
							</Col>
							<Col span={12}>
								<Card title="Asset Allocation">
									<div
										id="assetAllocationChart"
										style={{ minHeight: 300 }}></div>
								</Card>
							</Col>

							<Col span={24}>
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
							<Col span={24}>
								<Card title="Geographic Distribution">
									<div
										id="geographicDistributionChart"
										style={{
											width: 'full',
											minHeight: '500px',
										}}></div>
								</Card>
							</Col>
							<Col span={24}>
								<Card title="Risk Metrics">
									<Table
										style={{ minHeight: 300 }}
										dataSource={riskMetrics}
										columns={riskColumns}
										rowKey="asset_id"
										pagination={false}
									/>
								</Card>
							</Col>
							<Col span={12}>
								<Card title="Sector Exposure">
									<div
										id="sectorExposureChart"
										style={{
											minHeight: '300px',
										}}></div>
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
										style={{ minHeight: 300 }}></div>
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
