## 脚本

> 主要包含两种脚本`prototype`,`runtime`
> 这里主要侧重`runtime`,也可以叫做`control`

## 加载脚本
> 查找目录中的`control.lua`
> 加载`control.lua`

## lua
> 使用lua5.2

## 脚本事件
### `script.on_init()`
> 游戏启动的时候执行
```lua
script.on_init(function()
  global.ticker = 0
  global.level = 1
  global.teams = {default_team = "johns-lads"}
  game.create_surface("Scenario Surface"
  game.map_settings.pollution.enabled = false
  --etc.
end)
```
### `script.on_configuration_changed()`
> 配置发生变化
```lua
script.on_configuration_changed(function(data)
  local turret_name = "gun-turret"
  if not game.entity_prototypes[turret_name] then
    log("Gun turret isn't here, some mod or something has changed it")
    global.do_turret_logic = false
  end
end)
```
### `script.on_load()`
> 脚本加载时触发
```lua
script.on_load(function()
  --Resetting metatables
  for k, v in (global.objects_with_metatable) do
    setmetatable(v, object_metatable)
  end

  --Setting local reference to global variable
  variable = global.variable

  --Conditional event handler
  if global.trees then
    script.on_event(defines.events.on_tick, handle_tree_function)
  end
end)
```

## Game事件
```lua
script.on_event(defines.events.on_player_crafted_item, player_crafted_function)
function player_crafted_function(event)
  game.print("A player crafted an item on tick "..event.tick)
end

script.on_event(defines.events.on_tick, function(event)
  game.print("tick")
end)

script.on_event(defines.events.on_tick, function(event)
  this_on_tick(event)
  that_on_tick(event)
end)
```

## 保存数据
```lua
script.on_event(defines.events.on_tick, function(event)
  global.ticker = (global.ticker or 0) + 1
end)

```

## 剧情脚本
```lua
--Initialize the story info
script.on_init(function()
  global.story = story_init()
end)

--Register to update the story on events
script.on_event(defines.events, function(event)
  story_update(global.story, event)
end)

--Story table is where the 'story' is all defined.
story_table =
{
  {
    --branch 1
    {
      --First story event

      --Initialise this event
      init = function(event, story)
        game.print("First init of first story event")
      end,

      --Update function that will run on all events
      update = function(event, story)
        log("updating")
      end,

      --Condition to move on. If the return value is 'true', the story will continue.
      condition = function(event, story)
        if event.tick > 100 then
          return true
        end
      end,

      --Action to perform after condition is met
      action = function(event, story)
        game.print("You completed the objective!")
      end
    },
    {
      --Second story event - example.
      init = function(event, story)
        game.print("Collect 100 iron plate")
      end,
      condition = function(event, story)
        return game.players[1].get_item_count("iron-plate") >= 100
      end,
      action = function(event, story)
        game.print("Well done")
      end
    }
    --Once the end of a branch is reached, the story is finished.
    --The game will now display the mission complete screen.
  },
  {
    --branch 2
  }
}

--Init the helpers and story table. Must be done all times script is loaded.
story_init_helpers(story_table)
```