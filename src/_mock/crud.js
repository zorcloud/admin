/**
 * 模拟CRUD数据
 */
export default function crud({ toSuccess, toError, mock }) {
  return {
    // 表格带分页
    'POST /api/crud/getList': options => {
      const data = JSON.parse(options.body);
      const { showCount, currentPage } = data;
      const idbase = (currentPage - 1) * 10 + 1;
      // const paramMap = body.paramMap;
      const deptName = data.paramMap?.deptName;

      if (deptName === 'abcd') {
        return toSuccess(
          mock({
            currentPage: currentPage,
            showCount,
            totalResult: 0,
            totalPage: 0,
            dataList: []
          })
        );
      }

      return toSuccess(
        mock({
          currentPage: currentPage,
          showCount,
          totalResult: 100,
          totalPage: 10,
          [`dataList|${showCount}`]: [
            {
              'id|+1': idbase,
              deptName: deptName ? deptName : '@cword(3, 5)',
              'distributionNetwork|1': ['0', '1'],
              address: '@county()',
              type: '@cword(3)',
              planBeginTime: '@date',
              planEndTime: '@date',
              'workEmployee|1-3': [
                {
                  'key|+1': 1,
                  title: '@cname'
                }
              ],
              content: '@csentence'
            }
          ]
        })
      );
    },
    '/api/crud/bathDelete': options => toSuccess({ options }),
    '/api/crud/getWorkEmployee': options =>
      mock({
        status: true,
        'data|10': [
          {
            'key|+1': 1,
            title: '@cname'
          }
        ]
      }),
    '/api/crud/save': options => toSuccess({ options })
  };
}
