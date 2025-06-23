import React from 'react';
import SideNav from '../components/SideNav';
import { Box } from '@mui/material';

interface DashboardProps {
    children?: React.ReactNode;
}

const drawerWidth = 280;

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
    return (
        <Box sx={{ display: 'flex' }}>
            <SideNav />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: '#e3f2fd', // 浅蓝色背景，M3 风格浅色调
                    minHeight: '100vh',
                    padding: 3,
                    marginLeft: `${drawerWidth}px`,
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Dashboard;
