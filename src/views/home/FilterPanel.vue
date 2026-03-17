<template>
  <van-popup v-model:show="show" position="right" class="filter-popup-responsive">
    <div class="filter-container">
      
      <div class="filter-header">
        <span class="title">精准筛选</span>
        <van-icon name="close" size="22" color="#999" @click="show = false" class="close-icon" />
      </div>

      <div class="filter-body">
        
        <div class="filter-section">
          <div class="section-title"><van-icon name="location-o" /> 基础信息</div>
          <div class="filter-group">
            <p class="label">大区选择</p>
            <div class="tag-grid">
              <span v-for="tag in ['微信区', 'QQ区']" 
                :key="tag" :class="{ active: formData.region === tag }" 
                @click="formData.region = tag">{{ tag }}</span>
            </div>
          </div>
        </div>

        <div class="filter-section">
          <div class="section-title"><van-icon name="gold-coin-o" /> 资产配置</div>
          
          <div class="filter-group">
            <p class="label">暗区币范围</p>
            <div class="tag-grid">
              <span v-for="tag in ['100M以下', '100-200M', '200M+']" 
                :key="tag" :class="{ active: formData.currencyTag === tag }" 
                @click="formData.currencyTag = tag">{{ tag }}</span>
            </div>
            <div class="range-inputs">
              <input type="number" v-model="formData.currencyMin" placeholder="最低金额" />
              <div class="divider"></div>
              <input type="number" v-model="formData.currencyMax" placeholder="最高金额" />
            </div>
          </div>

          <div class="filter-group">
            <p class="label">AWM 数量</p>
            <div class="tag-grid">
              <span v-for="tag in ['0-50', '50-100', '>100']" 
                :key="tag" :class="{ active: formData.awm === tag }" 
                @click="formData.awm = tag">{{ tag }}</span>
            </div>
          </div>
        </div>

        <div class="filter-section">
          <div class="section-title"><van-icon name="shield-o" /> 装备与上号</div>
          
          <div class="filter-group">
            <p class="label">保险箱类型 (可多选)</p>
            <div class="tag-grid col-2">
              <span v-for="t in ['基础安全箱', '进阶安全箱', '高级安全箱', '顶级安全箱']" 
                :key="t" :class="{ active: formData.safeType.includes(t) }" 
                @click="toggleSelect(formData.safeType, t)">{{ t }}</span>
            </div>
          </div>
          
          <div class="filter-group">
            <p class="label">上号方式</p>
            <div class="tag-grid">
              <span v-for="m in ['扫码上号', '账号密码', '免码直连']" 
                :key="m" :class="{ active: formData.loginMethod === m }" 
                @click="formData.loginMethod = m">{{ m }}</span>
            </div>
          </div>
        </div>

        <div class="filter-section">
          <div class="section-title"><van-icon name="medal-o" /> 外观与属性</div>
          <div class="select-cell-group">
            <div class="select-cell" v-for="s in dropdowns" :key="s.key">
              <span class="cell-label">{{ s.label }}</span>
              <div class="cell-value">不限 <van-icon name="arrow" /></div>
            </div>
          </div>
        </div>
        
      </div>

      <div class="filter-footer">
        <div class="reset-btn" @click="resetFilter">重置条件</div>
        <div class="confirm-btn" @click="confirmFilter">确认查看</div>
      </div>
      
    </div>
  </van-popup>
</template>

<script setup>
import { ref, reactive } from 'vue';

const show = ref(false);

// 表单数据绑定
const formData = reactive({ 
  region: '',
  currencyTag: '', 
  currencyMin: '',
  currencyMax: '',
  awm: '',
  safeType: [],
  loginMethod: ''
});

const dropdowns = [
  { label: '体力等级', key: 'stamina' },
  { label: '负重等级', key: 'weight' },
  { label: '游戏段位', key: 'rank' },
  { label: '特殊刀皮', key: 'knife' },
  { label: '人物红皮', key: 'redSkin' },
  { label: '武器皮肤', key: 'weaponSkin' },
  { label: '人物金皮', key: 'goldSkin' }
];

// 多选逻辑处理
const toggleSelect = (list, item) => {
  const idx = list.indexOf(item);
  if (idx > -1) {
    list.splice(idx, 1);
  } else {
    list.push(item);
  }
};

