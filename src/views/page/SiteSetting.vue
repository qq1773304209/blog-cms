<template>
	<div>
		<!--面包屑导航-->
		<Breadcrumb parentTitle="页面管理"/>

			<el-row :gutter="20">
				<el-col :span="12">
					<el-card>
						<div slot="header">
							<span>基础设置</span>
						</div>
						<el-form label-position="right" label-width="100px">
							<el-form-item :label="item.nameZh" v-for="item in typeMap.type1" :key="item.id">
								<div v-if="item.nameEn=='footerImgUrl' || item.nameEn=='reward'">
									<el-col :span="20">
										<el-input v-model="item.value"></el-input>
									</el-col>
									<el-col :span="4">
										<el-upload
												class="upload-demo"
												:action="uploadFileUrl"
												:headers="myHeaders"
												accept="image/jpeg,image/gif,image/png"
												name="file"
												ref="uploadFooter"
												:auto-upload="true"
												:before-upload="onBeforeUpload"
												multiple
												:on-exceed="handleExceed"
												:on-success="uploadSuccess"
												:on-error="uploadError"
												:show-file-list="false"
												:file-list="fileList">
											<el-button type="primary"  @click="submitUpload(item.id)">上传</el-button>
										</el-upload>
									</el-col>
								</div>
								<div v-else>
									<el-input v-model="item.value"></el-input>
								</div>
							</el-form-item>
						</el-form>
					</el-card>
				</el-col>
				<el-col :span="12">
					<el-card>
						<div slot="header">
							<span>资料卡</span>
						</div>
						<el-form label-position="right" label-width="100px">
							<el-form-item :label="item.nameZh" v-for="item in typeMap.type3" :key="item.id">
								<div v-if="item.nameEn=='favorite'">
									<el-col :span="20">
										<el-input v-model="item.value"></el-input>
									</el-col>
									<el-col :span="4">
										<el-button type="danger" icon="el-icon-delete" @click="deleteFavorite(item)">删除</el-button>
									</el-col>
								</div>
								<div v-else-if="item.nameEn=='avatar'">
									<el-col :span="20">
										<el-input v-model="item.value"></el-input>
									</el-col>
									<el-col :span="4">
										<el-upload
												class="upload-demo"
												:action="uploadFileUrl"
												:headers="myHeaders"
												accept="image/jpeg,image/gif,image/png"
												name="file"
												ref="uploadAvatar"
												:auto-upload="true"
												:before-upload="onBeforeUpload"
												multiple
												:on-exceed="handleExceed"
												:on-success="uploadSuccess"
												:on-error="uploadError"
												:show-file-list="false"
												:file-list="fileList">
											<el-button type="primary" @click="submitUpload(item.id)">上传</el-button>
										</el-upload>
									</el-col>
								</div>
								<div v-else>
									<el-input v-model="item.value"></el-input>
								</div>
							</el-form-item>
							<el-button type="primary" size="mini" icon="el-icon-plus" @click="addFavorite">添加自定义</el-button>
						</el-form>
					</el-card>
				</el-col>
			</el-row>

			<el-row style="margin-top: 20px">
				<el-card>
					<div slot="header">
						<span>页脚徽标</span>
					</div>
					<el-form :inline="true" v-for="badge in typeMap.type2" :key="badge.id">
						<el-form-item label="title">
							<el-input v-model="badge.value.title"></el-input>
						</el-form-item>
						<el-form-item label="url">
							<el-input v-model="badge.value.url"></el-input>
						</el-form-item>
						<el-form-item label="subject">
							<el-input v-model="badge.value.subject"></el-input>
						</el-form-item>
						<el-form-item label="value">
							<el-input v-model="badge.value.value"></el-input>
						</el-form-item>
						<el-form-item label="color">
							<el-input v-model="badge.value.color"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="danger" icon="el-icon-delete" @click="deleteBadge(badge)">删除</el-button>
						</el-form-item>
					</el-form>
					<el-button type="primary" size="mini" icon="el-icon-plus" @click="addBadge">添加 badge</el-button>
				</el-card>
			</el-row>

			<div style="text-align: right;margin-top: 30px">
				<el-button type="primary" icon="el-icon-check" @click="submit">保存</el-button>
			</div>
	</div>
