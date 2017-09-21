<script>
	//rough hack!
export default {
			name: 'GlueLink' ,
			props: ['base_url','url'],
			render: function (createElement) {
                //console.log("Glue", this.base_url, this.url);
				var href = '#' + this.base_url;
				var text = this.url.text || this.url;
				if (this.url.href) {
					href += this.url.href;
				} else {
					href += this.url;
				}
				var elem = createElement('a', 
					{attrs: {
						"href":  href
					}},
					text);
				return elem;
			}
		}
</script>