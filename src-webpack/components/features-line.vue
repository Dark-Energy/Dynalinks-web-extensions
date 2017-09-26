<template>
<div >
	<div class="features-line" id="favorites-menu">
		<a class="features-button" v-for="item in features" v-bind:href="item.href">{{item.text}}
		</a>
	</div>
</div>
</template>

<script>
export default {
	name: 'features-line', 
	props:["features"],
}



</script>