<template>
        <div class="chargeorder boxright">
           <div class="filter-container">
              <el-input
                placeholder="请输入订单编号"
                v-model="keywords"
                style="width: 150px;"
                class="filter-item"
                clearable
              />
              <el-input
                placeholder="请输入充值账号"
                v-model="keywords"
                style="width: 150px;"
                class="filter-item"
                clearable
              />
              <el-date-picker
                v-model="datalist"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="Datetime"
                value-format="yyyy-MM-dd"
                style="position:relative; top:-4px; width:380px;"
              ></el-date-picker>             
              <el-select clearable v-model="category" placeholder="选择号码类型">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
              </el-select>              
              <el-select clearable v-model="status" placeholder="选择订单状态">
                  <el-option v-for="item in typelist" :key="item.value" :value="item.Text">
                  </el-option>
              </el-select>
              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getlist(1,indextab,status)">搜索</el-button>
              <el-button
                class="filter-item"
                style="margin-left: 10px;"
                type="primary"
                icon="el-icon-edit"
               @click="getexport(1,indextab,status)"
              >导出订单</el-button>
            </div>
            <el-table class="ord-table" :cell-style="cellstyle" :header-cell-style="rowclass" :summary-method="gettotal" show-summary stripe border :data="tableData" style="width: 100%;" :default-sort="{prop: 'number', order: 'descending'}">
                <el-table-column prop="Order" label="订单编号" width="200">
                </el-table-column>
                <el-table-column prop="ChargeOrderNum" label="外部订单编号" width="200">
                </el-table-column>
                <el-table-column prop="Phone" label="手机号码" width="200">
                </el-table-column>
                <el-table-column prop="Category" :formatter="getcate" label="类型" width="150">
                </el-table-column>
                <el-table-column prop="Amount" label="充值金额" width="150">
                </el-table-column>
                <el-table-column prop="ActualPrice" label="实扣金额" width="150">
                </el-table-column>
                <el-table-column prop="CreateTimeStr" label="时间" width="250">
                </el-table-column>
                <el-table-column prop="Status" :formatter="getstat" label="状态">
                </el-table-column>
            </el-table>
            <div class="pag">
                <div class="block">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 50]" :page-size="sum" layout="total, sizes, prev, pager, next, jumper" :total="totlepage.Count">
                    </el-pagination>
                </div>
            </div>
        </div>
</template>

