import React, { useState, useEffect } from 'react';
import { Layout, Menu, Typography, ConfigProvider, Card } from 'antd';
import { HomeOutlined, BarChartOutlined, UserOutlined, AppstoreOutlined } from '@ant-design/icons';
import Plotly from 'plotly.js-dist-min';
import mermaid from 'mermaid';
import { useNavigate } from 'react-router-dom';
import Sider from "antd/es/layout/Sider";
import { Header, Content } from "antd/es/layout/layout";
import Item from 'antd/es/menu/MenuItem';

const { Title } = Typography;

const customTheme = {
  token: {
    colorPrimary: '#FFC107',
    colorLink: '#FFC107',
    colorLinkHover: '#FFD54F',
    colorBgLayout: '#ffffff',
    colorInfo: '#FFC107'
  },
  components: {
    Layout: {
      siderBg: 'rgb(245,245,245)',
      triggerBg: 'rgb(241,241,241)'
    }
  }
};

const MermaidDiagram = ({ mermaidCode }) => {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'base',
      themeVariables: {
        primaryColor: '#fff3cd',
        primaryTextColor: '#000',
        primaryBorderColor: '#000',
        lineColor: '#000',
        secondaryColor: '#fff3cd',
        tertiaryColor: '#fff3cd',
        
      },      
    });

    mermaid.contentLoaded();
  }, []);

  return (
    <div className="mermaid" dangerouslySetInnerHTML={{ __html: mermaidCode }} />
  );
};

