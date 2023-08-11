import Image from 'next/image';
import {FC} from 'react';

import InputAutosize from '@/components/common/input-autosize';
import useToast from '@/core-ui/toast';
import api from '@/data/api';
import useTask from '@/states/task/use-task';
import {IBaseProps} from '@/types';
import {TaskTypeData} from '@/utils/constant';
import {getTaskType} from '@/utils/task';
import {ToastContents} from '@/utils/toast-content';

import Type from '../type';

const Left: FC<IBaseProps> = ({className}) => {
  const toast = useToast();
  const {task, write, update} = useTask();

  const taskSymbol = task?.todolist.taskSymbol;
  const order = task?.order;

  const taskType = getTaskType(task.type);
  const taskOrder = `${taskSymbol}-${order}`;

  const handleSave = (text: string) => {
    api.task.update({id: task.id, name: text}).then(update);
  };

  const onSelectType = (type: string) => {
    api.task
      .update({id: task.id, type})
      .then(update)
      .catch(() => toast.show({type: 'danger', title: 'Type', content: ToastContents.ERROR}));
  };

  return (
    <div className={className}>
      <Type
        data={TaskTypeData}
        title="CHANGE ISSUE TYPE"
        trigger={
          <div className="flex w-28 space-x-2">
            <Image src={`/icons/${taskType?.icon}`} alt={taskType?.text} width={40} height={32} />
            {taskSymbol && order && <span className="text-h3 font-normal">{taskOrder}:</span>}
          </div>
        }
        onSelect={value => onSelectType(value)}
      />
      <InputAutosize {...{handleSave, role: 'title', value: task.name, write}} />
    </div>
  );
};

export default Left;