</template>

<script>
	import Breadcrumb from "@/components/Breadcrumb";
	import {getSiteSettingData, update} from "@/api/siteSetting";
	import _ from 'lodash'

	var token = window.localStorage.getItem('token')

	export default {
		name: "SiteSetting",
		components: {Breadcrumb},
		data() {
			return {
				deleteIds: [],
				typeMap: {},
				uploadFileUrl: "http://localhost:8090/admin/uploadimages",
				myHeaders: {Authorization: token},
				fileList: [],
				id: "",
				obj: null,
			}
		},
		created() {
			this.getData()
		},
		methods: {
			getData() {
				getSiteSettingData().then(res => {
					if (res.code === 200) {
						this.typeMap = res.data
						res.data.type2.forEach(item => {
							item.value = JSON.parse(item.value)  // json转对象
						})
						this.msgSuccess(res.msg)
					} else {
						this.msgError(res.msg)
					}
				}).catch(() => {
					this.msgError("请求失败")
				})
			},
			addFavorite() {
				this.typeMap.type3.push({
					key: Date.now(),
					nameEn: "favorite",
					nameZh: "自定义",
					type: 3,
					value: "{\"title\":\"\",\"content\":\"\"}"
				})
			},
			addBadge() {
				this.typeMap.type2.push({
					key: Date.now(),
					nameEn: "badge",
					nameZh: "徽标",
					type: 2,
					value: {
						color: "",
						subject: "",
						title: "",
						url: "",
						value: ""
					}
				})
			},
			deleteFavorite(favorite) {
				let arr = this.typeMap.type3
				if (favorite.id) {
					this.deleteIds.push(favorite.id)
					arr.forEach((item, index) => {
						if (item.id === favorite.id) {
							arr.splice(index, 1)
							return
						}
					})
				} else {
					arr.forEach((item, index) => {
						if (item.key === favorite.key) {
							arr.splice(index, 1)
							return
						}
					})
				}
			},
			deleteBadge(badge) {
				let arr = this.typeMap.type2
				if (badge.id) {
					this.deleteIds.push(badge.id)
					arr.forEach((item, index) => {
						if (item.id === badge.id) {
							arr.splice(index, 1)
							return
						}
					})
				} else {
					arr.forEach((item, index) => {
						if (item.key === badge.key) {
							arr.splice(index, 1)
							return
						}
					})
				}
			},
			submit() {
				const result = _.cloneDeep(this.typeMap)
				result.type2.forEach(item => {
					item.value = JSON.stringify(item.value)
				})
				let updateArr = []
				updateArr.push(...result.type1)
				updateArr.push(...result.type2)
				updateArr.push(...result.type3)
				update(updateArr, this.deleteIds).then(res => {
					if (res.code === 200) {
						this.deleteIds = []
						this.getData()
						this.msgSuccess(res.msg)
					} else {
						this.msgError(res.msg)
					}
				}).catch(() => {
					this.msgError("请求失败")
				})
			},
			submitUpload(id) {
				// 获取文件上传表单的对象
				this.typeMap.type1.forEach(item => {
					if(item.id === id){
						this.obj = item;
						return
					}
				})
				this.typeMap.type3.forEach(item => {
					if(item.id === id){
						this.obj = item
						return
					}
				})
			},
			uploadSuccess(response, file, fileList) {
				// 上传成功后
				if(response.code === 200) {
					this.obj.value = response.data.url
					this.msgSuccess(response.msg)
					this.fileList = []
				}

			},
			uploadError(err, file, fileList) {
				this.msgError(err.msg)
				this.fileList = []
			},
			// 上传前校验文件，设置上传大小
			onBeforeUpload(file)
			{
				const isIMAGE = file.type === 'image/jpeg'||'image/gif'||'image/png';
				const isLt1M = file.size / 1024 / 1024 < 15;

				if (!isIMAGE) {
					this.$message.error('上传文件只能是图片格式!');
				}
				if (!isLt1M) {
					this.$message.error('上传文件大小不能超过 15MB!');
				}
				return isIMAGE && isLt1M;
			},
			handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			},


		}
	}
</script>

<style scoped>

</style>