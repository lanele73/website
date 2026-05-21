// Your photo gallery configuration
// cloud name: Dashboard → Account Details (or the segment after res.cloudinary.com/ in a delivery URL)
const CLOUDINARY_CLOUD_NAME = 'deezpztlx';

// publicId must match Cloudinary exactly (copy from Media Library or the path after /upload/ in a delivery URL).
// Include folder prefix if you use folders (e.g. fotos/name). Include the _suffix Cloudinary added if present.

const photos = [
    { publicId: 'vista_chinesa_xbaaf6', title: 'Rio' },
    { publicId: 'toronto_cr3bim', title: 'CN' },
    { publicId: 'taipei_101_q9vpgi', title: 'Taipei 101' },
    { publicId: 'taipei_1_z4tdm8', title: 'Taipei 1' },
    { publicId: 'taipei_2_gvlgcd', title: 'Taipei 2' },
    { publicId: 'skerwink_1_pfsbxx', title: 'Skerwink 1' },
    { publicId: 'skerwink_2_fyusom', title: 'Skerwink 2' },
    { publicId: 'seljalandsfoss_lewujm', title: 'Seljalandsfoss' },
    { publicId: 'santa_teresa_u7abx6', title: 'Santa Teresa' },
    { publicId: 'rj_r5gop8', title: 'RJ' },
    { publicId: 'riverdale_ecv8w3', title: 'Riverdale' },
    { publicId: 'quetzal_nnhgq5', title: 'Quetzal' },
    { publicId: 'puffins_os5bs7', title: 'Puffins' },
    { publicId: 'puffin_inb8w1', title: 'Puffin' },
    { publicId: 'nl_hut_w7jhh2', title: 'NL Hut' },
    { publicId: 'nl_fox_dqifei', title: 'NL Fox' },
    { publicId: 'nl_cliffs_wza10a', title: 'NL Cliffs' },
    { publicId: 'mono_ardilla_fhhvho', title: 'Mono Ardilla' },
    { publicId: 'la_guaira_2_qwzm4p', title: 'La Guaira 2' },
    { publicId: 'la_guaira_1_ny9mrx', title: 'La Guaira 1' },
    { publicId: 'la_fortuna_ienfvf', title: 'La Fortuna' },
    { publicId: 'jordan_river_npwxxb', title: 'Jordan River' },
    { publicId: 'jökulsárgljúfur_plpfiw', title: 'Jökulsárgljúfur' },
    { publicId: 'hvalnes_dwljzw', title: 'Hvalnes' },
    { publicId: 'hanoi_svgmlz', title: 'Hanoi' },
    { publicId: 'grand_palace_zsepyj', title: 'Grand Palace' },
    { publicId: 'gran_roque_gtquuw', title: 'Gran Roque' },
    { publicId: 'espadilla_etvcx5', title: 'Espadilla' },
    { publicId: 'el_tigre_og5sgo', title: 'El Tigre' },
    { publicId: 'dos_mosquises_idvg5s', title: 'Dos Mosquises' },
    { publicId: 'cliffs_hgrldr', title: 'Cliffs' },
    { publicId: 'candelita_collareja_kup2v0', title: 'Candelita Collareja' },
    { publicId: 'bertioga_2_hrrh8y', title: 'Bertioga 2' },
    { publicId: 'bertioga_1_h5av5y', title: 'Bertioga 1' },
    { publicId: 'bangkok_ba6wsx', title: 'Bangkok' },
    { publicId: 'banff_xcehev', title: 'Banff' },
    { publicId: 'arenal_neqrk3', title: 'Arenal' },

    // Direct URLs (for testing or if you prefer this format)
    
    // https://res.cloudinary.com/deezpztlx/image/upload/v1778721050/puffin_inb8w1.jpg
    // https://res.cloudinary.com/deezpztlx/image/upload/v1778721049/nl_hut_w7jhh2.jpg
    // https://res.cloudinary.com/deezpztlx/image/upload/v1778721048/nl_fox_dqifei.jpg
    // https://res.cloudinary.com/deezpztlx/image/upload/v1778721047/nl_cliffs_wza10a.jpg
    // https://res.cloudinary.com/deezpztlx/image/upload/v1778721046/mono_ardilla_fhhvho.jpg
    // https://res.cloudinary.com/deezpztlx/image/upload/v1778721045/la_guaira_2_qwzm4p.jpg
    // https://res.cloudinary.com/deezpztlx/image/upload/v1778721044/la_guaira_1_ny9mrx.jpg
    // https://res.cloudinary.com/deezpztlx/image/upload/v1778721043/la_fortuna_ienfvf.jpg
    // https://res.cloudinary.com/deezpztlx/image/upload/v1778721042/jordan_river_npwxxb.jpg
    // https://res.cloudinary.com/deezpztlx/image/upload/v1778721041/jo%CC%88kulsa%CC%81rglju%CC%81fur_plpfiw.jpg
    // https://res.cloudinary.com/deezpztlx/image/upload/v1778721040/hvalnes_dwljzw.jpg
    // https://res.cloudinary.com/deezpztlx/image/upload/v1778721039/hanoi_svgmlz.jpg
    // https://res.cloudinary.com/deezpztlx/image/upload/v1778721038/grand_palace_zsepyj.jpg
    // https://res.cloudinary.com/deezpztlx/image/upload/v1778721037/gran_roque_gtquuw.jpg
    // https://res.cloudinary.com/deezpztlx/image/upload/v1778721036/espadilla_etvcx5.jpg
    // https://res.cloudinary.com/deezpztlx/image/upload/v1778721035/el_tigre_og5sgo.jpg
    // https://res.cloudinary.com/deezpztlx/image/upload/v1778721034/dos_mosquises_idvg5s.jpg
    // https://res.cloudinary.com/deezpztlx/image/upload/v1778721033/cliffs_hgrldr.jpg
    // https://res.cloudinary.com/deezpztlx/image/upload/v1778721032/candelita_collareja_kup2v0.jpg
    // https://res.cloudinary.com/deezpztlx/image/upload/v1778721031/bertioga_2_hrrh8y.jpg
    // https://res.cloudinary.com/deezpztlx/image/upload/v1778721030/bertioga_1_h5av5y.jpg
    // https://res.cloudinary.com/deezpztlx/image/upload/v1778721029/bangkok_ba6wsx.jpg
    // https://res.cloudinary.com/deezpztlx/image/upload/v1778721029/banff_xcehev.jpg
    // https://res.cloudinary.com/deezpztlx/image/upload/v1778721028/arenal_neqrk3.jpg
];