const SankeyDiagram = () => {
  const [collapsed, setCollapsed] = useState(true);
  const navigate=useNavigate();

  useEffect(() => {
    const data = [
      {
        type: 'sankey',
        orientation: 'h',
        node: {
          pad: 15,
          thickness: 30,
          line: { color: 'black', width: 0.5 },
          label: [
            'customer_info', 'purchase_transactions', 'product_catalog', 'customer_service',
            'campaign_responses', 'marketing_campaigns', 'website_behavior',
            'temp_basic_info', 'temp_purchase_stats', 'temp_product_preferences',
            'temp_customer_service_stats', 'temp_campaign_engagement', 'temp_website_behavior',
            'customer_360'
          ],
          color: [
            '#FFC107', '#FFD54F', '#FFEB3B', '#FFF176', '#FFEE58', '#FFF59D', '#FFF9C4',
            '#FFE082', '#FFCA28', '#FFB300', '#FFA000', '#FF8F00', '#FF6F00',
            '#FFE57F'
          ]
        },
        link: {
          source: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          target: [7, 8, 9, 10, 11, 11, 12, 13, 13, 13, 13, 13, 13],
          value: [100, 80, 60, 70, 50, 40, 90, 95, 75, 55, 65, 45, 85],
          color: 'rgba(255, 193, 7, 0.2)'
        }
      }
    ];

    const layout = {
      title: 'CDP Data Flow Sankey Diagram',
      font: { size: 16 },
      autosize: true,
      height: 600,
      margin: { l: 0, r: 0, b: 0, t: 40 }
    };

    const config = {
      responsive: true,
      displayModeBar: true,
      modeBarButtonsToAdd: ['zoom2d', 'pan2d', 'resetScale2d']
    };

    Plotly.newPlot('sankeyDiagram', data, layout, config);

    const sankeyPlot = document.getElementById('sankeyDiagram');

    sankeyPlot.on('plotly_hover', (eventData) => {
      if (eventData && eventData.points && eventData.points[0]) {
        const hoveredNode = eventData.points[0].label;
        const hoveredNodeIndex = eventData.points[0].pointNumber;
        
        const updatedColors = data[0].node.color.map((color, index) =>
          index === hoveredNodeIndex ? '#FF6F00' : color
        );

        const updatedLinkColors = data[0].link.source.map((sourceIndex, index) =>
          sourceIndex === hoveredNodeIndex || data[0].link.target[index] === hoveredNodeIndex 
            ? 'rgba(255,111,0,0.5)'
            : 'rgba(255, 193, 7, 0.2)'
        );

        Plotly.restyle('sankeyDiagram', {
          'node.color': [updatedColors],
          'link.color': [updatedLinkColors]
        });

        const tooltipContent = `
          <strong>${hoveredNode}</strong><br>
          Data Volume: ${eventData.points[0].value}<br>
          Connected Nodes: ${(eventData.points[0].sourceLinks || []).length + (eventData.points[0].targetLinks || []).length}
        `;
        
        Plotly.Fx.hover('sankeyDiagram', [{ curveNumber: 0, pointNumber: hoveredNodeIndex }], ['', tooltipContent]);
      }
    });

    sankeyPlot.on('plotly_unhover', () => {
      Plotly.restyle('sankeyDiagram', {
        'node.color': [data[0].node.color],
        'link.color': ['rgba(255, 193, 7, 0.2)']
      });
    });
  }, []);
  const mermaidCode = `
    erDiagram
    customer_info {
        INTEGER customer_id PK
        TEXT first_name
        TEXT last_name
        TEXT email
        TEXT phone_number
        DATE date_of_birth
        DATE registration_date
    }
    product_catalog {
        INTEGER product_id PK
        TEXT product_name
        TEXT category
        TEXT brand
        REAL price
        DATE launch_date
    }
    purchase_transactions {
        INTEGER transaction_id PK
        INTEGER customer_id FK
        INTEGER product_id FK
        DATE purchase_date
        INTEGER quantity
        REAL total_amount
        INTEGER store_id
    }
    customer_service {
        INTEGER interaction_id PK
        INTEGER customer_id FK
        DATE interaction_date
        TEXT interaction_type
        INTEGER product_id FK
        TEXT resolution_status
        INTEGER satisfaction_score
    }
    marketing_campaigns {
        INTEGER campaign_id PK
        TEXT campaign_name
        DATE start_date
        DATE end_date
        TEXT channel
        TEXT target_audience
    }
    campaign_responses {
        INTEGER response_id PK
        INTEGER campaign_id FK
        INTEGER customer_id FK
        DATE response_date
        TEXT response_type
    }
    website_behavior {
        INTEGER session_id PK
        INTEGER customer_id FK
        DATE visit_date
        INTEGER pages_viewed
        INTEGER time_spent
        TEXT source
    }
    customer_info ||--o{ purchase_transactions : has
    product_catalog ||--o{ purchase_transactions : includes
    customer_info ||--o{ customer_service : receives
    product_catalog ||--o{ customer_service : relates_to
    marketing_campaigns ||--o{ campaign_responses : generates
    customer_info ||--o{ campaign_responses : provides
    customer_info ||--o{ website_behavior : exhibits
  `;

  return (
    <ConfigProvider theme={customTheme}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          style={{
            backgroundColor: '#ffffff',
            boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)'
          }}
          theme="light"
          width="20%"
        >
          <div className="logo" style={{ padding: '16px', textAlign: 'center' }}>
            <AppstoreOutlined style={{ fontSize: '32px', color: '#EAB308' }} />
          </div>
          <Menu
            theme="light"
            defaultSelectedKeys={['2']}
            mode="inline"
            style={{
              '& .ant-menu-item': {
                margin: '4px 0',
                borderRadius: '4px',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }
              }
            }}
          >
            <Item key="1" icon={<HomeOutlined />} onClick={()=>{
              console.log("clicked")
              navigate('/dashboard');
            }}>
              Dashboard
            </Item>
            <Item key="2" icon={<BarChartOutlined />}>
              Transformation Tables
            </Item>
            <Item key="3" icon={<UserOutlined />} onClick={()=>{
              navigate('/userflow');
            }}>
              User Flow
            </Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0, borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
            <Title level={3} style={{ margin: '0 0 0 16px' }}>Transformation Tables</Title>
          </Header>
          <Content style={{ margin: '24px 16px 0' }}>
            <Card style={{ marginBottom: '24px' }}>
              <div id="sankeyDiagram" style={{ width: '100%', height: '600px' }}></div>
            </Card>
            <Card title="Database Schema">
              <MermaidDiagram mermaidCode={mermaidCode} />
            </Card>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default SankeyDiagram;