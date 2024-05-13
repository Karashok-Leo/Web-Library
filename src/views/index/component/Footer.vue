<template>

    <el-footer class="footer">
        <div class="foot-link-box flex-view">
            <a href="/" class="foot-link" target="_blank">系统文档</a>
            <div class="link-split"></div>
            <a href="/admin" class="foot-link" target="_blank">后台管理</a>
            <div class="link-split"></div>
            <a href="/" class="foot-link" target="_blank">关于我们</a>
        </div>
        <div class="footer-infos">
            <span>
                <a style="color: rgb(174, 174, 174);">京ICP备66666666号</a>
            </span>
            <span>&nbsp;&nbsp;京公网安备666666&nbsp;&nbsp;中南大学图书馆666666号&nbsp;&nbsp;统一社会信用代码 666666666</span>
        </div>
        <div class="address">2024-2025 © 中南大学图书馆 版权所有 · All Rights Reserved</div>
    </el-footer>

</template>

<script setup>
</script>

<style lang="scss" scoped>
.flex-view {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
}

.footer {
    bottom: 0px;
    margin: 0 auto;
    padding: 24px 0 20px 54px;

    .foot-link-box {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        overflow: hidden;
        margin: 24px auto 16px;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;

        .foot-link {
            margin: 0 16px;
            color: #2a4f88;
        }

        a {
            background-color: transparent;
            text-decoration: none;
            color: var(--mid-blue);
        }
    }

    .footer-infos {
        height: 16px;
        line-height: 16px;
        font-size: 12px;
        padding-left: 63px;
        color: #aeaeae;
        margin-top: 16px;
        text-align: center;
    }

    .address {
        text-align: center;
        height: 16px;
        line-height: 16px;
        font-size: 12px;
        color: #aeaeae;
        margin-top: 8px;
    }
}
</style>