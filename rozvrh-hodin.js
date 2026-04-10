//=========aktuální-verze======================
//=========v-kodu-je-32-day-celkem=============

// ============================================
//  VARIANTA-A-B
//=============================================
// 🎯 ROZVRH HODIN - SEPAROVANÝ SOUBOR 🎯
// ============================================
// Tento soubor obsahuje pouze rozvrh
// Hlavní aplikace ho načítá automaticky
// ============================================

const schedule = [
    
    //======================Začátek Odborného Výcviku=======
    // PONDĚLÍ (day: 1)
    // day 1
    { day: 1, timeFrom: '08:00', timeTo: '15:15', subject: 'OV', color: '#1e90ff' }, //-1---ODBORNÝ VÝCVIK (Sytá modrá)
    
    // ze PONDĚLKA NA ÚTERÝ
    // day 2
    { day: 1, timeFrom: '15:15', timeTo: '08:00', nextDay: 2, subject: '🌙 Volno', color: '#1a1a2e' },
    
    // ÚTERÝ (day: 2)
    // day 3
    { day: 2, timeFrom: '08:00', timeTo: '15:15', subject: 'OV', color: '#1e90ff' }, //-2---ODBORNÝ VÝCVIK (Sytá modrá)
    
    // z ÚTERÝ NA STŘEDU
    // day 4
    { day: 2, timeFrom: '15:05', timeTo: '08:00', nextDay: 3, subject: '🌙 Volno', color: '#1a1a2e' },
    
    // STŘEDA (day: 3)
    // day 5
    { day: 3, timeFrom: '08:00', timeTo: '15:15', subject: 'OV', color: '#1e90ff' }, //-3---ODBORNÝ VÝCVIK (Sytá modrá)
    
    // ze STŘEDY NA ČTVRTEK
    // day 6
    { day: 3, timeFrom: '15:05', timeTo: '08:00', nextDay: 4, subject: '🌙 Volno', color: '#1a1a2e' },
    
    //=======================Konec Odborného Výcviku========
    
    //=======================Začátek školního vyučování=====
    // ČTVRTEK (day: 4)
    // day 7
    { day: 4, timeFrom: '08:00', timeTo: '08:45', subject: 'T', color: '#FF4500' }, //-1---TECHNOLOGIE (Výrazná oranžová)
    
    // day 8
    { day: 4, timeFrom: '08:45', timeTo: '08:55', subject: 'přestávka', color: '#FF8C00' }, //-přestávka--01 (Tmavě oranžová)
    
    // day 9
    { day: 4, timeFrom: '08:55', timeTo: '09:40', subject: 'OBV', color: '#FF8F66' }, //-2---OBČANSKÁ VÝCHOVA (Světlejší oranžová)
    
    // day 10
    { day: 4, timeFrom: '09:40', timeTo: '10:00', subject: 'přestávka', color: '#FF8C00' }, //-přestávka--02 (Tmavě oranžová)
    
    // day 11
    { day: 4, timeFrom: '10:00', timeTo: '10:45', subject: 'ML', color: '#9400D3' }, //-3---MATERIÁLY (Tmavě fialová)
    
    // day 12
    { day: 4, timeFrom: '10:45', timeTo: '10:55', subject: 'přestávka', color: '#FF8C00' }, //-přestávka--03 (Tmavě oranžová)
    
    // day 13
    { day: 4, timeFrom: '10:55', timeTo: '11:40', subject: 'TV', color: '#ADFF2F' }, //-4---TĚLESNÁ VÝCHOVA (Jasná limetková)
    
    // day 14
    { day: 4, timeFrom: '11:40', timeTo: '11:50', subject: 'přestávka', color: '#FF8C00' }, //-přestávka--04 (Tmavě oranžová)
    
    // day 15
    { day: 4, timeFrom: '11:50', timeTo: '12:35', subject: 'TV', color: '#ADFF2F' }, //-5---TĚLESNÁ VÝCHOVA
    
    // day 16
    { day: 4, timeFrom: '12:35', timeTo: '13:25', subject: 'Polední přestávka', color: '#1E90FF' }, //-Oběd a Polední přestávka (Sytá modrá)
    
    // day 17
    { day: 4, timeFrom: '13:25', timeTo: '14:10', subject: 'T', color: '#FF4500' }, //-6---TĚCHNOLOGIE (Zlatá/Tmavě žlutá)
    
    // day 18
    { day: 4, timeFrom: '14:10', timeTo: '14:20', subject: 'přestávka', color: '#FF8C00' }, //-přestávka--05 (Tmavě oranžová)
    
    // day 19
    { day: 4, timeFrom: '14:20', timeTo: '15:05', subject: 'I', color: '#FFA07A' }, //-7---INFORMATIKA (Světle lososová)
    
     
    
    // ze ČTVRTKA NA PÁTEK
    // day 20
    { day: 4, timeFrom: '15:05', timeTo: '07:40', nextDay: 5, subject: '🌙 Volno', color: '#1a1a2e' },
    
    //===============================KONEC ČTVRTKA===============================//
    
    //===============================ZAČÁTEK PÁTKU===============================//
    
    // PÁTEK (day: 5)
    // day 21
    { day: 5, timeFrom: '07:40', timeTo: '08:25', subject: 'ČJ', color: '#709ddb' }, //-1---ČESKÝ JAZYK (Pastelově modrá)
    
    // day 22
    { day: 5, timeFrom: '08:25', timeTo: '08:35', subject: 'přestávka', color: '#FF8C00' }, //-přestávka---01 (Tmavě oranžová)
    
    // day 23
    { day: 5, timeFrom: '08:35', timeTo: '09:20', subject: 'M', color: '#66ddaa' }, //-2---MATEMATIKA (Akvamarínová)
    
    // day 24
    { day: 5, timeFrom: '09:20', timeTo: '09:40', subject: 'přestávka', color: '#FF8C00' }, //-přestávka---02 (Tmavě oranžová)
     
    // day 25
    { day: 5, timeFrom: '09:40', timeTo: '10:25', subject: 'T', color: '#FF4500' }, //-3---TECHNOLOGIE (Lososová)
    
    // day 26
    { day: 5, timeFrom: '10:25', timeTo: '10:35', subject: 'přestávka', color: '#FF8C00' }, //-přestávka---03 (Tmavě oranžová)
    
    // day 27
    { day: 5, timeFrom: '10:35', timeTo: '11:20', subject: 'OK', color: '#e08cf2' }, //-4---ODBORNÉ KRESLENÍ (Ametystová)
    
    // day 28
    { day: 5, timeFrom: '11:20', timeTo: '11:25', subject: 'přestávka', color: '#FF8C00' }, //-přestávka---04 (Tmavě oranžová)
    
    // POZOR! Oprava z 'day: 4' na správné 'day: 5' (Pátek)
    // day 29
    { day: 5, timeFrom: '11:25', timeTo: '12:10', subject: 'SZ', color: '#ffdf33' }, //-5---STROJE A ZAŘÍZENÍ (Kanárkově žlutá)
    
    //===============================KONEC PÁTKU===============================//
    
    //===============================ZAČÁTEK VÍKENDU===============================//
    
    // z PÁTKU NA sobotu
    // day 30
    { day: 5, timeFrom: '12:10', timeTo: '23:59', subject: '🎮 Víkend', color: '#1a1a2e' },
    
    // ze SOBOTY NA NEDĚLY
    // day 31
    // Sobota
{ day: 6, timeFrom: '00:00', timeTo: '23:59', subject: '🎮 Sobota', color: '#2d1b69' },

// Neděle
{ day: 0, timeFrom: '00:00', timeTo: '23:59', subject: '🎮 NNeděle', color: '#2d1b69' },    
    
//{ day: 1, timeFrom: '00:00', timeTo: '08:00', nextDay: 1, subject: '🎮 PPondělí', color: '#2d1b69' },
    
    
];

// ============================================
// KONEC ROZVRHU
// ============================================