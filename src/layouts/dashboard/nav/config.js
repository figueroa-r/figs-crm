// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

// here, we define our parameters for our Drawer Navigation... an array of objects, inlcuding 
// path for our router and an icon, which is also modified on colors...

// svg color simply references our asset svg based off of a src url... it dynamically changes color based on our
// application settings

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'home',
    path: '/figs-crm/home',
    icon: icon('ic_blog'),
  },
  {
    title: 'customers',
    path: '/figs-crm/customers',
    icon: icon('ic_cart'),
  },
  
];

export default navConfig;
