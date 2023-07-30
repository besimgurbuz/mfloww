import { Icon } from './icon';

export const ICON_SVG_PATHS: Record<Icon, string[]> = {
  avatar: [
    'M4.5 18.575C5.5 17.6417 6.63247 16.8875 7.8974 16.3125C9.16235 15.7375 10.529 15.45 11.9974 15.45C13.4658 15.45 14.8333 15.7375 16.1 16.3125C17.3667 16.8875 18.5 17.6417 19.5 18.575V4.5H4.5V18.575ZM12.05 13.475C13.0167 13.475 13.8333 13.1417 14.5 12.475C15.1667 11.8083 15.5 10.9917 15.5 10.025C15.5 9.05833 15.1667 8.24167 14.5 7.575C13.8333 6.90833 13.0167 6.575 12.05 6.575C11.0833 6.575 10.2667 6.90833 9.6 7.575C8.93333 8.24167 8.6 9.05833 8.6 10.025C8.6 10.9917 8.93333 11.8083 9.6 12.475C10.2667 13.1417 11.0833 13.475 12.05 13.475ZM4.5 21C4.1 21 3.75 20.85 3.45 20.55C3.15 20.25 3 19.9 3 19.5V4.5C3 4.1 3.15 3.75 3.45 3.45C3.75 3.15 4.1 3 4.5 3H19.5C19.9 3 20.25 3.15 20.55 3.45C20.85 3.75 21 4.1 21 4.5V19.5C21 19.9 20.85 20.25 20.55 20.55C20.25 20.85 19.9 21 19.5 21H4.5ZM5.875 19.5H18.125V19.275C17.225 18.5083 16.2583 17.9292 15.225 17.5375C14.1917 17.1458 13.1167 16.95 12 16.95C10.8833 16.95 9.80833 17.1458 8.775 17.5375C7.74167 17.9292 6.775 18.5083 5.875 19.275V19.5ZM12.05 11.975C11.5083 11.975 11.0479 11.7854 10.6688 11.4063C10.2896 11.0271 10.1 10.5667 10.1 10.025C10.1 9.48333 10.2896 9.02292 10.6688 8.64375C11.0479 8.26458 11.5083 8.075 12.05 8.075C12.5917 8.075 13.0521 8.26458 13.4313 8.64375C13.8104 9.02292 14 9.48333 14 10.025C14 10.5667 13.8104 11.0271 13.4313 11.4063C13.0521 11.7854 12.5917 11.975 12.05 11.975Z',
  ],
  twitter: [
    'M23.643 4.93701C22.808 5.30701 21.911 5.55701 20.968 5.67001C21.93 5.09401 22.668 4.18001 23.016 3.09201C22.116 3.62601 21.119 4.01401 20.058 4.22201C19.208 3.31801 17.998 2.75201 16.658 2.75201C14.086 2.75201 12 4.83801 12 7.41201C12 7.77601 12.042 8.13001 12.12 8.47201C8.24701 8.27701 4.81601 6.42201 2.51801 3.60401C2.11801 4.29401 1.88801 5.09401 1.88801 5.94601C1.88801 7.56201 2.71101 8.98901 3.96001 9.82401C3.19601 9.79901 2.47801 9.59001 1.85001 9.24101V9.30101C1.85001 11.558 3.45501 13.441 5.58701 13.869C5.19501 13.975 4.78401 14.031 4.36001 14.031C4.06001 14.031 3.76701 14.003 3.48301 13.949C4.07601 15.799 5.79601 17.147 7.83501 17.183C6.24001 18.433 4.23101 19.178 2.04901 19.178C1.67301 19.178 1.30201 19.156 0.937012 19.113C2.99901 20.436 5.44701 21.206 8.07701 21.206C16.647 21.206 21.332 14.108 21.332 7.95201C21.332 7.75201 21.327 7.55001 21.318 7.35001C22.228 6.69201 23.018 5.87301 23.641 4.94001L23.643 4.93701Z',
  ],
  lock: [
    'M10.725 15H13.275L12.65 11.375C12.9833 11.225 13.25 11.0042 13.45 10.7125C13.65 10.4208 13.75 10.1 13.75 9.75001C13.75 9.26667 13.5792 8.85417 13.2375 8.51251C12.8958 8.17084 12.4833 8.00001 12 8.00001C11.5167 8.00001 11.1042 8.17084 10.7625 8.51251C10.4208 8.85417 10.25 9.26667 10.25 9.75001C10.25 10.1 10.35 10.4208 10.55 10.7125C10.75 11.0042 11.0167 11.225 11.35 11.375L10.725 15ZM12 21.975C9.66667 21.3917 7.75 20.0375 6.25 17.9125C4.75 15.7875 4 13.4583 4 10.925V4.97501L12 1.97501L20 4.97501V10.925C20 13.4583 19.25 15.7875 17.75 17.9125C16.25 20.0375 14.3333 21.3917 12 21.975ZM12 20.425C13.9167 19.7917 15.4792 18.5958 16.6875 16.8375C17.8958 15.0792 18.5 13.1083 18.5 10.925V6.02501L12 3.57501L5.5 6.02501V10.925C5.5 13.1083 6.10417 15.0792 7.3125 16.8375C8.52083 18.5958 10.0833 19.7917 12 20.425Z',
  ],
  currency_exchange: [
    'M12 23C10.1333 23 8.33333 22.45 6.6 21.35C4.86667 20.25 3.5 18.9917 2.5 17.575V21H1V15H7V16.5H3.575C4.425 17.7833 5.6375 18.9375 7.2125 19.9625C8.7875 20.9875 10.3833 21.5 12 21.5C13.3 21.5 14.5292 21.25 15.6875 20.75C16.8458 20.25 17.8542 19.5708 18.7125 18.7125C19.5708 17.8542 20.25 16.8458 20.75 15.6875C21.25 14.5292 21.5 13.3 21.5 12H23C23 13.5167 22.7125 14.9417 22.1375 16.275C21.5625 17.6083 20.775 18.775 19.775 19.775C18.775 20.775 17.6083 21.5625 16.275 22.1375C14.9417 22.7125 13.5167 23 12 23ZM11.275 19.175V17.825C10.525 17.625 9.89583 17.3042 9.3875 16.8625C8.87917 16.4208 8.45 15.8167 8.1 15.05L9.375 14.625C9.575 15.2583 9.92917 15.7583 10.4375 16.125C10.9458 16.4917 11.525 16.675 12.175 16.675C12.8417 16.675 13.3958 16.5125 13.8375 16.1875C14.2792 15.8625 14.5 15.4333 14.5 14.9C14.5 14.35 14.2917 13.8875 13.875 13.5125C13.4583 13.1375 12.6917 12.7167 11.575 12.25C10.575 11.8333 9.825 11.3833 9.325 10.9C8.825 10.4167 8.575 9.76667 8.575 8.95C8.575 8.21667 8.825 7.59167 9.325 7.075C9.825 6.55833 10.4917 6.24167 11.325 6.125V4.85H12.7V6.125C13.3333 6.19167 13.8833 6.39167 14.35 6.725C14.8167 7.05833 15.1917 7.51667 15.475 8.1L14.275 8.675C14.025 8.20833 13.7167 7.85833 13.35 7.625C12.9833 7.39167 12.55 7.275 12.05 7.275C11.4 7.275 10.8875 7.425 10.5125 7.725C10.1375 8.025 9.95 8.43333 9.95 8.95C9.95 9.48333 10.1667 9.90833 10.6 10.225C11.0333 10.5417 11.7333 10.9 12.7 11.3C13.85 11.7833 14.6667 12.2917 15.15 12.825C15.6333 13.3583 15.875 14.05 15.875 14.9C15.875 15.3167 15.8 15.7 15.65 16.05C15.5 16.4 15.2875 16.7 15.0125 16.95C14.7375 17.2 14.4 17.4042 14 17.5625C13.6 17.7208 13.15 17.825 12.65 17.875V19.175H11.275ZM1 12C1 10.4833 1.2875 9.05833 1.8625 7.725C2.4375 6.39167 3.225 5.225 4.225 4.225C5.225 3.225 6.39167 2.4375 7.725 1.8625C9.05833 1.2875 10.4833 1 12 1C13.8667 1 15.6667 1.55 17.4 2.65C19.1333 3.75 20.5 5.00833 21.5 6.425V3H23V9H17V7.5H20.425C19.575 6.21667 18.3667 5.0625 16.8 4.0375C15.2333 3.0125 13.6333 2.5 12 2.5C10.7 2.5 9.47083 2.75 8.3125 3.25C7.15417 3.75 6.14583 4.42917 5.2875 5.2875C4.42917 6.14583 3.75 7.15417 3.25 8.3125C2.75 9.47083 2.5 10.7 2.5 12H1Z',
  ],
  graph: [
    'M2.29142 17.5086C2.21332 17.5867 2.08668 17.5867 2.00858 17.5086L1.14142 16.6414C1.06332 16.5633 1.06332 16.4367 1.14142 16.3586L8.36156 9.13845C8.43849 9.06152 8.56281 9.06019 8.64136 9.13547L14.3466 14.603C14.4298 14.6827 14.5629 14.6758 14.6375 14.588L21.3613 6.66353C21.4363 6.57512 21.5705 6.56882 21.6535 6.64981L22.4164 7.39463C22.4917 7.46804 22.4972 7.58714 22.4292 7.66724L14.6369 16.8389C14.5625 16.9264 14.4299 16.9335 14.3467 16.8544L8.64133 11.4343C8.5627 11.3596 8.43885 11.3612 8.36216 11.4378L2.29142 17.5086Z',
  ],
  code: [
    'M8 17.95L2 11.95L8.05 5.89999L9.125 6.97499L4.15 11.95L9.075 16.875L8 17.95ZM15.95 18L14.875 16.925L19.85 11.95L14.925 7.02499L16 5.94999L22 11.95L15.95 18Z',
  ],
  github: [
    'M12 0C18.63 0 24 5.37 24 12C23.9994 14.5143 23.2103 16.9651 21.7438 19.0074C20.2773 21.0498 18.2072 22.5808 15.825 23.385C15.225 23.505 15 23.13 15 22.815C15 22.41 15.015 21.12 15.015 19.515C15.015 18.39 14.64 17.67 14.205 17.295C16.875 16.995 19.68 15.975 19.68 11.37C19.68 10.05 19.215 8.985 18.45 8.145C18.57 7.845 18.99 6.615 18.33 4.965C18.33 4.965 17.325 4.635 15.03 6.195C14.07 5.925 13.05 5.79 12.03 5.79C11.01 5.79 9.99 5.925 9.03 6.195C6.735 4.65 5.73 4.965 5.73 4.965C5.07 6.615 5.49 7.845 5.61 8.145C4.845 8.985 4.38 10.065 4.38 11.37C4.38 15.96 7.17 16.995 9.84 17.295C9.495 17.595 9.18 18.12 9.075 18.9C8.385 19.215 6.66 19.725 5.58 17.91C5.355 17.55 4.68 16.665 3.735 16.68C2.73 16.695 3.33 17.25 3.75 17.475C4.26 17.76 4.845 18.825 4.98 19.17C5.22 19.845 6 21.135 9.015 20.58C9.015 21.585 9.03 22.53 9.03 22.815C9.03 23.13 8.805 23.49 8.205 23.385C5.81496 22.5895 3.7361 21.0615 2.26334 19.018C0.79057 16.9744 -0.00132072 14.519 1.65347e-06 12C1.65347e-06 5.37 5.37 0 12 0Z',
  ],
  arrow_left: [
    'M14.025 18L8 11.975L14.025 5.95L15.1 7.025L10.15 11.975L15.1 16.925L14.025 18Z',
  ],
  arrow_right: [
    'M9.375 18L8.3 16.925L13.25 11.975L8.3 7.025L9.375 5.95L15.4 11.975L9.375 18Z',
  ],
  arrow_up: [
    'M7.075 15.375L6 14.3L12 8.3L18 14.275L16.925 15.35L12 10.425L7.075 15.375Z',
  ],
  arrow_down: [
    'M22 7.625L12 17.625L2 7.625L3.425 6.225L12 14.8L20.575 6.225L22 7.625Z',
  ],
  plus: [
    'M11.25 19V12.75H5V11.25H11.25V5H12.75V11.25H19V12.75H12.75V19H11.25Z',
  ],
  USD: [
    'M11.275 21V18.9C10.325 18.7333 9.54583 18.3708 8.9375 17.8125C8.32917 17.2542 7.89167 16.55 7.625 15.7L9.025 15.125C9.30833 15.925 9.71667 16.5208 10.25 16.9125C10.7833 17.3042 11.425 17.5 12.175 17.5C12.975 17.5 13.6333 17.3 14.15 16.9C14.6667 16.5 14.925 15.95 14.925 15.25C14.925 14.5167 14.6958 13.95 14.2375 13.55C13.7792 13.15 12.9167 12.7417 11.65 12.325C10.45 11.9417 9.55417 11.4333 8.9625 10.8C8.37083 10.1667 8.075 9.375 8.075 8.425C8.075 7.50833 8.37083 6.74167 8.9625 6.125C9.55417 5.50833 10.325 5.15833 11.275 5.075V3H12.775V5.075C13.525 5.15833 14.1708 5.40417 14.7125 5.8125C15.2542 6.22083 15.6667 6.74167 15.95 7.375L14.55 7.975C14.3167 7.44167 14.0042 7.05417 13.6125 6.8125C13.2208 6.57083 12.7083 6.45 12.075 6.45C11.3083 6.45 10.7 6.625 10.25 6.975C9.8 7.325 9.575 7.8 9.575 8.4C9.575 9.03333 9.825 9.54583 10.325 9.9375C10.825 10.3292 11.75 10.7333 13.1 11.15C14.2333 11.5 15.0708 12.0042 15.6125 12.6625C16.1542 13.3208 16.425 14.15 16.425 15.15C16.425 16.2 16.1167 17.0458 15.5 17.6875C14.8833 18.3292 13.975 18.7417 12.775 18.925V21H11.275Z',
  ],
  EUR: [
    'M15 21C13.0833 21 11.3125 20.4375 9.6875 19.3125C8.0625 18.1875 6.95833 16.6667 6.375 14.75H3V13.25H6.075C6.00833 12.7833 5.97917 12.3667 5.9875 12C5.99583 11.6333 6.025 11.2167 6.075 10.75H3V9.25H6.375C6.95833 7.33333 8.0625 5.8125 9.6875 4.6875C11.3125 3.5625 13.0833 3 15 3C16.15 3 17.2292 3.19583 18.2375 3.5875C19.2458 3.97917 20.1667 4.55 21 5.3L19.925 6.35C19.2417 5.75 18.475 5.29167 17.625 4.975C16.775 4.65833 15.9 4.5 15 4.5C13.4333 4.5 12.0042 4.9375 10.7125 5.8125C9.42083 6.6875 8.50833 7.83333 7.975 9.25H15V10.75H7.6C7.51667 11.2 7.475 11.6167 7.475 12C7.475 12.3833 7.51667 12.8 7.6 13.25H15V14.75H7.975C8.50833 16.1667 9.42083 17.3125 10.7125 18.1875C12.0042 19.0625 13.4333 19.5 15 19.5C15.8833 19.5 16.75 19.35 17.6 19.05C18.45 18.75 19.2333 18.2833 19.95 17.65L21 18.7C20.2667 19.4 19.375 19.9583 18.325 20.375C17.275 20.7917 16.1667 21 15 21Z',
  ],
  CHF: [
    'M7.25 21V17.75H5V16.25H7.25V3H18V4.5H8.75V11.25H17V12.75H8.75V16.25H12.75V17.75H8.75V21H7.25Z',
  ],
  TRY: [
    'M9.25 21V15.4L6 17.425V15.65L9.25 13.625V10.675L6 12.7V10.95L9.25 8.9V3H10.75V7.95L15 5.3V7.05L10.75 9.725V12.675L15 10.025V11.775L10.75 14.45V19.5H11.225C12.7083 19.5 13.95 19.0208 14.95 18.0625C15.95 17.1042 16.4667 15.9167 16.5 14.5H18C17.9667 16.35 17.3 17.8958 16 19.1375C14.7 20.3792 13.1167 21 11.25 21H9.25Z',
  ],
  GBP: [
    'M6 21V19.4C6.43333 19.1333 6.825 18.8375 7.175 18.5125C7.525 18.1875 7.825 17.8417 8.075 17.475C8.325 17.1083 8.51667 16.7167 8.65 16.3C8.78333 15.8833 8.85 15.45 8.85 15C8.85 14.7833 8.8375 14.575 8.8125 14.375C8.7875 14.175 8.75 13.9667 8.7 13.75H6V12.25H7.95C7.3 11.35 6.85417 10.5542 6.6125 9.8625C6.37083 9.17083 6.25 8.46667 6.25 7.75C6.25 6.28333 6.75833 5.04167 7.775 4.025C8.79167 3.00833 10.0333 2.5 11.5 2.5C12.5833 2.5 13.5625 2.77083 14.4375 3.3125C15.3125 3.85417 15.9583 4.58333 16.375 5.5L15 6.075C14.7 5.44167 14.2292 4.9375 13.5875 4.5625C12.9458 4.1875 12.25 4 11.5 4C10.4667 4 9.58333 4.3625 8.85 5.0875C8.11667 5.8125 7.75 6.7 7.75 7.75C7.75 8.4 7.88333 9.0375 8.15 9.6625C8.41667 10.2875 8.95 11.15 9.75 12.25H14V13.75H10.225C10.275 13.9667 10.3083 14.1833 10.325 14.4C10.3417 14.6167 10.35 14.8167 10.35 15C10.35 15.8833 10.1583 16.7083 9.775 17.475C9.39167 18.2417 8.90833 18.9167 8.325 19.5H14C14.6333 19.5 15.1917 19.3333 15.675 19C16.1583 18.6667 16.5083 18.125 16.725 17.375L18.025 18.025C17.8083 19.0083 17.3042 19.75 16.5125 20.25C15.7208 20.75 14.8833 21 14 21H6Z',
  ],
  RUB: [
    'M7.25 21V17.75H5V16.25H7.25V13.5H5V12H7.25V3H13.75C15.2167 3 16.4583 3.50833 17.475 4.525C18.4917 5.54167 19 6.78333 19 8.25C19 9.71667 18.4917 10.9583 17.475 11.975C16.4583 12.9917 15.2167 13.5 13.75 13.5H8.75V16.25H13V17.75H8.75V21H7.25ZM8.75 12H13.75C14.8 12 15.6875 11.6375 16.4125 10.9125C17.1375 10.1875 17.5 9.3 17.5 8.25C17.5 7.2 17.1375 6.3125 16.4125 5.5875C15.6875 4.8625 14.8 4.5 13.75 4.5H8.75V12Z',
  ],
  INR: [
    'M14.1 21L7.25 13.9V12.25H10.5C11.45 12.25 12.2833 11.9417 13 11.325C13.7167 10.7083 14.1333 9.85 14.25 8.75H6V7.25H14.125C13.9083 6.45 13.4625 5.79167 12.7875 5.275C12.1125 4.75833 11.35 4.5 10.5 4.5H6V3H18V4.5H14.15C14.5333 4.83333 14.8583 5.25833 15.125 5.775C15.3917 6.29167 15.5833 6.78333 15.7 7.25H18V8.75H15.75C15.6167 10.2667 15.0542 11.4792 14.0625 12.3875C13.0708 13.2958 11.8833 13.75 10.5 13.75H9.2L16.175 21H14.1Z',
  ],
  CNY: [
    'M11.25 21V14.2H6V12.7H11.175L5 3H6.775L12 11.225L17.225 3H19L12.825 12.7H18V14.2H12.75V21H11.25Z',
  ],
  menu: ['M3 18V16.5H21V18H3ZM3 12.75V11.25H21V12.75H3ZM3 7.5V6H21V7.5H3Z'],
  close: [
    'M6.225 18.825L5.175 17.775L10.95 12L5.175 6.225L6.225 5.175L12 10.95L17.775 5.175L18.825 6.225L13.05 12L18.825 17.775L17.775 18.825L12 13.05L6.225 18.825Z',
  ],
  trash: [
    'M18.05 33.05 24 27l6 6.05 2.35-2.4-5.95-6.05 5.95-6.05-2.35-2.4-6 6.05-5.95-6.05-2.4 2.4 6 6.05-6 6.05Zm-5 8.95q-1.2 0-2.1-.9-.9-.9-.9-2.1V10.5H8v-3h9.4V6h13.2v1.5H40v3h-2.05V39q0 1.2-.9 2.1-.9.9-2.1.9Zm21.9-31.5h-21.9V39h21.9Zm-21.9 0V39Z',
  ],
  tick: [
    'M9.45001 17.85L3.85001 12.25L4.92501 11.175L9.45001 15.7L19.05 6.1L20.125 7.175L9.45001 17.85Z',
  ],
};
