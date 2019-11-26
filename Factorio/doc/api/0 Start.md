# 概览

- `setting stage`用来进行`Mod Settings`
- `data stage` 用来初始化`prototypes`
- `third stage`运行时脚本,主要包括`classes`和`events`

# 链接

- [Tutorials](https://wiki.factorio.com/Tutorials)


# Gangsir

## 概览
## 术语
- Mod
- Entity
- Character
- Player
- Prototype
- Surface
- Event
- Recipe

## 开始
- c++开发的支持luaApi的

## Mod加载

### Load Order
- Mod按照依赖加载,并按字母排序
- 包含三种依赖`required`,`optional`,`restrictive` 



### settingStage
- 查找所有mod的`settings.lua`,
- 执行`settings-updates.lua`
- 执行`settings-final-fixes.lua`

### dataStage
- 声明`prototype`
- 查找`data.lua`
- 执行`data-updates.lua`
- 执行`data-final-fixes.lua`

### migrations
- 修改存档

### control
- `control.lua` 

### runtime
- `event handlers`

## Components
- `settings.lua`
- `data.lua`,`data-updates.lua`,`data-final-fixes.lua`
- `control.lua`
- `local`

## TutorialMod

- appDir/mods/FireArmor_0.1.0
    - data.lua
    - info.json
    - control.lua
    - prototypes\
        - item.lua

```json
//info.json
{
    "name": "FireArmor",
    "version": "0.1.0",
    "title": "Fire Armor",
    "author": "You",
    "contact": "",
    "homepage": "",
    "factorio_version": "0.17",
    "dependencies": ["base >= 0.17"],
    "description": "This mod adds in fire armor that leaves behind damaging fire as you walk around."
}
```

```lua
-- data.lua

require("prototypes.item")

-- control.lua

script.on_event({defines.events.on_tick},
   function (e)
      if e.tick % 30 == 0 then --common trick to reduce how often this runs, we don't want it running every tick, just every 30 ticks, so twice per second
         for index,player in pairs(game.connected_players) do  --loop through all online players on the server
            
            --if they're wearing our armor
            if player.character and player.get_inventory(defines.inventory.character_armor).get_item_count("fire-armor") >= 1 then
               --create the fire where they're standing
               player.surface.create_entity{name="fire-flame", position=player.position, force="neutral"} 
            end
         end
      end
   end
)


-- prototype\item.lua
local fireArmor = table.deepcopy(data.raw.armor["heavy-armor"])

fireArmor.name = "fire-armor"
fireArmor.icons= {
   {
      icon=fireArmor.icon,
      tint={r=1,g=0,b=0,a=0.3}
   },
}

fireArmor.resistances = {
   {
      type = "physical",
      decrease = 6,
      percent = 10
   },
   {
      type = "explosion",
      decrease = 10,
      percent = 30
   },
   {
      type = "acid",
      decrease = 5,
      percent = 30
   },
   {
      type = "fire",
      decrease = 0,
      percent = 100
   },
}

local recipe = table.deepcopy(data.raw.recipe["heavy-armor"])
recipe.enabled = true
recipe.name = "fire-armor"
recipe.ingredients = {{"copper-plate",200},{"steel-plate",50}}
recipe.result = "fire-armor"

data:extend{fireArmor,recipe}
```

## finished tutorial mod

## Resolvigng common errors 

# Extended Learning

