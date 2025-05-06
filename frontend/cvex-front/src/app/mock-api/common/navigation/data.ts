/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'view:job',
        title: 'Job',
        type: 'basic',
        icon: 'heroicons_outline:search',
        link: 'emplois/tous-les-emplois',
        allow: 'Allplacement',
    },

    {
        id: 'view:administration',
        title: ' Administration',
        type: 'collapsable',
        icon: 'heroicons_outline:document-text',
        children: [
            {
                id: 'view:client',
                title: 'Clients',
                type: 'basic',
                icon: 'heroicons_outline:link',
                link: 'administration/clients',
            },
        ],
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
    },
];
