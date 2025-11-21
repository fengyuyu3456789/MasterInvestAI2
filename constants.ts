import { Investor } from './types';

export const INVESTORS: Investor[] = [
  {
    id: 'buffett',
    name: '沃伦·巴菲特',
    title: '股神',
    description: '关注护城河 (Moat)、高ROE、管理层诚信及合理估值。',
    avatarColor: 'bg-blue-600',
  },
  {
    id: 'lynch',
    name: '彼得·林奇',
    title: '成长股猎手',
    description: '关注PEG指标、"买你所了解的"、成长性与隐形冠军。',
    avatarColor: 'bg-green-600',
  },
  {
    id: 'munger',
    name: '查理·芒格',
    title: '幕后智囊',
    description: '追求优质企业、"lollapalooza"效应、逆向思维。',
    avatarColor: 'bg-purple-600',
  },
  {
    id: 'templeton',
    name: '约翰·邓普顿',
    title: '全球投资之父',
    description: '极度悲观时买入、全球化视野、寻找低价股。',
    avatarColor: 'bg-yellow-600',
  },
  {
    id: 'graham',
    name: '本杰明·格雷厄姆',
    title: '价值投资之父',
    description: '安全边际、净流动资产价值 (Net-Net)、防御型投资。',
    avatarColor: 'bg-gray-600',
  },
  {
    id: 'klarman',
    name: '塞斯·卡拉曼',
    title: '安全边际大师',
    description: '极度厌恶风险、关注被低估资产、复杂的财务结构。',
    avatarColor: 'bg-red-600',
  },
  {
    id: 'greenblatt',
    name: '乔尔·格林布拉特',
    title: '神奇公式创始人',
    description: '高资本回报率 (ROIC) + 高盈利率 (Earnings Yield)。',
    avatarColor: 'bg-indigo-600',
  },
  {
    id: 'einhorn',
    name: '大卫·艾因霍恩',
    title: '多空策略专家',
    description: '深度基本面挖掘、寻找财务造假或被过度高估的公司。',
    avatarColor: 'bg-orange-600',
  },
];