const paths = {
  home: <path d="M3 12 12 4l9 8v8a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-8z"/>,
  book: <path d="M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4zm0 0v13a3 3 0 0 0 3 3"/>,
  chart: <path d="M4 20V10m6 10V4m6 16v-8m6 8V14"/>,
  note: <path d="M5 4h10l4 4v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm10 0v4h4M8 13h8M8 17h5"/>,
  upload: <path d="M12 4v12m0-12 4 4m-4-4-4 4M4 18v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2"/>,
  settings: <path d="m19.4 13 1.5 1a1 1 0 0 1 .3 1.3l-2 3.4a1 1 0 0 1-1.2.5l-1.8-.6a8 8 0 0 1-2 1.2l-.3 1.9a1 1 0 0 1-1 .8h-4a1 1 0 0 1-1-.8l-.3-1.9a8 8 0 0 1-2-1.2l-1.8.6a1 1 0 0 1-1.2-.5l-2-3.4a1 1 0 0 1 .3-1.3l1.5-1a8 8 0 0 1 0-2L3 10a1 1 0 0 1-.3-1.3l2-3.4a1 1 0 0 1 1.2-.5l1.8.6a8 8 0 0 1 2-1.2l.3-1.9a1 1 0 0 1 1-.8h4a1 1 0 0 1 1 .8l.3 1.9a8 8 0 0 1 2 1.2l1.8-.6a1 1 0 0 1 1.2.5l2 3.4a1 1 0 0 1-.3 1.3l-1.5 1a8 8 0 0 1 0 2z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>,
  user: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 9c0-4 4-6 8-6s8 2 8 6"/>,
  search: <path d="M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm5-2 5 5"/>,
  clock: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-14v5l3 3"/>,
  check: <path d="m5 12 5 5 9-11"/>,
  x: <path d="M5 5 19 19 M19 5 5 19"/>,
  play: <path d="M6 4v16l14-8z"/>,
  flag: <path d="M5 21V4m0 0h10l-2 4 2 4H5"/>,
  award: <path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM8.5 13 7 21l5-3 5 3-1.5-8"/>,
  arrow_right: <path d="M5 12h14m-6-6 6 6-6 6"/>,
  arrow_left: <path d="M19 12H5m6-6-6 6 6 6"/>,
  chevron_right: <path d="m9 6 6 6-6 6"/>,
  chevron_down: <path d="m6 9 6 6 6-6"/>,
  plus: <path d="M12 5v14m-7-7h14"/>,
  bell: <path d="M18 16V11a6 6 0 1 0-12 0v5l-2 2h16l-2-2z M10 20a2 2 0 1 0 4 0"/>,
  fire: <path d="M12 22c4 0 7-3 7-7 0-4-3-5-3-8 0 0-2 1-3 4-1-2-3-3-3-3s1 3-1 5-3 3-3 5c0 4 3 4 6 4z"/>,
  trophy: <path d="M8 4h8v6a4 4 0 0 1-8 0V4zM5 4h3m8 0h3M5 4v2a3 3 0 0 0 3 3M19 4v2a3 3 0 0 1-3 3M10 14v3m4-3v3M8 20h8"/>,
  target: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-4a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0-4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>,
  lightning: <path d="M13 3 4 14h7l-1 7 9-11h-7l1-7z"/>,
  logout: <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H3"/>,
  menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
  filter: <path d="M4 4h16l-6 8v7l-4-2v-5L4 4z"/>,
  download: <path d="M12 4v12m0 0 4-4m-4 4-4-4M4 20h16"/>,
  trash: <path d="M5 7h14M10 11v6m4-6v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>,
  edit: <path d="M4 20h4L20 8l-4-4L4 16v4z M14 6l4 4"/>,
  eye: <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>,
  star: <path d="m12 3 3 6 6 1-4.5 4.5 1 6.5L12 18l-5.5 3 1-6.5L3 10l6-1z"/>,
  calendar: <path d="M4 6h16v14H4V6zm0 0V4m0 2h16M8 2v4m8-4v4M8 14h3m5 0h.01"/>,
  folder: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/>,
  pause: <path d="M7 4v16M17 4v16"/>,
  kakao: <path d="M12 3C6.5 3 2 6.5 2 11c0 2.8 1.8 5.3 4.5 6.7L5.5 21l3.8-2.3a12 12 0 0 0 2.7.3c5.5 0 10-3.5 10-8s-4.5-8-10-8z"/>,
  brain: <path d="M9.5 2a2.5 2.5 0 0 1 5 0v.5A6 6 0 0 1 18 8v1a4 4 0 0 1 0 8h-1v1a2 2 0 0 1-4 0v-1H11v1a2 2 0 0 1-4 0v-1H6a4 4 0 0 1 0-8V8a6 6 0 0 1 3.5-5.5V2z"/>,
};

export default function Icon({ name, size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name] || null}
    </svg>
  );
}
