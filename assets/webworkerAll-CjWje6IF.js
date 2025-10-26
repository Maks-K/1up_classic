import{E as f,m as S,d as le,u as v,J as y,a5 as de,R as H,M as T,w as F,I as ce,$ as P,ac as E,S as R,z as G,ad as ze,ae as Y,N as W,af as C,c as Q,B as U,t as X,x as Ee,G as We,ag as L,ah as Le,o as he,s as fe,a7 as pe,aa as me,ai as ge,p as Ie,q as $e,a8 as He,a9 as Ye,ab as Xe,aj as je,ak as Ne,al as qe,am as I,an as Qe,ao as Ke,D as xe,n as _e,a2 as K,ap as A,e as b,aq as Je}from"./index-BwUuR0Nh.js";import{c as D,a as Ze,b as et,B as be}from"./colorToUniform-BXaCBwVl.js";class ye{constructor(e){this._renderer=e}push(e,t,r){this._renderer.renderPipes.batch.break(r),r.add({renderPipeId:"filter",canBundle:!1,action:"pushFilter",container:t,filterEffect:e})}pop(e,t,r){this._renderer.renderPipes.batch.break(r),r.add({renderPipeId:"filter",action:"popFilter",canBundle:!1})}execute(e){e.action==="pushFilter"?this._renderer.filter.push(e):e.action==="popFilter"&&this._renderer.filter.pop()}destroy(){this._renderer=null}}ye.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"filter"};function tt(n,e){e.clear();const t=e.matrix;for(let r=0;r<n.length;r++){const a=n[r];a.globalDisplayStatus<7||(e.matrix=a.worldTransform,e.addBounds(a.bounds))}return e.matrix=t,e}const rt=new de({attributes:{aPosition:{buffer:new Float32Array([0,0,1,0,1,1,0,1]),format:"float32x2",stride:2*4,offset:0}},indexBuffer:new Uint32Array([0,1,2,0,2,3])});class at{constructor(){this.skip=!1,this.inputTexture=null,this.backTexture=null,this.filters=null,this.bounds=new ce,this.container=null,this.blendRequired=!1,this.outputRenderSurface=null,this.outputOffset={x:0,y:0},this.globalFrame={x:0,y:0,width:0,height:0}}}class Te{constructor(e){this._filterStackIndex=0,this._filterStack=[],this._filterGlobalUniforms=new S({uInputSize:{value:new Float32Array(4),type:"vec4<f32>"},uInputPixel:{value:new Float32Array(4),type:"vec4<f32>"},uInputClamp:{value:new Float32Array(4),type:"vec4<f32>"},uOutputFrame:{value:new Float32Array(4),type:"vec4<f32>"},uGlobalFrame:{value:new Float32Array(4),type:"vec4<f32>"},uOutputTexture:{value:new Float32Array(4),type:"vec4<f32>"}}),this._globalFilterBindGroup=new le({}),this.renderer=e}get activeBackTexture(){var e;return(e=this._activeFilterData)==null?void 0:e.backTexture}push(e){const t=this.renderer,r=e.filterEffect.filters,a=this._pushFilterData();a.skip=!1,a.filters=r,a.container=e.container,a.outputRenderSurface=t.renderTarget.renderSurface;const s=t.renderTarget.renderTarget.colorTexture.source,o=s.resolution,i=s.antialias;if(r.length===0){a.skip=!0;return}const u=a.bounds;if(e.renderables?tt(e.renderables,u):e.filterEffect.filterArea?(u.clear(),u.addRect(e.filterEffect.filterArea),u.applyMatrix(e.container.worldTransform)):e.container.getFastGlobalBounds(!0,u),e.container){const g=(e.container.renderGroup||e.container.parentRenderGroup).cacheToLocalTransform;g&&u.applyMatrix(g)}if(this._calculateFilterBounds(a,t.renderTarget.rootViewPort,i,o,1),a.skip)return;const l=this._getPreviousFilterData();let h=o,d=0,c=0;l&&(d=l.bounds.minX,c=l.bounds.minY,h=l.inputTexture.source._resolution),a.outputOffset.x=u.minX-d,a.outputOffset.y=u.minY-c;const p=a.globalFrame;if(p.x=d*h,p.y=c*h,p.width=s.width*h,p.height=s.height*h,a.backTexture=v.EMPTY,a.blendRequired){t.renderTarget.finishRenderPass();const x=t.renderTarget.getRenderTarget(a.outputRenderSurface);a.backTexture=this.getBackTexture(x,u,l==null?void 0:l.bounds)}a.inputTexture=y.getOptimalTexture(u.width,u.height,a.resolution,a.antialias),t.renderTarget.bind(a.inputTexture,!0),t.globalUniforms.push({offset:u})}generateFilteredTexture({texture:e,filters:t}){const r=this._pushFilterData();this._activeFilterData=r,r.skip=!1,r.filters=t;const a=e.source,s=a.resolution,o=a.antialias;if(t.length===0)return r.skip=!0,e;const i=r.bounds;if(i.addRect(e.frame),this._calculateFilterBounds(r,i.rectangle,o,s,0),r.skip)return e;const u=s,l=0,h=0;r.outputOffset.x=-i.minX,r.outputOffset.y=-i.minY;const d=r.globalFrame;d.x=l*u,d.y=h*u,d.width=a.width*u,d.height=a.height*u,r.outputRenderSurface=y.getOptimalTexture(i.width,i.height,r.resolution,r.antialias),r.backTexture=v.EMPTY,r.inputTexture=e,this.renderer.renderTarget.finishRenderPass(),this._applyFiltersToTexture(r,!0);const p=r.outputRenderSurface;return p.source.alphaMode="premultiplied-alpha",p}pop(){const e=this.renderer,t=this._popFilterData();t.skip||(e.globalUniforms.pop(),e.renderTarget.finishRenderPass(),this._activeFilterData=t,this._applyFiltersToTexture(t,!1),t.blendRequired&&y.returnTexture(t.backTexture),y.returnTexture(t.inputTexture))}getBackTexture(e,t,r){const a=e.colorTexture.source._resolution,s=y.getOptimalTexture(t.width,t.height,a,!1);let o=t.minX,i=t.minY;r&&(o-=r.minX,i-=r.minY),o=Math.floor(o*a),i=Math.floor(i*a);const u=Math.ceil(t.width*a),l=Math.ceil(t.height*a);return this.renderer.renderTarget.copyToTexture(e,s,{x:o,y:i},{width:u,height:l},{x:0,y:0}),s}applyFilter(e,t,r,a){const s=this.renderer,o=this._activeFilterData,i=o.outputRenderSurface,u=this._filterGlobalUniforms,l=u.uniforms,h=l.uOutputFrame,d=l.uInputSize,c=l.uInputPixel,p=l.uInputClamp,x=l.uGlobalFrame,g=l.uOutputTexture;i===r?(h[0]=o.outputOffset.x,h[1]=o.outputOffset.y):(h[0]=0,h[1]=0),h[2]=t.frame.width,h[3]=t.frame.height,d[0]=t.source.width,d[1]=t.source.height,d[2]=1/d[0],d[3]=1/d[1],c[0]=t.source.pixelWidth,c[1]=t.source.pixelHeight,c[2]=1/c[0],c[3]=1/c[1],p[0]=.5*c[2],p[1]=.5*c[3],p[2]=t.frame.width*d[2]-.5*c[2],p[3]=t.frame.height*d[3]-.5*c[3],x[0]=o.globalFrame.x,x[1]=o.globalFrame.y,x[2]=o.globalFrame.width,x[3]=o.globalFrame.height,r instanceof v&&(r.source.resource=null);const _=this.renderer.renderTarget.getRenderTarget(r);if(s.renderTarget.bind(r,!!a),r instanceof v?(g[0]=r.frame.width,g[1]=r.frame.height):(g[0]=_.width,g[1]=_.height),g[2]=_.isRoot?-1:1,u.update(),s.renderPipes.uniformBatch){const m=s.renderPipes.uniformBatch.getUboResource(u);this._globalFilterBindGroup.setResource(m,0)}else this._globalFilterBindGroup.setResource(u,0);this._globalFilterBindGroup.setResource(t.source,1),this._globalFilterBindGroup.setResource(t.source.style,2),e.groups[0]=this._globalFilterBindGroup,s.encoder.draw({geometry:rt,shader:e,state:e._state,topology:"triangle-list"}),s.type===H.WEBGL&&s.renderTarget.finishRenderPass()}calculateSpriteMatrix(e,t){const r=this._activeFilterData,a=e.set(r.inputTexture._source.width,0,0,r.inputTexture._source.height,r.bounds.minX,r.bounds.minY),s=t.worldTransform.copyTo(T.shared),o=t.renderGroup||t.parentRenderGroup;return o&&o.cacheToLocalTransform&&s.prepend(o.cacheToLocalTransform),s.invert(),a.prepend(s),a.scale(1/t.texture.frame.width,1/t.texture.frame.height),a.translate(t.anchor.x,t.anchor.y),a}destroy(){}_applyFiltersToTexture(e,t){const r=e.inputTexture,a=e.bounds,s=e.filters;if(this._globalFilterBindGroup.setResource(r.source.style,2),this._globalFilterBindGroup.setResource(e.backTexture.source,3),s.length===1)s[0].apply(this,r,e.outputRenderSurface,t);else{let o=e.inputTexture;const i=y.getOptimalTexture(a.width,a.height,o.source._resolution,!1);let u=i,l=0;for(l=0;l<s.length-1;++l){s[l].apply(this,o,u,!0);const d=o;o=u,u=d}s[l].apply(this,o,e.outputRenderSurface,t),y.returnTexture(i)}}_calculateFilterBounds(e,t,r,a,s){var g;const o=this.renderer,i=e.bounds,u=e.filters;let l=1/0,h=0,d=!0,c=!1,p=!1,x=!0;for(let _=0;_<u.length;_++){const m=u[_];if(l=Math.min(l,m.resolution==="inherit"?a:m.resolution),h+=m.padding,m.antialias==="off"?d=!1:m.antialias==="inherit"&&d&&(d=r),m.clipToViewport||(x=!1),!!!(m.compatibleRenderers&o.type)){p=!1;break}if(m.blendRequired&&!(((g=o.backBuffer)==null?void 0:g.useBackBuffer)??!0)){F("Blend filter requires backBuffer on WebGL renderer to be enabled. Set `useBackBuffer: true` in the renderer options."),p=!1;break}p=m.enabled||p,c||(c=m.blendRequired)}if(!p){e.skip=!0;return}if(x&&i.fitBounds(0,t.width/a,0,t.height/a),i.scale(l).ceil().scale(1/l).pad((h|0)*s),!i.isPositive){e.skip=!0;return}e.antialias=d,e.resolution=l,e.blendRequired=c}_popFilterData(){return this._filterStackIndex--,this._filterStack[this._filterStackIndex]}_getPreviousFilterData(){let e,t=this._filterStackIndex-1;for(;t>1&&(t--,e=this._filterStack[t],!!e.skip););return e}_pushFilterData(){let e=this._filterStack[this._filterStackIndex];return e||(e=this._filterStack[this._filterStackIndex]=new at),this._filterStackIndex++,e}}Te.extension={type:[f.WebGLSystem,f.WebGPUSystem],name:"filter"};function nt(n){const e=n._stroke,t=n._fill,a=[`div { ${[`color: ${P.shared.setValue(t.color).toHex()}`,`font-size: ${n.fontSize}px`,`font-family: ${n.fontFamily}`,`font-weight: ${n.fontWeight}`,`font-style: ${n.fontStyle}`,`font-variant: ${n.fontVariant}`,`letter-spacing: ${n.letterSpacing}px`,`text-align: ${n.align}`,`padding: ${n.padding}px`,`white-space: ${n.whiteSpace==="pre"&&n.wordWrap?"pre-wrap":n.whiteSpace}`,...n.lineHeight?[`line-height: ${n.lineHeight}px`]:[],...n.wordWrap?[`word-wrap: ${n.breakWords?"break-all":"break-word"}`,`max-width: ${n.wordWrapWidth}px`]:[],...e?[we(e)]:[],...n.dropShadow?[ve(n.dropShadow)]:[],...n.cssOverrides].join(";")} }`];return st(n.tagStyles,a),a.join(" ")}function ve(n){const e=P.shared.setValue(n.color).setAlpha(n.alpha).toHexa(),t=Math.round(Math.cos(n.angle)*n.distance),r=Math.round(Math.sin(n.angle)*n.distance),a=`${t}px ${r}px`;return n.blur>0?`text-shadow: ${a} ${n.blur}px ${e}`:`text-shadow: ${a} ${e}`}function we(n){return[`-webkit-text-stroke-width: ${n.width}px`,`-webkit-text-stroke-color: ${P.shared.setValue(n.color).toHex()}`,`text-stroke-width: ${n.width}px`,`text-stroke-color: ${P.shared.setValue(n.color).toHex()}`,"paint-order: stroke"].join(";")}const J={fontSize:"font-size: {{VALUE}}px",fontFamily:"font-family: {{VALUE}}",fontWeight:"font-weight: {{VALUE}}",fontStyle:"font-style: {{VALUE}}",fontVariant:"font-variant: {{VALUE}}",letterSpacing:"letter-spacing: {{VALUE}}px",align:"text-align: {{VALUE}}",padding:"padding: {{VALUE}}px",whiteSpace:"white-space: {{VALUE}}",lineHeight:"line-height: {{VALUE}}px",wordWrapWidth:"max-width: {{VALUE}}px"},Z={fill:n=>`color: ${P.shared.setValue(n).toHex()}`,breakWords:n=>`word-wrap: ${n?"break-all":"break-word"}`,stroke:we,dropShadow:ve};function st(n,e){for(const t in n){const r=n[t],a=[];for(const s in r)Z[s]?a.push(Z[s](r[s])):J[s]&&a.push(J[s].replace("{{VALUE}}",r[s]));e.push(`${t} { ${a.join(";")} }`)}}class j extends E{constructor(e={}){super(e),this._cssOverrides=[],this.cssOverrides=e.cssOverrides??[],this.tagStyles=e.tagStyles??{}}set cssOverrides(e){this._cssOverrides=e instanceof Array?e:[e],this.update()}get cssOverrides(){return this._cssOverrides}update(){this._cssStyle=null,super.update()}clone(){return new j({align:this.align,breakWords:this.breakWords,dropShadow:this.dropShadow?{...this.dropShadow}:null,fill:this._fill,fontFamily:this.fontFamily,fontSize:this.fontSize,fontStyle:this.fontStyle,fontVariant:this.fontVariant,fontWeight:this.fontWeight,letterSpacing:this.letterSpacing,lineHeight:this.lineHeight,padding:this.padding,stroke:this._stroke,whiteSpace:this.whiteSpace,wordWrap:this.wordWrap,wordWrapWidth:this.wordWrapWidth,cssOverrides:this.cssOverrides,tagStyles:{...this.tagStyles}})}get cssStyle(){return this._cssStyle||(this._cssStyle=nt(this)),this._cssStyle}addOverride(...e){const t=e.filter(r=>!this.cssOverrides.includes(r));t.length>0&&(this.cssOverrides.push(...t),this.update())}removeOverride(...e){const t=e.filter(r=>this.cssOverrides.includes(r));t.length>0&&(this.cssOverrides=this.cssOverrides.filter(r=>!t.includes(r)),this.update())}set fill(e){typeof e!="string"&&typeof e!="number"&&F("[HTMLTextStyle] only color fill is not supported by HTMLText"),super.fill=e}set stroke(e){e&&typeof e!="string"&&typeof e!="number"&&F("[HTMLTextStyle] only color stroke is not supported by HTMLText"),super.stroke=e}}const ee="http://www.w3.org/2000/svg",te="http://www.w3.org/1999/xhtml";class Se{constructor(){this.svgRoot=document.createElementNS(ee,"svg"),this.foreignObject=document.createElementNS(ee,"foreignObject"),this.domElement=document.createElementNS(te,"div"),this.styleElement=document.createElementNS(te,"style"),this.image=new Image;const{foreignObject:e,svgRoot:t,styleElement:r,domElement:a}=this;e.setAttribute("width","10000"),e.setAttribute("height","10000"),e.style.overflow="hidden",t.appendChild(e),e.appendChild(r),e.appendChild(a)}}let re;function ot(n,e,t,r){r||(r=re||(re=new Se));const{domElement:a,styleElement:s,svgRoot:o}=r;a.innerHTML=`<style>${e.cssStyle};</style><div style='padding:0'>${n}</div>`,a.setAttribute("style","transform-origin: top left; display: inline-block"),t&&(s.textContent=t),document.body.appendChild(o);const i=a.getBoundingClientRect();o.remove();const u=e.padding*2;return{width:i.width-u,height:i.height-u}}class it{constructor(){this.batches=[],this.batched=!1}destroy(){this.batches.forEach(e=>{G.return(e)}),this.batches.length=0}}class Pe{constructor(e,t){this.state=R.for2d(),this.renderer=e,this._adaptor=t,this.renderer.runners.contextChange.add(this)}contextChange(){this._adaptor.contextChange(this.renderer)}validateRenderable(e){const t=e.context,r=!!e._gpuData,a=this.renderer.graphicsContext.updateGpuContext(t);return!!(a.isBatchable||r!==a.isBatchable)}addRenderable(e,t){const r=this.renderer.graphicsContext.updateGpuContext(e.context);e.didViewUpdate&&this._rebuild(e),r.isBatchable?this._addToBatcher(e,t):(this.renderer.renderPipes.batch.break(t),t.add(e))}updateRenderable(e){const r=this._getGpuDataForRenderable(e).batches;for(let a=0;a<r.length;a++){const s=r[a];s._batcher.updateElement(s)}}execute(e){if(!e.isRenderable)return;const t=this.renderer,r=e.context;if(!t.graphicsContext.getGpuContext(r).batches.length)return;const s=r.customShader||this._adaptor.shader;this.state.blendMode=e.groupBlendMode;const o=s.resources.localUniforms.uniforms;o.uTransformMatrix=e.groupTransform,o.uRound=t._roundPixels|e._roundPixels,D(e.groupColorAlpha,o.uColor,0),this._adaptor.execute(this,e)}_rebuild(e){const t=this._getGpuDataForRenderable(e),r=this.renderer.graphicsContext.updateGpuContext(e.context);t.destroy(),r.isBatchable&&this._updateBatchesForRenderable(e,t)}_addToBatcher(e,t){const r=this.renderer.renderPipes.batch,a=this._getGpuDataForRenderable(e).batches;for(let s=0;s<a.length;s++){const o=a[s];r.addToBatch(o,t)}}_getGpuDataForRenderable(e){return e._gpuData[this.renderer.uid]||this._initGpuDataForRenderable(e)}_initGpuDataForRenderable(e){const t=new it;return e._gpuData[this.renderer.uid]=t,t}_updateBatchesForRenderable(e,t){const r=e.context,a=this.renderer.graphicsContext.getGpuContext(r),s=this.renderer._roundPixels|e._roundPixels;t.batches=a.batches.map(o=>{const i=G.get(ze);return o.copyTo(i),i.renderable=e,i.roundPixels=s,i})}destroy(){this.renderer=null,this._adaptor.destroy(),this._adaptor=null,this.state=null}}Pe.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"graphics"};class N{constructor(){this.batcherName="default",this.packAsQuad=!1,this.indexOffset=0,this.attributeOffset=0,this.roundPixels=0,this._batcher=null,this._batch=null,this._textureMatrixUpdateId=-1,this._uvUpdateId=-1}get blendMode(){return this.renderable.groupBlendMode}get topology(){return this._topology||this.geometry.topology}set topology(e){this._topology=e}reset(){this.renderable=null,this.texture=null,this._batcher=null,this._batch=null,this.geometry=null,this._uvUpdateId=-1,this._textureMatrixUpdateId=-1}setTexture(e){this.texture!==e&&(this.texture=e,this._textureMatrixUpdateId=-1)}get uvs(){const t=this.geometry.getBuffer("aUV"),r=t.data;let a=r;const s=this.texture.textureMatrix;return s.isSimple||(a=this._transformedUvs,(this._textureMatrixUpdateId!==s._updateID||this._uvUpdateId!==t._updateID)&&((!a||a.length<r.length)&&(a=this._transformedUvs=new Float32Array(r.length)),this._textureMatrixUpdateId=s._updateID,this._uvUpdateId=t._updateID,s.multiplyUvs(r,a))),a}get positions(){return this.geometry.positions}get indices(){return this.geometry.indices}get color(){return this.renderable.groupColorAlpha}get groupTransform(){return this.renderable.groupTransform}get attributeSize(){return this.geometry.positions.length/2}get indexSize(){return this.geometry.indices.length}}class ae{destroy(){}}class Ce{constructor(e,t){this.localUniforms=new S({uTransformMatrix:{value:new T,type:"mat3x3<f32>"},uColor:{value:new Float32Array([1,1,1,1]),type:"vec4<f32>"},uRound:{value:0,type:"f32"}}),this.localUniformsBindGroup=new le({0:this.localUniforms}),this.renderer=e,this._adaptor=t,this._adaptor.init()}validateRenderable(e){const t=this._getMeshData(e),r=t.batched,a=e.batched;if(t.batched=a,r!==a)return!0;if(a){const s=e._geometry;if(s.indices.length!==t.indexSize||s.positions.length!==t.vertexSize)return t.indexSize=s.indices.length,t.vertexSize=s.positions.length,!0;const o=this._getBatchableMesh(e);return o.texture.uid!==e._texture.uid&&(o._textureMatrixUpdateId=-1),!o._batcher.checkAndUpdateTexture(o,e._texture)}return!1}addRenderable(e,t){const r=this.renderer.renderPipes.batch,{batched:a}=this._getMeshData(e);if(a){const s=this._getBatchableMesh(e);s.setTexture(e._texture),s.geometry=e._geometry,r.addToBatch(s,t)}else r.break(t),t.add(e)}updateRenderable(e){if(e.batched){const t=this._getBatchableMesh(e);t.setTexture(e._texture),t.geometry=e._geometry,t._batcher.updateElement(t)}}execute(e){if(!e.isRenderable)return;e.state.blendMode=Y(e.groupBlendMode,e.texture._source);const t=this.localUniforms;t.uniforms.uTransformMatrix=e.groupTransform,t.uniforms.uRound=this.renderer._roundPixels|e._roundPixels,t.update(),D(e.groupColorAlpha,t.uniforms.uColor,0),this._adaptor.execute(this,e)}_getMeshData(e){var t,r;return(t=e._gpuData)[r=this.renderer.uid]||(t[r]=new ae),e._gpuData[this.renderer.uid].meshData||this._initMeshData(e)}_initMeshData(e){var t,r;return e._gpuData[this.renderer.uid].meshData={batched:e.batched,indexSize:(t=e._geometry.indices)==null?void 0:t.length,vertexSize:(r=e._geometry.positions)==null?void 0:r.length},e._gpuData[this.renderer.uid].meshData}_getBatchableMesh(e){var t,r;return(t=e._gpuData)[r=this.renderer.uid]||(t[r]=new ae),e._gpuData[this.renderer.uid].batchableMesh||this._initBatchableMesh(e)}_initBatchableMesh(e){const t=new N;return t.renderable=e,t.setTexture(e._texture),t.transform=e.groupTransform,t.roundPixels=this.renderer._roundPixels|e._roundPixels,e._gpuData[this.renderer.uid].batchableMesh=t,t}destroy(){this.localUniforms=null,this.localUniformsBindGroup=null,this._adaptor.destroy(),this._adaptor=null,this.renderer=null}}Ce.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"mesh"};class ut{execute(e,t){const r=e.state,a=e.renderer,s=t.shader||e.defaultShader;s.resources.uTexture=t.texture._source,s.resources.uniforms=e.localUniforms;const o=a.gl,i=e.getBuffers(t);a.shader.bind(s),a.state.set(r),a.geometry.bind(i.geometry,s.glProgram);const l=i.geometry.indexBuffer.data.BYTES_PER_ELEMENT===2?o.UNSIGNED_SHORT:o.UNSIGNED_INT;o.drawElements(o.TRIANGLES,t.particleChildren.length*6,l,0)}}class lt{execute(e,t){const r=e.renderer,a=t.shader||e.defaultShader;a.groups[0]=r.renderPipes.uniformBatch.getUniformBindGroup(e.localUniforms,!0),a.groups[1]=r.texture.getTextureBindGroup(t.texture);const s=e.state,o=e.getBuffers(t);r.encoder.draw({geometry:o.geometry,shader:t.shader||e.defaultShader,state:s,size:t.particleChildren.length*6})}}function ne(n,e=null){const t=n*6;if(t>65535?e||(e=new Uint32Array(t)):e||(e=new Uint16Array(t)),e.length!==t)throw new Error(`Out buffer length is incorrect, got ${e.length} and expected ${t}`);for(let r=0,a=0;r<t;r+=6,a+=4)e[r+0]=a+0,e[r+1]=a+1,e[r+2]=a+2,e[r+3]=a+0,e[r+4]=a+2,e[r+5]=a+3;return e}function dt(n){return{dynamicUpdate:se(n,!0),staticUpdate:se(n,!1)}}function se(n,e){const t=[];t.push(`

        var index = 0;

        for (let i = 0; i < ps.length; ++i)
        {
            const p = ps[i];

            `);let r=0;for(const s in n){const o=n[s];if(e!==o.dynamic)continue;t.push(`offset = index + ${r}`),t.push(o.code);const i=W(o.format);r+=i.stride/4}t.push(`
            index += stride * 4;
        }
    `),t.unshift(`
        var stride = ${r};
    `);const a=t.join(`
`);return new Function("ps","f32v","u32v",a)}class ct{constructor(e){this._size=0,this._generateParticleUpdateCache={};const t=this._size=e.size??1e3,r=e.properties;let a=0,s=0;for(const h in r){const d=r[h],c=W(d.format);d.dynamic?s+=c.stride:a+=c.stride}this._dynamicStride=s/4,this._staticStride=a/4,this.staticAttributeBuffer=new C(t*4*a),this.dynamicAttributeBuffer=new C(t*4*s),this.indexBuffer=ne(t);const o=new de;let i=0,u=0;this._staticBuffer=new Q({data:new Float32Array(1),label:"static-particle-buffer",shrinkToFit:!1,usage:U.VERTEX|U.COPY_DST}),this._dynamicBuffer=new Q({data:new Float32Array(1),label:"dynamic-particle-buffer",shrinkToFit:!1,usage:U.VERTEX|U.COPY_DST});for(const h in r){const d=r[h],c=W(d.format);d.dynamic?(o.addAttribute(d.attributeName,{buffer:this._dynamicBuffer,stride:this._dynamicStride*4,offset:i*4,format:d.format}),i+=c.size):(o.addAttribute(d.attributeName,{buffer:this._staticBuffer,stride:this._staticStride*4,offset:u*4,format:d.format}),u+=c.size)}o.addIndex(this.indexBuffer);const l=this.getParticleUpdate(r);this._dynamicUpload=l.dynamicUpdate,this._staticUpload=l.staticUpdate,this.geometry=o}getParticleUpdate(e){const t=ht(e);return this._generateParticleUpdateCache[t]?this._generateParticleUpdateCache[t]:(this._generateParticleUpdateCache[t]=this.generateParticleUpdate(e),this._generateParticleUpdateCache[t])}generateParticleUpdate(e){return dt(e)}update(e,t){e.length>this._size&&(t=!0,this._size=Math.max(e.length,this._size*1.5|0),this.staticAttributeBuffer=new C(this._size*this._staticStride*4*4),this.dynamicAttributeBuffer=new C(this._size*this._dynamicStride*4*4),this.indexBuffer=ne(this._size),this.geometry.indexBuffer.setDataWithSize(this.indexBuffer,this.indexBuffer.byteLength,!0));const r=this.dynamicAttributeBuffer;if(this._dynamicUpload(e,r.float32View,r.uint32View),this._dynamicBuffer.setDataWithSize(this.dynamicAttributeBuffer.float32View,e.length*this._dynamicStride*4,!0),t){const a=this.staticAttributeBuffer;this._staticUpload(e,a.float32View,a.uint32View),this._staticBuffer.setDataWithSize(a.float32View,e.length*this._staticStride*4,!0)}}destroy(){this._staticBuffer.destroy(),this._dynamicBuffer.destroy(),this.geometry.destroy()}}function ht(n){const e=[];for(const t in n){const r=n[t];e.push(t,r.code,r.dynamic?"d":"s")}return e.join("_")}var ft=`varying vec2 vUV;
varying vec4 vColor;

uniform sampler2D uTexture;

void main(void){
    vec4 color = texture2D(uTexture, vUV) * vColor;
    gl_FragColor = color;
}`,pt=`attribute vec2 aVertex;
attribute vec2 aUV;
attribute vec4 aColor;

attribute vec2 aPosition;
attribute float aRotation;

uniform mat3 uTranslationMatrix;
uniform float uRound;
uniform vec2 uResolution;
uniform vec4 uColor;

varying vec2 vUV;
varying vec4 vColor;

vec2 roundPixels(vec2 position, vec2 targetSize)
{       
    return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
}

void main(void){
    float cosRotation = cos(aRotation);
    float sinRotation = sin(aRotation);
    float x = aVertex.x * cosRotation - aVertex.y * sinRotation;
    float y = aVertex.x * sinRotation + aVertex.y * cosRotation;

    vec2 v = vec2(x, y);
    v = v + aPosition;

    gl_Position = vec4((uTranslationMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

    if(uRound == 1.0)
    {
        gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
    }

    vUV = aUV;
    vColor = vec4(aColor.rgb * aColor.a, aColor.a) * uColor;
}
`,oe=`
struct ParticleUniforms {
  uProjectionMatrix:mat3x3<f32>,
  uColor:vec4<f32>,
  uResolution:vec2<f32>,
  uRoundPixels:f32,
};

@group(0) @binding(0) var<uniform> uniforms: ParticleUniforms;

@group(1) @binding(0) var uTexture: texture_2d<f32>;
@group(1) @binding(1) var uSampler : sampler;

struct VSOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv : vec2<f32>,
    @location(1) color : vec4<f32>,
  };
@vertex
fn mainVertex(
  @location(0) aVertex: vec2<f32>,
  @location(1) aPosition: vec2<f32>,
  @location(2) aUV: vec2<f32>,
  @location(3) aColor: vec4<f32>,
  @location(4) aRotation: f32,
) -> VSOutput {
  
   let v = vec2(
       aVertex.x * cos(aRotation) - aVertex.y * sin(aRotation),
       aVertex.x * sin(aRotation) + aVertex.y * cos(aRotation)
   ) + aPosition;

   let position = vec4((uniforms.uProjectionMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

    let vColor = vec4(aColor.rgb * aColor.a, aColor.a) * uniforms.uColor;

  return VSOutput(
   position,
   aUV,
   vColor,
  );
}

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
  @location(1) color: vec4<f32>,
  @builtin(position) position: vec4<f32>,
) -> @location(0) vec4<f32> {

    var sample = textureSample(uTexture, uSampler, uv) * color;
   
    return sample;
}`;class mt extends X{constructor(){const e=Ee.from({vertex:pt,fragment:ft}),t=We.from({fragment:{source:oe,entryPoint:"mainFragment"},vertex:{source:oe,entryPoint:"mainVertex"}});super({glProgram:e,gpuProgram:t,resources:{uTexture:v.WHITE.source,uSampler:new L({}),uniforms:{uTranslationMatrix:{value:new T,type:"mat3x3<f32>"},uColor:{value:new P(16777215),type:"vec4<f32>"},uRound:{value:1,type:"f32"},uResolution:{value:[0,0],type:"vec2<f32>"}}}})}}class Ue{constructor(e,t){this.state=R.for2d(),this.localUniforms=new S({uTranslationMatrix:{value:new T,type:"mat3x3<f32>"},uColor:{value:new Float32Array(4),type:"vec4<f32>"},uRound:{value:1,type:"f32"},uResolution:{value:[0,0],type:"vec2<f32>"}}),this.renderer=e,this.adaptor=t,this.defaultShader=new mt,this.state=R.for2d()}validateRenderable(e){return!1}addRenderable(e,t){this.renderer.renderPipes.batch.break(t),t.add(e)}getBuffers(e){return e._gpuData[this.renderer.uid]||this._initBuffer(e)}_initBuffer(e){return e._gpuData[this.renderer.uid]=new ct({size:e.particleChildren.length,properties:e._properties}),e._gpuData[this.renderer.uid]}updateRenderable(e){}execute(e){const t=e.particleChildren;if(t.length===0)return;const r=this.renderer,a=this.getBuffers(e);e.texture||(e.texture=t[0].texture);const s=this.state;a.update(t,e._childrenDirty),e._childrenDirty=!1,s.blendMode=Y(e.blendMode,e.texture._source);const o=this.localUniforms.uniforms,i=o.uTranslationMatrix;e.worldTransform.copyTo(i),i.prepend(r.globalUniforms.globalUniformData.projectionMatrix),o.uResolution=r.globalUniforms.globalUniformData.resolution,o.uRound=r._roundPixels|e._roundPixels,D(e.groupColorAlpha,o.uColor,0),this.adaptor.execute(this,e)}destroy(){this.defaultShader&&(this.defaultShader.destroy(),this.defaultShader=null)}}class Be extends Ue{constructor(e){super(e,new ut)}}Be.extension={type:[f.WebGLPipes],name:"particle"};class Me extends Ue{constructor(e){super(e,new lt)}}Me.extension={type:[f.WebGPUPipes],name:"particle"};class gt extends N{constructor(){super(),this.geometry=new Le}destroy(){this.geometry.destroy()}}class Fe{constructor(e){this._renderer=e}addRenderable(e,t){const r=this._getGpuSprite(e);e.didViewUpdate&&this._updateBatchableSprite(e,r),this._renderer.renderPipes.batch.addToBatch(r,t)}updateRenderable(e){const t=this._getGpuSprite(e);e.didViewUpdate&&this._updateBatchableSprite(e,t),t._batcher.updateElement(t)}validateRenderable(e){const t=this._getGpuSprite(e);return!t._batcher.checkAndUpdateTexture(t,e._texture)}_updateBatchableSprite(e,t){t.geometry.update(e),t.setTexture(e._texture)}_getGpuSprite(e){return e._gpuData[this._renderer.uid]||this._initGPUSprite(e)}_initGPUSprite(e){const t=e._gpuData[this._renderer.uid]=new gt,r=t;return r.renderable=e,r.transform=e.groupTransform,r.texture=e._texture,r.roundPixels=this._renderer._roundPixels|e._roundPixels,e.didViewUpdate||this._updateBatchableSprite(e,r),t}destroy(){this._renderer=null}}Fe.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"nineSliceSprite"};const xt={name:"tiling-bit",vertex:{header:`
            struct TilingUniforms {
                uMapCoord:mat3x3<f32>,
                uClampFrame:vec4<f32>,
                uClampOffset:vec2<f32>,
                uTextureTransform:mat3x3<f32>,
                uSizeAnchor:vec4<f32>
            };

            @group(2) @binding(0) var<uniform> tilingUniforms: TilingUniforms;
            @group(2) @binding(1) var uTexture: texture_2d<f32>;
            @group(2) @binding(2) var uSampler: sampler;
        `,main:`
            uv = (tilingUniforms.uTextureTransform * vec3(uv, 1.0)).xy;

            position = (position - tilingUniforms.uSizeAnchor.zw) * tilingUniforms.uSizeAnchor.xy;
        `},fragment:{header:`
            struct TilingUniforms {
                uMapCoord:mat3x3<f32>,
                uClampFrame:vec4<f32>,
                uClampOffset:vec2<f32>,
                uTextureTransform:mat3x3<f32>,
                uSizeAnchor:vec4<f32>
            };

            @group(2) @binding(0) var<uniform> tilingUniforms: TilingUniforms;
            @group(2) @binding(1) var uTexture: texture_2d<f32>;
            @group(2) @binding(2) var uSampler: sampler;
        `,main:`

            var coord = vUV + ceil(tilingUniforms.uClampOffset - vUV);
            coord = (tilingUniforms.uMapCoord * vec3(coord, 1.0)).xy;
            var unclamped = coord;
            coord = clamp(coord, tilingUniforms.uClampFrame.xy, tilingUniforms.uClampFrame.zw);

            var bias = 0.;

            if(unclamped.x == coord.x && unclamped.y == coord.y)
            {
                bias = -32.;
            }

            outColor = textureSampleBias(uTexture, uSampler, coord, bias);
        `}},_t={name:"tiling-bit",vertex:{header:`
            uniform mat3 uTextureTransform;
            uniform vec4 uSizeAnchor;

        `,main:`
            uv = (uTextureTransform * vec3(aUV, 1.0)).xy;

            position = (position - uSizeAnchor.zw) * uSizeAnchor.xy;
        `},fragment:{header:`
            uniform sampler2D uTexture;
            uniform mat3 uMapCoord;
            uniform vec4 uClampFrame;
            uniform vec2 uClampOffset;
        `,main:`

        vec2 coord = vUV + ceil(uClampOffset - vUV);
        coord = (uMapCoord * vec3(coord, 1.0)).xy;
        vec2 unclamped = coord;
        coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);

        outColor = texture(uTexture, coord, unclamped == coord ? 0.0 : -32.0);// lod-bias very negative to force lod 0

        `}};let k,V;class bt extends X{constructor(){k??(k=he({name:"tiling-sprite-shader",bits:[Ze,xt,fe]})),V??(V=pe({name:"tiling-sprite-shader",bits:[et,_t,me]}));const e=new S({uMapCoord:{value:new T,type:"mat3x3<f32>"},uClampFrame:{value:new Float32Array([0,0,1,1]),type:"vec4<f32>"},uClampOffset:{value:new Float32Array([0,0]),type:"vec2<f32>"},uTextureTransform:{value:new T,type:"mat3x3<f32>"},uSizeAnchor:{value:new Float32Array([100,100,.5,.5]),type:"vec4<f32>"}});super({glProgram:V,gpuProgram:k,resources:{localUniforms:new S({uTransformMatrix:{value:new T,type:"mat3x3<f32>"},uColor:{value:new Float32Array([1,1,1,1]),type:"vec4<f32>"},uRound:{value:0,type:"f32"}}),tilingUniforms:e,uTexture:v.EMPTY.source,uSampler:v.EMPTY.source.style}})}updateUniforms(e,t,r,a,s,o){const i=this.resources.tilingUniforms,u=o.width,l=o.height,h=o.textureMatrix,d=i.uniforms.uTextureTransform;d.set(r.a*u/e,r.b*u/t,r.c*l/e,r.d*l/t,r.tx/e,r.ty/t),d.invert(),i.uniforms.uMapCoord=h.mapCoord,i.uniforms.uClampFrame=h.uClampFrame,i.uniforms.uClampOffset=h.uClampOffset,i.uniforms.uTextureTransform=d,i.uniforms.uSizeAnchor[0]=e,i.uniforms.uSizeAnchor[1]=t,i.uniforms.uSizeAnchor[2]=a,i.uniforms.uSizeAnchor[3]=s,o&&(this.resources.uTexture=o.source,this.resources.uSampler=o.source.style)}}class yt extends ge{constructor(){super({positions:new Float32Array([0,0,1,0,1,1,0,1]),uvs:new Float32Array([0,0,1,0,1,1,0,1]),indices:new Uint32Array([0,1,2,0,2,3])})}}function Tt(n,e){const t=n.anchor.x,r=n.anchor.y;e[0]=-t*n.width,e[1]=-r*n.height,e[2]=(1-t)*n.width,e[3]=-r*n.height,e[4]=(1-t)*n.width,e[5]=(1-r)*n.height,e[6]=-t*n.width,e[7]=(1-r)*n.height}function vt(n,e,t,r){let a=0;const s=n.length/e,o=r.a,i=r.b,u=r.c,l=r.d,h=r.tx,d=r.ty;for(t*=e;a<s;){const c=n[t],p=n[t+1];n[t]=o*c+u*p+h,n[t+1]=i*c+l*p+d,t+=e,a++}}function wt(n,e){const t=n.texture,r=t.frame.width,a=t.frame.height;let s=0,o=0;n.applyAnchorToTexture&&(s=n.anchor.x,o=n.anchor.y),e[0]=e[6]=-s,e[2]=e[4]=1-s,e[1]=e[3]=-o,e[5]=e[7]=1-o;const i=T.shared;i.copyFrom(n._tileTransform.matrix),i.tx/=n.width,i.ty/=n.height,i.invert(),i.scale(n.width/r,n.height/a),vt(e,2,0,i)}const M=new yt;class St{constructor(){this.canBatch=!0,this.geometry=new ge({indices:M.indices.slice(),positions:M.positions.slice(),uvs:M.uvs.slice()})}destroy(){var e;this.geometry.destroy(),(e=this.shader)==null||e.destroy()}}class Re{constructor(e){this._state=R.default2d,this._renderer=e}validateRenderable(e){const t=this._getTilingSpriteData(e),r=t.canBatch;this._updateCanBatch(e);const a=t.canBatch;if(a&&a===r){const{batchableMesh:s}=t;return!s._batcher.checkAndUpdateTexture(s,e.texture)}return r!==a}addRenderable(e,t){const r=this._renderer.renderPipes.batch;this._updateCanBatch(e);const a=this._getTilingSpriteData(e),{geometry:s,canBatch:o}=a;if(o){a.batchableMesh||(a.batchableMesh=new N);const i=a.batchableMesh;e.didViewUpdate&&(this._updateBatchableMesh(e),i.geometry=s,i.renderable=e,i.transform=e.groupTransform,i.setTexture(e._texture)),i.roundPixels=this._renderer._roundPixels|e._roundPixels,r.addToBatch(i,t)}else r.break(t),a.shader||(a.shader=new bt),this.updateRenderable(e),t.add(e)}execute(e){const{shader:t}=this._getTilingSpriteData(e);t.groups[0]=this._renderer.globalUniforms.bindGroup;const r=t.resources.localUniforms.uniforms;r.uTransformMatrix=e.groupTransform,r.uRound=this._renderer._roundPixels|e._roundPixels,D(e.groupColorAlpha,r.uColor,0),this._state.blendMode=Y(e.groupBlendMode,e.texture._source),this._renderer.encoder.draw({geometry:M,shader:t,state:this._state})}updateRenderable(e){const t=this._getTilingSpriteData(e),{canBatch:r}=t;if(r){const{batchableMesh:a}=t;e.didViewUpdate&&this._updateBatchableMesh(e),a._batcher.updateElement(a)}else if(e.didViewUpdate){const{shader:a}=t;a.updateUniforms(e.width,e.height,e._tileTransform.matrix,e.anchor.x,e.anchor.y,e.texture)}}_getTilingSpriteData(e){return e._gpuData[this._renderer.uid]||this._initTilingSpriteData(e)}_initTilingSpriteData(e){const t=new St;return t.renderable=e,e._gpuData[this._renderer.uid]=t,t}_updateBatchableMesh(e){const t=this._getTilingSpriteData(e),{geometry:r}=t,a=e.texture.source.style;a.addressMode!=="repeat"&&(a.addressMode="repeat",a.update()),wt(e,r.uvs),Tt(e,r.positions)}destroy(){this._renderer=null}_updateCanBatch(e){const t=this._getTilingSpriteData(e),r=e.texture;let a=!0;return this._renderer.type===H.WEBGL&&(a=this._renderer.context.supports.nonPowOf2wrapping),t.canBatch=r.textureMatrix.isSimple&&(a||r.source.isPowerOfTwo),t.canBatch}}Re.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"tilingSprite"};const Pt={name:"local-uniform-msdf-bit",vertex:{header:`
            struct LocalUniforms {
                uColor:vec4<f32>,
                uTransformMatrix:mat3x3<f32>,
                uDistance: f32,
                uRound:f32,
            }

            @group(2) @binding(0) var<uniform> localUniforms : LocalUniforms;
        `,main:`
            vColor *= localUniforms.uColor;
            modelMatrix *= localUniforms.uTransformMatrix;
        `,end:`
            if(localUniforms.uRound == 1)
            {
                vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
            }
        `},fragment:{header:`
            struct LocalUniforms {
                uColor:vec4<f32>,
                uTransformMatrix:mat3x3<f32>,
                uDistance: f32
            }

            @group(2) @binding(0) var<uniform> localUniforms : LocalUniforms;
         `,main:`
            outColor = vec4<f32>(calculateMSDFAlpha(outColor, localUniforms.uColor, localUniforms.uDistance));
        `}},Ct={name:"local-uniform-msdf-bit",vertex:{header:`
            uniform mat3 uTransformMatrix;
            uniform vec4 uColor;
            uniform float uRound;
        `,main:`
            vColor *= uColor;
            modelMatrix *= uTransformMatrix;
        `,end:`
            if(uRound == 1.)
            {
                gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
            }
        `},fragment:{header:`
            uniform float uDistance;
         `,main:`
            outColor = vec4(calculateMSDFAlpha(outColor, vColor, uDistance));
        `}},Ut={name:"msdf-bit",fragment:{header:`
            fn calculateMSDFAlpha(msdfColor:vec4<f32>, shapeColor:vec4<f32>, distance:f32) -> f32 {

                // MSDF
                var median = msdfColor.r + msdfColor.g + msdfColor.b -
                    min(msdfColor.r, min(msdfColor.g, msdfColor.b)) -
                    max(msdfColor.r, max(msdfColor.g, msdfColor.b));

                // SDF
                median = min(median, msdfColor.a);

                var screenPxDistance = distance * (median - 0.5);
                var alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);
                if (median < 0.01) {
                    alpha = 0.0;
                } else if (median > 0.99) {
                    alpha = 1.0;
                }

                // Gamma correction for coverage-like alpha
                var luma: f32 = dot(shapeColor.rgb, vec3<f32>(0.299, 0.587, 0.114));
                var gamma: f32 = mix(1.0, 1.0 / 2.2, luma);
                var coverage: f32 = pow(shapeColor.a * alpha, gamma);

                return coverage;

            }
        `}},Bt={name:"msdf-bit",fragment:{header:`
            float calculateMSDFAlpha(vec4 msdfColor, vec4 shapeColor, float distance) {

                // MSDF
                float median = msdfColor.r + msdfColor.g + msdfColor.b -
                                min(msdfColor.r, min(msdfColor.g, msdfColor.b)) -
                                max(msdfColor.r, max(msdfColor.g, msdfColor.b));

                // SDF
                median = min(median, msdfColor.a);

                float screenPxDistance = distance * (median - 0.5);
                float alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);

                if (median < 0.01) {
                    alpha = 0.0;
                } else if (median > 0.99) {
                    alpha = 1.0;
                }

                // Gamma correction for coverage-like alpha
                float luma = dot(shapeColor.rgb, vec3(0.299, 0.587, 0.114));
                float gamma = mix(1.0, 1.0 / 2.2, luma);
                float coverage = pow(shapeColor.a * alpha, gamma);

                return coverage;
            }
        `}};let O,z;class Mt extends X{constructor(e){const t=new S({uColor:{value:new Float32Array([1,1,1,1]),type:"vec4<f32>"},uTransformMatrix:{value:new T,type:"mat3x3<f32>"},uDistance:{value:4,type:"f32"},uRound:{value:0,type:"f32"}});O??(O=he({name:"sdf-shader",bits:[Ie,$e(e),Pt,Ut,fe]})),z??(z=pe({name:"sdf-shader",bits:[He,Ye(e),Ct,Bt,me]})),super({glProgram:z,gpuProgram:O,resources:{localUniforms:t,batchSamplers:Xe(e)}})}}class Ft extends Qe{destroy(){this.context.customShader&&this.context.customShader.destroy(),super.destroy()}}class Ge{constructor(e){this._renderer=e,this._renderer.renderableGC.addManagedHash(this,"_gpuBitmapText")}validateRenderable(e){const t=this._getGpuBitmapText(e);return e._didTextUpdate&&(e._didTextUpdate=!1,this._updateContext(e,t)),this._renderer.renderPipes.graphics.validateRenderable(t)}addRenderable(e,t){const r=this._getGpuBitmapText(e);ie(e,r),e._didTextUpdate&&(e._didTextUpdate=!1,this._updateContext(e,r)),this._renderer.renderPipes.graphics.addRenderable(r,t),r.context.customShader&&this._updateDistanceField(e)}updateRenderable(e){const t=this._getGpuBitmapText(e);ie(e,t),this._renderer.renderPipes.graphics.updateRenderable(t),t.context.customShader&&this._updateDistanceField(e)}_updateContext(e,t){const{context:r}=t,a=je.getFont(e.text,e._style);r.clear(),a.distanceField.type!=="none"&&(r.customShader||(r.customShader=new Mt(this._renderer.limits.maxBatchableTextures)));const s=Ne.graphemeSegmenter(e.text),o=e._style;let i=a.baseLineOffset;const u=qe(s,o,a,!0);let l=0;const h=o.padding,d=u.scale;let c=u.width,p=u.height+u.offsetY;o._stroke&&(c+=o._stroke.width/d,p+=o._stroke.width/d),r.translate(-e._anchor._x*c-h,-e._anchor._y*p-h).scale(d,d);const x=a.applyFillAsTint?o._fill.color:16777215;for(let g=0;g<u.lines.length;g++){const _=u.lines[g];for(let m=0;m<_.charPositions.length;m++){const q=s[l++],w=a.chars[q];w!=null&&w.texture&&r.texture(w.texture,x||"black",Math.round(_.charPositions[m]+w.xOffset),Math.round(i+w.yOffset))}i+=a.lineHeight}}_getGpuBitmapText(e){return e._gpuData[this._renderer.uid]||this.initGpuText(e)}initGpuText(e){const t=new Ft;return e._gpuData[this._renderer.uid]=t,this._updateContext(e,t),t}_updateDistanceField(e){const t=this._getGpuBitmapText(e).context,r=e._style.fontFamily,a=I.get(`${r}-bitmap`),{a:s,b:o,c:i,d:u}=e.groupTransform,l=Math.sqrt(s*s+o*o),h=Math.sqrt(i*i+u*u),d=(Math.abs(l)+Math.abs(h))/2,c=a.baseRenderedFontSize/e._style.fontSize,p=d*a.distanceField.range*(1/c);t.customShader.resources.localUniforms.uniforms.uDistance=p}destroy(){this._renderer=null}}Ge.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"bitmapText"};function ie(n,e){e.groupTransform=n.groupTransform,e.groupColorAlpha=n.groupColorAlpha,e.groupColor=n.groupColor,e.groupBlendMode=n.groupBlendMode,e.globalDisplayStatus=n.globalDisplayStatus,e.groupTransform=n.groupTransform,e.localDisplayStatus=n.localDisplayStatus,e.groupAlpha=n.groupAlpha,e._roundPixels=n._roundPixels}class Rt extends be{constructor(e){super(),this.generatingTexture=!1,this._renderer=e,e.runners.resolutionChange.add(this)}resolutionChange(){const e=this.renderable;e._autoResolution&&e.onViewUpdate()}destroy(){this._renderer.htmlText.returnTexturePromise(this.texturePromise),this.texturePromise=null,this._renderer=null}}function $(n,e){const{texture:t,bounds:r}=n;Ke(r,e._anchor,t);const a=e._style._getFinalPadding();r.minX-=a,r.minY-=a,r.maxX-=a,r.maxY-=a}class De{constructor(e){this._renderer=e}validateRenderable(e){return e._didTextUpdate}addRenderable(e,t){const r=this._getGpuText(e);e._didTextUpdate&&(this._updateGpuText(e).catch(a=>{console.error(a)}),e._didTextUpdate=!1,$(r,e)),this._renderer.renderPipes.batch.addToBatch(r,t)}updateRenderable(e){const t=this._getGpuText(e);t._batcher.updateElement(t)}async _updateGpuText(e){e._didTextUpdate=!1;const t=this._getGpuText(e);if(t.generatingTexture)return;t.texturePromise&&(this._renderer.htmlText.returnTexturePromise(t.texturePromise),t.texturePromise=null),t.generatingTexture=!0,e._resolution=e._autoResolution?this._renderer.resolution:e.resolution;const r=this._renderer.htmlText.getTexturePromise(e);t.texturePromise=r,t.texture=await r;const a=e.renderGroup||e.parentRenderGroup;a&&(a.structureDidChange=!0),t.generatingTexture=!1,$(t,e)}_getGpuText(e){return e._gpuData[this._renderer.uid]||this.initGpuText(e)}initGpuText(e){const t=new Rt(this._renderer);return t.renderable=e,t.transform=e.groupTransform,t.texture=v.EMPTY,t.bounds={minX:0,maxX:1,minY:0,maxY:0},t.roundPixels=this._renderer._roundPixels|e._roundPixels,e._resolution=e._autoResolution?this._renderer.resolution:e.resolution,e._gpuData[this._renderer.uid]=t,t}destroy(){this._renderer=null}}De.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"htmlText"};function Gt(){const{userAgent:n}=xe.get().getNavigator();return/^((?!chrome|android).)*safari/i.test(n)}const Dt=new ce;function Ae(n,e,t,r){const a=Dt;a.minX=0,a.minY=0,a.maxX=n.width/r|0,a.maxY=n.height/r|0;const s=y.getOptimalTexture(a.width,a.height,r,!1);return s.source.uploadMethodId="image",s.source.resource=n,s.source.alphaMode="premultiply-alpha-on-upload",s.frame.width=e/r,s.frame.height=t/r,s.source.emit("update",s.source),s.updateUvs(),s}function At(n,e){const t=e.fontFamily,r=[],a={},s=/font-family:([^;"\s]+)/g,o=n.match(s);function i(u){a[u]||(r.push(u),a[u]=!0)}if(Array.isArray(t))for(let u=0;u<t.length;u++)i(t[u]);else i(t);o&&o.forEach(u=>{const l=u.split(":")[1].trim();i(l)});for(const u in e.tagStyles){const l=e.tagStyles[u].fontFamily;i(l)}return r}async function kt(n){const t=await(await xe.get().fetch(n)).blob(),r=new FileReader;return await new Promise((s,o)=>{r.onloadend=()=>s(r.result),r.onerror=o,r.readAsDataURL(t)})}async function ue(n,e){const t=await kt(e);return`@font-face {
        font-family: "${n.fontFamily}";
        src: url('${t}');
        font-weight: ${n.fontWeight};
        font-style: ${n.fontStyle};
    }`}const B=new Map;async function Vt(n,e,t){const r=n.filter(a=>I.has(`${a}-and-url`)).map((a,s)=>{if(!B.has(a)){const{url:o}=I.get(`${a}-and-url`);s===0?B.set(a,ue({fontWeight:e.fontWeight,fontStyle:e.fontStyle,fontFamily:a},o)):B.set(a,ue({fontWeight:t.fontWeight,fontStyle:t.fontStyle,fontFamily:a},o))}return B.get(a)});return(await Promise.all(r)).join(`
`)}function Ot(n,e,t,r,a){const{domElement:s,styleElement:o,svgRoot:i}=a;s.innerHTML=`<style>${e.cssStyle}</style><div style='padding:0;'>${n}</div>`,s.setAttribute("style",`transform: scale(${t});transform-origin: top left; display: inline-block`),o.textContent=r;const{width:u,height:l}=a.image;return i.setAttribute("width",u.toString()),i.setAttribute("height",l.toString()),new XMLSerializer().serializeToString(i)}function zt(n,e){const t=_e.getOptimalCanvasAndContext(n.width,n.height,e),{context:r}=t;return r.clearRect(0,0,n.width,n.height),r.drawImage(n,0,0),t}function Et(n,e,t){return new Promise(async r=>{t&&await new Promise(a=>setTimeout(a,100)),n.onload=()=>{r()},n.src=`data:image/svg+xml;charset=utf8,${encodeURIComponent(e)}`,n.crossOrigin="anonymous"})}class ke{constructor(e){this._renderer=e,this._createCanvas=e.type===H.WEBGPU}getTexture(e){return this.getTexturePromise(e)}getTexturePromise(e){return this._buildTexturePromise(e)}async _buildTexturePromise(e){const{text:t,style:r,resolution:a,textureStyle:s}=e,o=G.get(Se),i=At(t,r),u=await Vt(i,r,j.defaultTextStyle),l=ot(t,r,u,o),h=Math.ceil(Math.ceil(Math.max(1,l.width)+r.padding*2)*a),d=Math.ceil(Math.ceil(Math.max(1,l.height)+r.padding*2)*a),c=o.image,p=2;c.width=(h|0)+p,c.height=(d|0)+p;const x=Ot(t,r,a,u,o);await Et(c,x,Gt()&&i.length>0);const g=c;let _;this._createCanvas&&(_=zt(c,a));const m=Ae(_?_.canvas:g,c.width-p,c.height-p,a);return s&&(m.source.style=s),this._createCanvas&&(this._renderer.texture.initSource(m.source),_e.returnCanvasAndContext(_)),G.return(o),m}returnTexturePromise(e){e.then(t=>{this._cleanUp(t)}).catch(()=>{F("HTMLTextSystem: Failed to clean texture")})}_cleanUp(e){y.returnTexture(e,!0),e.source.resource=null,e.source.uploadMethodId="unknown"}destroy(){this._renderer=null}}ke.extension={type:[f.WebGLSystem,f.WebGPUSystem,f.CanvasSystem],name:"htmlText"};class Wt extends be{constructor(e){super(),this._renderer=e,e.runners.resolutionChange.add(this)}resolutionChange(){const e=this.renderable;e._autoResolution&&e.onViewUpdate()}destroy(){this._renderer.canvasText.returnTexture(this.texture),this._renderer=null}}class Ve{constructor(e){this._renderer=e}validateRenderable(e){return e._didTextUpdate}addRenderable(e,t){const r=this._getGpuText(e);e._didTextUpdate&&(this._updateGpuText(e),e._didTextUpdate=!1),this._renderer.renderPipes.batch.addToBatch(r,t)}updateRenderable(e){const t=this._getGpuText(e);t._batcher.updateElement(t)}_updateGpuText(e){const t=this._getGpuText(e);t.texture&&this._renderer.canvasText.returnTexture(t.texture),e._resolution=e._autoResolution?this._renderer.resolution:e.resolution,t.texture=t.texture=this._renderer.canvasText.getTexture(e),$(t,e)}_getGpuText(e){return e._gpuData[this._renderer.uid]||this.initGpuText(e)}initGpuText(e){const t=new Wt(this._renderer);return t.renderable=e,t.transform=e.groupTransform,t.bounds={minX:0,maxX:1,minY:0,maxY:0},t.roundPixels=this._renderer._roundPixels|e._roundPixels,e._gpuData[this._renderer.uid]=t,t}destroy(){this._renderer=null}}Ve.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"text"};class Oe{constructor(e){this._renderer=e}getTexture(e,t,r,a){typeof e=="string"&&(K("8.0.0","CanvasTextSystem.getTexture: Use object TextOptions instead of separate arguments"),e={text:e,style:r,resolution:t}),e.style instanceof E||(e.style=new E(e.style)),e.textureStyle instanceof L||(e.textureStyle=new L(e.textureStyle)),typeof e.text!="string"&&(e.text=e.text.toString());const{text:s,style:o,textureStyle:i}=e,u=e.resolution??this._renderer.resolution,{frame:l,canvasAndContext:h}=A.getCanvasAndContext({text:s,style:o,resolution:u}),d=Ae(h.canvas,l.width,l.height,u);if(i&&(d.source.style=i),o.trim&&(l.pad(o.padding),d.frame.copyFrom(l),d.updateUvs()),o.filters){const c=this._applyFilters(d,o.filters);return this.returnTexture(d),A.returnCanvasAndContext(h),c}return this._renderer.texture.initSource(d._source),A.returnCanvasAndContext(h),d}returnTexture(e){const t=e.source;t.resource=null,t.uploadMethodId="unknown",t.alphaMode="no-premultiply-alpha",y.returnTexture(e,!0)}renderTextToCanvas(){K("8.10.0","CanvasTextSystem.renderTextToCanvas: no longer supported, use CanvasTextSystem.getTexture instead")}_applyFilters(e,t){const r=this._renderer.renderTarget.renderTarget,a=this._renderer.filter.generateFilteredTexture({texture:e,filters:t});return this._renderer.renderTarget.bind(r,!1),a}destroy(){this._renderer=null}}Oe.extension={type:[f.WebGLSystem,f.WebGPUSystem,f.CanvasSystem],name:"canvasText"};b.add(Pe);b.add(Je);b.add(Ce);b.add(Be);b.add(Me);b.add(Oe);b.add(Ve);b.add(Ge);b.add(ke);b.add(De);b.add(Re);b.add(Fe);b.add(Te);b.add(ye);