<script>
    import request from "@/utils/request";
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
    import scriptloader from 'script-loader'
    export default {
        data() {
            return {
                Datetime: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                options: [{
                    value: '1',
                    label: '移动'
                }, {
                    value: '2',
                    label: '联通'
                }, {
                    value: '3',
                    label: '电信'
                }],
                tableData: [],
                indextab: -1, //展示index
                status: '', //状态
                page: 1, //分页
                sum: 10,
                keywords: '', //关键词搜索
                telnum: '', //充值账号
                category: '', //类型
                typelist: [], //分类列表
                totlepage: '', //页数
                datalist: [], //时间
            }
        },
        created() {
            var _this = this;
            request({
                method: 'get',
                url: '/ChargeOrder/OrderDropDownList',
            }).then(function(response) {
                if (response.Status == 1) {
                    _this.typelist = response.Model.slice(0, 4);
                }

            });
            this.getlist(1)
        },
        methods: {
            //合计
            gettotal(param) {
                const {
                    columns,
                    data
                } = param;
                const sums = [];
                var values = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '总计';
                        return;
                    }

                    if (index === 5) {
                        sums[5] = '￥' + this.totlepage.Amount;
                    } else {
                        return;
                    }
                });
                return sums;
            },
            //分页
            handleCurrentChange(val) {
                this.getlist(val)
            },
            handleSizeChange(val) {
                this.sum = val;
                this.getlist()
            },
            //居中
            cellstyle(row, colum, rowIndex, columnIndex) {
                if (row.column.label === '状态' && row.row.Status == 0) {
                    return 'color:#409eff;text-align:center'
                }
                if (row.column.label === '状态' && row.row.Status == 1) {
                    return 'color:#e6a23c;text-align:center;'
                }
                if (row.column.label === '状态' && row.row.Status == 2) {
                    return 'color:#67c23a;text-align:center;'
                }
                if (row.column.label === '状态' && row.row.Status == 3) {
                    return 'color:#f56c6c;text-align:center'
                }
                if (row.column.label === '类型' && row.row.Category == 1) {
                    return 'color:#409eff;text-align:center'
                }
                if (row.column.label === '类型' && row.row.Category == 2) {
                    return 'color:#e6a23c;text-align:center'
                }
                if (row.column.label === '类型' && row.row.Category == 3) {
                    return 'color:#67c23a;text-align:center;'
                }
                return "text-align:center";
            },
            rowclass({
                row,
                rowIndex
            }) {
                return "text-align:center";
            },
            // 获取列表
            getlist: function(page, index, value) {
                var statustr;
                this.indextab = index;
                for (var i in this.typelist) {
                    if (this.typelist[i].Text == value) {
                        statustr = i;
                    }
                }
                var startdata;
                var enddata;
                var _this = this;
                if (this.datalist == '' || this.datalist == null) {
                    startdata = '';
                    enddata = ''
                } else {
                    startdata = this.datalist[0].format("yyyy-MM-dd");
                    enddata = this.datalist[1].format("yyyy-MM-dd");
                }
                var param = {
                    page: page,
                    sum: this.sum,
                    order: this.keywords,
                    status: statustr,
                    phone: this.telnum,
                    category: this.category,
                    starttime: startdata,
                    endtime: enddata
                };
                request({
                    method: 'get',
                    url: '/ChargeOrder/GetOrderList',
                    params: param
                }).then(function(response) {
                    if (response.Status == 1) {
                        _this.tableData = response.List.DataList;
                        for (var i in _this.tableData) {
                            _this.tableData[i].Amount = '￥' + _this.tableData[i].Amount;
                            _this.tableData[i].ActualPrice = '￥' + _this.tableData[i].ActualPrice;
                        }
                        _this.totlepage = response.ModelSum;
                    }
                });
            },
            //过滤状态
            getcate: function(data) {
                if (data.Category == 1) {
                    return '移动'
                }
                if (data.Category == 2) {
                    return '联通'
                }
                if (data.Category == 3) {
                    return '电信'
                }
            },
            //过滤类型
            getstat: function(data) {
                if (data.Status == 0) {
                    return '代充值'
                }
                if (data.Status == 1) {
                    return '充值中'
                }
                if (data.Status == 2) {
                    return "成功"
                }
                if (data.Status == 3) {
                    return '失败'
                }
				
                return '充值中'
            },
            //下载文件
            getexport: function(page, index,value) {
                var _this = this;
                var tablelist;
                var statustr;
                if(value == ""){
                    value = -1;
                    for (var i in this.typelist) {
                        if (this.typelist[i].Text == value) {
                            statustr = i;
                        }
                    }
                }else{
                    for (var i in this.typelist) {
                        if (this.typelist[i].Text == value) {
                            statustr = i;
                        }
                    }
                } 
                this.$confirm('你确定要导出文件吗？', '提示', {
                        distinguishCancelAndClose: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    .then(() => {
                        if (_this.tableData == '') {
                            this.$message({
                                message: '导出内容不能为空！',
                                type: 'error'
                            });
                            return;
                        } else {
                            var startdata;
                            var enddata;
                            if (this.datalist == '' || this.datalist == null) {
                                startdata = '';
                                enddata = ''
                            } else {
                                startdata = this.datalist[0].format("yyyy-MM-dd");
                                enddata = this.datalist[1].format("yyyy-MM-dd");
                            }
                            var param = {
                                order: this.keywords,
                                status: statustr,
                                phone: this.telnum,
                                category: this.category,
                                starttime: startdata,
                                endtime: enddata
                            };
                            request({
                                method: 'get',
                                url: '/ChargeOrder/ExcelNew',
                                params:param
                            }).then(function(response) {
                                if (response.Status == 1) {
                                    tablelist = response;
                                    require.ensure([], () => {
                                        //这里的require的路径要写对，不然运行会有错误
                                        const {
                                            export_json_to_excel
                                        } = require('@/vendor/export2Excel');
                                        const tHeader = tablelist.TableTitle;
                                        const filterVal = tablelist.TableField;
                                        const list = tablelist.List;
                                        const data = _this.formatJson(filterVal, list);
                                        export_json_to_excel(tHeader, data, '话费订单列表');
                                    })
                                    _this.$message({
                                        type: 'success',
                                        message: '导出成功'
                                    });
                                }
                            });
                        }
                    })
                    .catch(action => {});
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
        }
    };

</script>


<style>
    .orde {
        border-bottom: 1px solid #eeeeee;
        padding-bottom: 10px;
        margin-bottom: 20px;
    }

    .orde div {
        font-size: 20px;
        color: #393D49;
        line-height: 60px;
    }

    .ord-p p {
        float: left;
        line-height: 30px;
    }

    .ord-ipt {
        float: left;
        width: 75%;
    }

    .pag {
        text-align: right;
        margin: 30px;
    }

    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
        width: 80%;
    }

    .cell {
        text-align: center;
    }

    .ord-table {
        margin-top: 20px;
    }

    .ords {
        margin-top: 10px;
    }

    .ord-sect {
        width: 60%;
    }

    .el-main {
        padding-bottom: 0;
    }

</style>
