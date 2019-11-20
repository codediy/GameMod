## TL的Media数据文件分析说明

## TL物品组织层级

> 在关卡地图中放置交互对象
> 通过剧情任务引导玩家交互

- 关卡地图(Dungeon->RuleSet->Layout) 
- 单位相关(Unit->(Player,Monster,Quest,Item,SKILL))
- UI相关(UI,Affix)

## 关卡地图层级
- 副本(Dungeon) 包含多个或多层(Level)
- Level对应一个RuleSet,包含多个LayoutChunk
- LayoutChunk从多个Layout中随机一个组成Level

## 任务
- 关卡地图的NPC单位携带的任务
- 玩家与NPC交互对话接受任务
- 玩家获取任务物品完成任务

## UI
- HUD的操作面板

## 玩家
- 操作目标 属于单位

## 技能
- 互相交互的方式 属于单位

## 物品
- 可使用的道具 属于单位
