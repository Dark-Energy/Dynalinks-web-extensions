<template>
<div class="features-table">
    <ul>
        <li v-for="item in features">
            <p><a :href="item.href">{{item.text}}</a></p>
            <p class="features-info">{{item.category}} -> {{item.tag}} </p>
        </li>
    </ul>
</div>
</template>

export default {
    name: "FeaturesTable",
    props: ["features"],
}
