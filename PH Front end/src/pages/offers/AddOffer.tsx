import React from 'react';
import { useForm, Controller } from "react-hook-form";
import type { OfferDTO } from "../../types/interfaces";
import { addOffer, formatDateTimeLocal } from "../../services/offerService";
import showNotification from "../../components/Notification/showNotification";
import { Form, Input, Button, Select, Checkbox, DatePicker, InputNumber, Row, Col, Typography } from "antd";
import dayjs from "dayjs";

const { Option } = Select;
const { Title } = Typography;

interface AddOfferProps {
  onClose: () => void;
  setOffers: React.Dispatch<React.SetStateAction<OfferDTO[]>>;
}

const AddOffer: React.FC<AddOfferProps> = ({ onClose, setOffers }) => {
  const { control, handleSubmit, watch, reset, formState: { errors } } = useForm<any>({
    defaultValues: {
      offerText: '',
      discountType: 'FLAT',
      discountValue: null,
      validFrom: dayjs(),
      validTo: dayjs().add(10, 'day'),
      isActive: true
    }
  });

  const discountType = watch('discountType');
  const validFrom = watch('validFrom');

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
      id: 0,
      validFrom: data.validFrom ? data.validFrom.format('YYYY-MM-DDTHH:mm') : null,
      validTo: data.validTo ? data.validTo.format('YYYY-MM-DDTHH:mm') : null,
      discountValue: data.discountType === 'BOGO' ? null : Number(data.discountValue),
    };

    try {
      const addedOffer = await addOffer(payload);
      if (!addedOffer) throw new Error('Failed to add offer');
      setOffers((prevOffers) => [...prevOffers, addedOffer]);

      reset();
      onClose();
      showNotification.success("Offer Added successfully");
    } catch (error) {
      console.error(error);
      showNotification.error('Error adding offer');
    }
  };

  return (
    <div style={{ padding: 20, background: '#fff', borderRadius: 8, maxWidth: 600 }}>
      <Title level={3} style={{ marginBottom: 20 }}>Add New Offer</Title>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Offer Name" validateStatus={errors.offerText ? 'error' : ''} help={errors.offerText?.message as string}>
              <Controller
                name="offerText"
                control={control}
                rules={{ required: 'Offer name is required' }}
                render={({ field }) => <Input {...field} placeholder="Enter offer name" />}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Discount Type">
              <Controller
                name="discountType"
                control={control}
                render={({ field }) => (
                  <Select {...field}>
                    <Option value="BOGO">BOGO</Option>
                    <Option value="FLAT">Flat</Option>
                    <Option value="PERCENTAGE">Percentage</Option>
                  </Select>
                )}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            {discountType !== 'BOGO' && (
              <Form.Item label="Discount Value" validateStatus={errors.discountValue ? 'error' : ''} help={errors.discountValue?.message as string}>
                <Controller
                  name="discountValue"
                  control={control}
                  rules={{
                    required: 'Discount value is required',
                    min: { value: 0.01, message: 'Must be greater than 0' }
                  }}
                  render={({ field }) => <InputNumber {...field} style={{ width: '100%' }} min={0} />}
                />
              </Form.Item>
            )}
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Valid From" validateStatus={errors.validFrom ? 'error' : ''} help={errors.validFrom?.message as string}>
              <Controller
                name="validFrom"
                control={control}
                rules={{ required: 'Starting date is required' }}
                render={({ field }) => <DatePicker {...field} showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Valid To" validateStatus={errors.validTo ? 'error' : ''} help={errors.validTo?.message as string}>
              <Controller
                name="validTo"
                control={control}
                rules={{
                  required: 'Ending date is required',
                  validate: (val) => !val || !validFrom || val.isAfter(validFrom) || 'Must be after start date'
                }}
                render={({ field }) => <DatePicker {...field} showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form.Item>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => <Checkbox checked={field.value} {...field}>Is Active?</Checkbox>}
              />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit">Submit</Button>
        </div>

      </Form>
    </div>
  );
};

export default AddOffer;
