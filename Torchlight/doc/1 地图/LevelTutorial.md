# TOC
- 脚本

# 脚本
> 逻辑编辑器

## LogicGroups
> LogicGroup对象包含了相互连通的节点对象实现行为控制

### 创建逻辑对象组
>  `SceneManager`->`LogicGroup`->`ExternalToolButton`

### 添加对象
- 点击 拖拽`SceneManger`已有的对象到`LogicEditor`
- 选择 右击`LogicEditor` 选择`Add Nodes Selected in Layout Manager`
- 右击`LogicEditor`选择`Create Object`

### 移动对象
- 点击和拖拽`LogicEditor`中的对象

### 删除对象
- 右击 选择`Delete Object`

### 链接对象
- 链接`Input Events`和`Ouput Events`

### 删除链接对象
- 选择链接
- 右击 选择`Delete Links`

# Connecting zones
> 通过传送门链接两个地区(Zones)

## 添加对象
- Player Trigger Box 
- Unit Trigger
- Warper 
- Layout Link Particle
- LogicGroup

## 设置属性
### PlayerTriggerBox
> 玩家进入或退出地区触发事件
- `ENABLED:true`
- `LOCAL ONLY:true` 
### UnitTrigger
> 玩家交互时触发事件
- `Model:LeaveArea`
- `LoopStyle:Cycle`
- `LocalOnly:True`
- `Text:name`
- `Dungeon:ESTHERIANCITY`
### Warper
> 传送门
- `DungeonName:EstherianCity`
### Layout Link Particle
> 粒子特效
- `Layout File:`
- `Saves:False`
### LogicGroup
- `PlayerBoxTrigger`
- `UnitTrigger`
- `Warper`

# 创建副本(Dungeon)
## 创建Dungeon
### 复制已有的
### 修改数据
- 基础数据
- 层级数据(STRATA0:主通道)(STRATA1 Boss)
### 进入副本

## 创建RuleSet
### 复制已有的RuleSet
### 修改已有属性
- `Name`
- `Music`
- `Min Chunks`
- `Max Chunks`
- `Camera Angles`
- `ChunkTypes`
- `Themes`
- `Feature`
## 创建Monster

## Creating a Layout Link
### 对象
- BrazierModel
- LayoutLink
- Sound

## Outdoor level chunk
> LevelChunks构成Level
> `Entrance`是一种特殊的`LevelChunk`
> `1x1_Entracne_N1S1E0`
