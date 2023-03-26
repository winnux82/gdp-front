import { INavbarData } from './helper';

export const navbarData: INavbarData[] = [
    {
        routeLink: 'dashboard',
        icon: 'fal fa-home',
        label: 'Dashboard',
    },
    {
        routeLink: 'agents',
        icon: 'fal fa-users',
        label: 'Users',
        items: [
            {
                routeLink: 'agents',
                label: 'Level 1.1',
                items: [
                    {
                        routeLink: 'agents',
                        label: 'Level 2.1',
                    },
                    {
                        routeLink: 'agents',
                        label: 'Level 2.2',
                        items: [
                            {
                                routeLink: 'agents',
                                label: 'Level 3.1',
                            },
                            {
                                routeLink: 'agents',
                                label: 'Level 3.2',
                            },
                        ],
                    },
                ],
            },
            {
                routeLink: 'agents',
                label: 'Level 1.2',
            },
        ],
    },

    {
        routeLink: 'statistics',
        icon: 'fal fa-chart-bar',
        label: 'Statistics',
    },
    {
        routeLink: 'constats',
        icon: 'fal fa-file-invoice',
        label: 'Constats',
        items: [
            {
                routeLink: 'constats',
                label: 'Liste constats',
            },
            {
                routeLink: 'constats/create',
                label: 'Create constat',
            },
        ],
    },
    {
        routeLink: 'listing',
        icon: 'fal fa-file',
        label: 'Listing',
        items: [
            {
                routeLink: 'agents',
                label: 'Liste des agents',
            },
            {
                routeLink: 'rues',
                label: 'Liste des rues',
            },
        ],
    },
    {
        routeLink: 'media',
        icon: 'fal fa-camera',
        label: 'Media',
    },
    {
        routeLink: 'settings',
        icon: 'fal fa-cog',
        label: 'Settings',
        expanded: true,
        items: [
            {
                routeLink: 'settings/profile',
                label: 'Profile',
            },
            {
                routeLink: 'agents',
                label: 'Liste des agents',
            },
            {
                routeLink: 'categories',
                label: 'Liste des categories',
            },
            {
                routeLink: 'rues',
                label: 'Liste des rues',
            },
            {
                routeLink: 'missions',
                label: 'Liste des missions',
            },
        ],
    },
];