// 重置所有筛选条件
const resetFilter = () => {
  formData.region = '';
  formData.currencyTag = '';
  formData.currencyMin = '';
  formData.currencyMax = '';
  formData.awm = '';
  formData.safeType = [];
  formData.loginMethod = '';
};

// 确认筛选关闭面板
const confirmFilter = () => {
  show.value = false;
  // 实际开发中，这里会 emit 事件给 Home.vue 去请求后端接口
};

// 暴露 show 变量给父组件控制显示隐藏
defineExpose({ show });
</script>

<style scoped>
/* 🚀 响应式宽度控制 */
.filter-popup-responsive { 
  width: 85%; 
  height: 100%; 
}
@media (min-width: 768px) {
  .filter-popup-responsive { 
    width: 400px !important; /* PC端固定侧边栏宽度，不再全屏拉伸 */
  }
}

.filter-container { 
  display: flex; 
  flex-direction: column; 
  height: 100%; 
  background: #f8f9fa; 
}

/* 头部 */
.filter-header { 
  padding: 20px; 
  background: #fff; 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  border-bottom: 1px solid #f0f0f0;
}
.filter-header .title { 
  font-size: 18px; 
  font-weight: 900; 
  color: #333;
}
.close-icon {
  cursor: pointer;
  padding: 5px;
}

/* 滚动内容区 */
.filter-body { 
  flex: 1; 
  overflow-y: auto; 
  padding: 15px; 
}
.filter-section { 
  background: #fff; 
  border-radius: 12px; 
  padding: 18px 15px; 
  margin-bottom: 15px; 
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}
.section-title { 
  font-size: 15px; 
  font-weight: bold; 
  color: #1989fa; 
  margin-bottom: 18px; 
  display: flex; 
  align-items: center; 
  gap: 6px; 
}
.filter-group {
  margin-bottom: 18px;
}
.filter-group:last-child {
  margin-bottom: 0;
}
.label { 
  font-size: 13px; 
  color: #666; 
  margin-bottom: 12px; 
  font-weight: 500;
}

/* 标签选项网格 */
.tag-grid { 
  display: flex; 
  flex-wrap: wrap; 
  gap: 10px; 
}
.tag-grid span { 
  flex: 1;
  min-width: 80px;
  text-align: center;
  background: #f5f6f8; 
  padding: 10px 4px; 
  border-radius: 8px; 
  font-size: 12px; 
  border: 1px solid transparent; 
  color: #555;
  transition: all 0.2s;
  cursor: pointer;
}
.tag-grid span.active { 
  background: #f0f7ff; 
  color: #1989fa; 
  border-color: #1989fa; 
  font-weight: bold;
}
.tag-grid.col-2 span {
  min-width: 45%;
}

/* 输入框组合 */
.range-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
}
.range-inputs input {
  flex: 1;
  height: 38px;
  background: #f5f6f8;
  border: none;
  border-radius: 8px;
  text-align: center;
  font-size: 13px;
  color: #333;
}
.divider {
  width: 12px;
  height: 2px;
  background: #ddd;
}

/* 列表选项单元格 */
.select-cell-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.select-cell { 
  display: flex; 
  justify-content: space-between; 
  align-items: center;
  padding: 14px 15px; 
  background: #f5f6f8;
  border-radius: 10px;
  cursor: pointer;
}
.cell-label { 
  font-size: 14px; 
  color: #333; 
}
.cell-value { 
  font-size: 13px; 
  color: #999; 
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 底部固定操作栏 */
.filter-footer { 
  padding: 15px 20px; 
  background: #fff; 
  display: flex; 
  gap: 15px; 
  box-shadow: 0 -4px 16px rgba(0,0,0,0.04);
}
.reset-btn { 
  flex: 1; 
  height: 46px; 
  background: #f5f6f8; 
  color: #666;
  display: flex; 
  align-items: center; 
  justify-content: center; 
  border-radius: 23px; 
  font-size: 14px; 
  font-weight: bold;
  cursor: pointer;
}
.confirm-btn { 
  flex: 2; 
  height: 46px; 
  background: #1989fa; 
  color: #fff; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  border-radius: 23px; 
  font-size: 14px; 
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(25, 137, 250, 0.3);
}
.confirm-btn:active {
  transform: scale(0.98);
}
</style>