# 安装

```
pnpm i yixuan-util
```

# 使用

```ts
import {} from 'yixuan-util'
```

# 版本

- 0.1.0
  - Basic
    - Type
      - MayList
      - MayPromise
      - LengList
      - toPick
      - ToMust
      - UnList
      - UnPromise
      - ExpandInter
    - Math
      - average
      - standard
      - toutf8
      - unutf8
      - paddingUnit
      - SM3
      - SM4
    - Text
      - upperFirst
    - Date
      - isLeap
      - getDateWeek
      - getMoonNumb
      - getMoonDays
      - getDateDiff
      - getDateText
      - setDateYear
      - setDateMoon
      - setDateDate
      - setDateHour
      - setDateMinute
      - setDateSecond
      - setDateHead
      - setDateTail
      - setMoonHead
      - setMoonTail
      - setYearHead
      - setYearTail
      - setDateYOY
      - setDateMOM
    - List
      - getArray
      - setArray
      - setArrayCreated
      - addArray
      - addArrayCreated
      - delArrayByIndex
      - delArrayByIndexCreated
      - delArrayByValue
      - delArrayByValueCreated
      - invArray
      - invArrayCreated
      - paddingTime
    - Tree
      - DFS
      - BFS
      - convertTreeToList
      - convertListToTree
    - Tool
      - RegEmail
      - RegPhone
      - RegChinese
      - Option
      - Options
      - MayOption
      - MayOptions
      - getOptionAlias
      - getOptionValue
      - findOptionAlias
      - findOptionValue
      - debounce
      - throttle
      - AtomAsync
      - getColor
      - getType
      - isBasic
      - isEmpty
  - Client
    - BOM
      - createHttp
    - DOM
      - CopyText
      - PickFile

# 规划

- Basic
  - Math
    - numberToChinese
  - Text
    - snakeToLower
    - snakeKeyToLower
    - lowerToSnake
    - lowerKeyToSnake
  - Tree
    - trace(): 追根溯源


# 发布流程

1. npm config set registry https://registry.npmjs.org
2. npm config set proxy false
3. npm login
4. npm publish
5. npm config set registry https://registry.npmmirror.com/
