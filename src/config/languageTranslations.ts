export interface LanguageTranslation {
  code: string;
  label: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  atWord: string; // "at" in date formats like "March 6, 2026 at 7:00 PM"
  dayNames: string[]; // Sunday=0 … Saturday=6
  monthNames: string[]; // January=0 … December=11
}

export const LANGUAGES: LanguageTranslation[] = [
  {
    code: "en", label: "English",
    days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds", atWord: "at",
    dayNames: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    monthNames: ["January","February","March","April","May","June","July","August","September","October","November","December"],
  },
  {
    code: "es", label: "Español",
    days: "Días", hours: "Horas", minutes: "Minutos", seconds: "Segundos", atWord: "a las",
    dayNames: ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],
    monthNames: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
  },
  {
    code: "fr", label: "Français",
    days: "Jours", hours: "Heures", minutes: "Minutes", seconds: "Secondes", atWord: "à",
    dayNames: ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"],
    monthNames: ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],
  },
  {
    code: "de", label: "Deutsch",
    days: "Tage", hours: "Stunden", minutes: "Minuten", seconds: "Sekunden", atWord: "um",
    dayNames: ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],
    monthNames: ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],
  },
  {
    code: "it", label: "Italiano",
    days: "Giorni", hours: "Ore", minutes: "Minuti", seconds: "Secondi", atWord: "alle",
    dayNames: ["Domenica","Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato"],
    monthNames: ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"],
  },
  {
    code: "pt", label: "Português",
    days: "Dias", hours: "Horas", minutes: "Minutos", seconds: "Segundos", atWord: "às",
    dayNames: ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"],
    monthNames: ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],
  },
  {
    code: "nl", label: "Nederlands",
    days: "Dagen", hours: "Uren", minutes: "Minuten", seconds: "Seconden", atWord: "om",
    dayNames: ["Zondag","Maandag","Dinsdag","Woensdag","Donderdag","Vrijdag","Zaterdag"],
    monthNames: ["Januari","Februari","Maart","April","Mei","Juni","Juli","Augustus","September","Oktober","November","December"],
  },
  {
    code: "pl", label: "Polski",
    days: "Dni", hours: "Godziny", minutes: "Minuty", seconds: "Sekundy", atWord: "o",
    dayNames: ["Niedziela","Poniedziałek","Wtorek","Środa","Czwartek","Piątek","Sobota"],
    monthNames: ["Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec","Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień"],
  },
  {
    code: "ro", label: "Română",
    days: "Zile", hours: "Ore", minutes: "Minute", seconds: "Secunde", atWord: "la",
    dayNames: ["Duminică","Luni","Marți","Miercuri","Joi","Vineri","Sâmbătă"],
    monthNames: ["Ianuarie","Februarie","Martie","Aprilie","Mai","Iunie","Iulie","August","Septembrie","Octombrie","Noiembrie","Decembrie"],
  },
  {
    code: "ru", label: "Русский",
    days: "Дни", hours: "Часы", minutes: "Минуты", seconds: "Секунды", atWord: "в",
    dayNames: ["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"],
    monthNames: ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],
  },
  {
    code: "uk", label: "Українська",
    days: "Дні", hours: "Години", minutes: "Хвилини", seconds: "Секунди", atWord: "о",
    dayNames: ["Неділя","Понеділок","Вівторок","Середа","Четвер","П'ятниця","Субота"],
    monthNames: ["Січень","Лютий","Березень","Квітень","Травень","Червень","Липень","Серпень","Вересень","Жовтень","Листопад","Грудень"],
  },
  {
    code: "tr", label: "Türkçe",
    days: "Gün", hours: "Saat", minutes: "Dakika", seconds: "Saniye", atWord: "saat",
    dayNames: ["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"],
    monthNames: ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"],
  },
  {
    code: "ar", label: "العربية",
    days: "أيام", hours: "ساعات", minutes: "دقائق", seconds: "ثوانٍ", atWord: "في",
    dayNames: ["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],
    monthNames: ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"],
  },
  {
    code: "hi", label: "हिन्दी",
    days: "दिन", hours: "घंटे", minutes: "मिनट", seconds: "सेकंड", atWord: "बजे",
    dayNames: ["रविवार","सोमवार","मंगलवार","बुधवार","गुरुवार","शुक्रवार","शनिवार"],
    monthNames: ["जनवरी","फ़रवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर"],
  },
  {
    code: "zh", label: "中文",
    days: "天", hours: "小时", minutes: "分钟", seconds: "秒", atWord: "",
    dayNames: ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],
    monthNames: ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
  },
  {
    code: "ja", label: "日本語",
    days: "日", hours: "時間", minutes: "分", seconds: "秒", atWord: "",
    dayNames: ["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"],
    monthNames: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
  },
  {
    code: "ko", label: "한국어",
    days: "일", hours: "시간", minutes: "분", seconds: "초", atWord: "",
    dayNames: ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"],
    monthNames: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
  },
  {
    code: "sv", label: "Svenska",
    days: "Dagar", hours: "Timmar", minutes: "Minuter", seconds: "Sekunder", atWord: "kl",
    dayNames: ["Söndag","Måndag","Tisdag","Onsdag","Torsdag","Fredag","Lördag"],
    monthNames: ["Januari","Februari","Mars","April","Maj","Juni","Juli","Augusti","September","Oktober","November","December"],
  },
  {
    code: "da", label: "Dansk",
    days: "Dage", hours: "Timer", minutes: "Minutter", seconds: "Sekunder", atWord: "kl",
    dayNames: ["Søndag","Mandag","Tirsdag","Onsdag","Torsdag","Fredag","Lørdag"],
    monthNames: ["Januar","Februar","Marts","April","Maj","Juni","Juli","August","September","Oktober","November","December"],
  },
  {
    code: "cs", label: "Čeština",
    days: "Dny", hours: "Hodiny", minutes: "Minuty", seconds: "Sekundy", atWord: "v",
    dayNames: ["Neděle","Pondělí","Úterý","Středa","Čtvrtek","Pátek","Sobota"],
    monthNames: ["Leden","Únor","Březen","Duben","Květen","Červen","Červenec","Srpen","Září","Říjen","Listopad","Prosinec"],
  },
  {
    code: "hu", label: "Magyar",
    days: "Nap", hours: "Óra", minutes: "Perc", seconds: "Másodperc", atWord: "",
    dayNames: ["Vasárnap","Hétfő","Kedd","Szerda","Csütörtök","Péntek","Szombat"],
    monthNames: ["Január","Február","Március","Április","Május","Június","Július","Augusztus","Szeptember","Október","November","December"],
  },
];

export function getLanguage(code: string): LanguageTranslation {
  return LANGUAGES.find(l => l.code === code) || LANGUAGES[0];
}
