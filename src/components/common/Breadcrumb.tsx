import React from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import { useLocation, Link } from 'react-router-dom';

interface BreadcrumbItem {
  title: React.ReactNode;
}

const Breaker: React.FC = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter((i) => i);

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      title: (
        <Link to="/">
          <HomeOutlined />
        </Link>
      ),
    },
    ...pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      return {
        title: <Link to={url} className="text-sm font-bold">{pathSnippets[index]}</Link>,
      };
    }),
  ];

  return <Breadcrumb items={breadcrumbItems} />;
};

export default Breaker;
