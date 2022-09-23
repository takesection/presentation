---
title: Two Generals' Problem (二人の将軍問題)
date: 2022-09-24
---

イベント駆動などを利用した分散アーキテクチャでは、次のようなメッセージ配信の信頼性についての理解が必要になります。

- at most once: 最大で1回
- at least once: 少なくとも1回
- exactly once: 確実に1回

そして信頼性を保証できない分散アーキテクチャでは「exactly once: 確実に1回」は不可能なことを説明する有名な問題として、「[二人の将軍問題 (Two Generals' Problem)](https://ja.wikipedia.org/wiki/%E4%BA%8C%E4%BA%BA%E3%81%AE%E5%B0%86%E8%BB%8D%E5%95%8F%E9%A1%8C)」があります。

従って、分散アーキテクチャでは「exactly once: 確実に1回」ではなく、「at least once: 少なくとも1回」を活用して、重複を排除する、つまりべき等性を担保する設計によって「effectively once: 効果として1回」を、必要に応じて利用することになります。
